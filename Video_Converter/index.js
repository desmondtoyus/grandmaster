

var express =require('express');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
var port = process.env.PORT || 3025;
var path = require('path');
// var ffmpeg = require('fluent-ffmpeg');


var app = express();

ffmpeg('http://video.bwacdn.com/Sy0m67K9Q.webm')
.withVideoCodec('libx264')
//   .audioCodec('libmp3lame')
//   .usingPreset('podcast')
.inputFormat('mp4')
.outputFormat('mp4')
.on('start', commandLine => {
    console.log('Spawned Ffmpeg with command: ' + commandLine);
  })
  .on('error', function(err) {
    console.log('An error occurred: ' + err.message);
  })
  .on('end', function() {
    console.log('Processing finished !');
  })
  .saveToFile('./video/desmond.mp4')
  // .saveToFile('./video/desmond.webm')


app.listen(port, function () {
    console.log(`Listening on port`, port);
})