var archiver = require('archiver');
const fs = require('fs');
const unzip = require('unzip');
const fstream = require('fstream');
var sourceFile = require("./sourceFiles.js");


//Function achieved directory
async function achieveData() {
    let output = fs.createWriteStream(sourceFile.archievePath);
    let archive = archiver('zip');
    
    output.on('close', function() {
        console.log(archive.pointer() + ' total bytes');
        console.log('archiver has been finalized and the output file descriptor has closed.');
    });
    
    archive.on('error', function(err) {
        throw err;
    });
    
    archive.pipe(output);
    
    archive.directory(sourceFile.pathToDumpAchieve, true, { date: new Date() });
    // archive.directory('uploads', true, { date: new Date() });
    
    archive.finalize();
    }
    achieveData();