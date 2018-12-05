var archiver = require('archiver');
const fs = require('fs');
const unzip = require('unzip');
const fstream = require('fstream');


//Function achieved directory
async function achieveData() {
    let output = fs.createWriteStream(__dirname+'/assets.zip');
    let archive = archiver('zip');
    
    output.on('close', function() {
        console.log(archive.pointer() + ' total bytes');
        console.log('archiver has been finalized and the output file descriptor has closed.');
    });
    
    archive.on('error', function(err) {
        throw err;
    });
    
    archive.pipe(output);
    
    archive.directory('assets', true, { date: new Date() });
    // archive.directory('uploads', true, { date: new Date() });
    
    archive.finalize();
    }
    
    // achieveData();
    
// Function unzips directory
    async function unzipData(params) {
        let readStream = fs.createReadStream('assets.zip');
        let writeStream = fstream.Writer('output');
         
        readStream
          .pipe(unzip.Parse())
          .pipe(writeStream)
    }

    // unzipData();