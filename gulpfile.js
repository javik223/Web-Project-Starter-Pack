// <reference path='./config.json'>
/* jshint esversion: 6 */
/* global require */
/* jshint node: true */


// Dependencies
const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const kit = require('gulp-kit');
const plumberNotifier = require('gulp-plumber-notifier');
const notifier = require('node-notifier');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const merge = require('utils-merge');
const babelify = require('babelify');
const autoprefixer = require('gulp-autoprefixer');
const watchify = require('watchify');
const es = require('event-stream');
const imagemin = require('gulp-imagemin');
const imageminJpegRecompress = require('imagemin-jpeg-recompress');
const imageminPngquant = require('imagemin-pngquant');
const imageminSvgo = require('imagemin-svgo');
const imageminGifsicle = require('imagemin-gifsicle');
const gutil = require('gulp-util');
const tsify = require('tsify');
const glob = require('glob');

/**
 * Settings
 */

const env = 'dev'; // Programming Environment – production || development

const settings = require('./config.json'); // Assets and Folder Settings

const sassOptions = settings.sass_options; // Sass options - resides in config.json file

/**
 * Basic Gulp task that serves and initiates all watches
 */
gulp.task('serve', ['watchers'], () => {
    /**
     * Start browserSync
     * Comment 'server' & uncomment the 'proxy' object, if you wish to use a proxy server
     */
  browserSync.init({
    server: './',
    files: ['assets/css/*.css', '**/*.twig'],
    match: '*.css',
    // proxy: {
    // //   target: 'localhost:3200',
    //   ws: true,
    // },
  });
});

/**
 * gulp Watcher tasks
 */
gulp.task('watchers', () => {
  gulp.watch(`${settings.sass.src_dir}/**/*.scss`, ['sass']);  // Sass

  gulp.watch(`${settings.js.src_dir}/**/*.js`, ['watchify']); // Source Js

  gulp.watch(`${settings.js.dest_dir}/**/*.js`).on('change', browserSync.reload); // Destination Js - reload browser

  gulp.watch(`${settings.kit.src_dir}/**/*.kit`, ['kit']); // Kit

  // Disabled in favour of Webpack
  // gulp.watch(`${settings.ts.src_dir}/**/*.ts`, ['watchify-ts']); // Typescript

  gulp.watch(`${settings.image.src_dir}/**/*.*`, ['copyImages']); // Copy Images

  gulp.watch('*.html').on('change', browserSync.reload); // Html - reload browser
});


/**
 * Copy image assets from source to destination
 */
gulp.task('copyImages', () => {
  gulp.src(`${settings.image.src_dir}/**/*.{jpg,jpeg,png,svg,bmp}`)
        .pipe(gulp.dest(settings.image.dest_dir));
});

/**
 * Compress Images
 */
gulp.task('compressImages', (done) => {
  glob(`${settings.image.dest_dir}/*`, (err, files) => {
    if (err) done(err);

    const tasks = files.map(entry => gulp.src(entry)
                        .pipe(imagemin([
                          imagemin.gifsicle(),
                          imageminJpegRecompress({ quality: 'medium', target: 0.9991 }),
                          imageminPngquant({ quality: 85 }),
                          imagemin.svgo(),
                        ]))
                        .pipe(gulp.dest(settings.image.dest_dir)));
    es.merge(tasks).on('end', done);
  });
});

/**
 * Compile sass into CSS
 * Compiled file becomes *.min.css in the destination folder
 */
gulp.task('sass', () => gulp.src(`${settings.sass.src_dir}/**/*.scss`) // change to /app.scss to watch only the main app scss file
        .pipe(plumberNotifier())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(sass(sassOptions))
        .pipe(autoprefixer())
        .pipe(gulp.dest(settings.css.dest_dir))
        .pipe(rename({
          suffix: '.min',
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(settings.css.dest_dir)));

/**
 * Watch and transpile es6 codes to javascript
 */
gulp.task('watchify', () => {
  function bundle_js(bundler) {
    return bundler.bundle()
    .on('error', function error(err) {
      notifier.notify({
        title: 'Javascript error',
        message: err.message,
      });
      gutil.log(gutil.colors.bgRed('Browserify error: ', err));
      this.emit('end');
    })
    .pipe(source(settings.js.dest_file))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(settings.js.dest_dir));
  }

  const args = merge(watchify.args, { debug: true });
  const bundler = watchify(browserify(`${settings.js.src_dir}/${settings.js.src_file}`, args)).transform(babelify, { presets: ['es2015'], sourceMapsAbsolute: true });
  bundle_js(bundler);

  bundler.on('update', () => {
    bundle_js(bundler);
  });
});

/**
 * Convert all .kit files into html
 */
gulp.task('kit', () => gulp.src(`${settings.kit.src_dir}/**/*.kit`)
        .pipe(plumberNotifier())
        .pipe(kit())
        .pipe(gulp.dest(settings.kit.dest_dir)));


/**
 * Transpile Typescript codes to Javascript
 * Default output file is bundle.js. Settings can be found in config.js
 */
// gulp.task('watchify-ts', () => {
//   const bundler = watchify(browserify({
//     basedir: settings.ts.basedir,
//     // debug: true,
//     entries: settings.ts.entries,
//     cache: {},
//     packageCache: {},
//     verbose: true,
//     delay: 10,
//     poll: true,
//     exclude: /node_modules/,
//   }).plugin(tsify));

//   bundle_ts(bundler);

//   bundler.on('update', () => {
//     bundle_ts(bundler);
//   });
//   bundler.on('log', gutil.log);
// });

// function bundle_ts(bundler) {
//   return bundler
//         .transform('babelify', {
//           presets: ['es2015'],
//           extensions: ['.ts'],
//         })
//         .bundle()
//         .on('error', function error(err) {
//           notifier.notify({
//             title: 'Typescript error',
//             message: err.message,
//           });
//           gutil.log(gutil.colors.bgRed('Browserify error: ', err));
//           this.emit('end');
//         })
//         .pipe(source(settings.ts.dest_file)) // Rename bundle.js to required final file
//         .pipe(buffer())
//         .pipe(sourcemaps.init({ loadMaps: true }))
//         .pipe(uglify())
//         // .pipe((env == 'production') ? uglify() : '')
//         .pipe(sourcemaps.write('./'))
//         .pipe(gulp.dest(settings.ts.dest_dir));
// }

// gulp.task('gen-upload-image-list', () => {
//   glob('uploads/**/*.+(jpg|jpeg|gif|png|bmp)', function (err, files) {
//     if (err) {
//       console.log(err);
//       return;
//     }

//     const fileObject = [];
//     const filePath = 'uploads/info.json';


//     files.forEach((elem) => {
//       fileObject.push(elem);
//     }, this);

//     fs.writeFile(filePath, JSON.stringify(fileObject), (err) => {
//       if (err) {
//         return console.log(err);
//       }

//       console.log(`${fileObject} > ${filePath}`);
//     });

//     console.log(JSON.stringify(fileObject));
//   });
// });

gulp.task('default', ['serve']);
