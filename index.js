// jshint esversion: 6
// Creating an Mp3 Reader

// const fs = require('fs');

// const MP3File = './Jack Welch - Winning - Disc 4 - 01-It comes down to.mp3';
// const HEADER_SIZE = 10;

// fs.readFile(MP3File, (err, data) => {
//   if (err) { throw err; }

//   const { buffer } = data;

//   const header = new DataView(buffer, 0, HEADER_SIZE);

//   const major = header.getUint8(3);
//   const minor = header.getUint8(4);
//   const version = `ID3v2.${major}.${minor}`;
//   console.log(version);
// });

const fetch = require('node-fetch');

const url = fetch('http://www.google.com');
url.then(res => res.text()).then((body) => {
  console.log(body);
}).catch((err) => {
  console.log(err);
});
