// jshint esversion: 6
const WebpackNotifierPlugin = require('webpack-notifier');

module.exports = {
  entry: './src/ts/app.ts',
  output: {
    path: `${__dirname}/assets/js/`,
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['', '.js', '.ts', '.tsx'],
  },
  plugins: [
    new WebpackNotifierPlugin({
      alwaysNotify: true,
      title: 'Webpack',
    }),
  ],
  devtool: 'source-map', // if we want a source map
  module: {
    loaders: [
      {
        test: /\.tsx?$/,
        // loader: 'awesome-typescript-loader',
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader',
      },
      {
        enforce: 'pre',
        test: /\.tsx?$/,
        use: 'source-map-loader',
      },
    ],
  },
};
