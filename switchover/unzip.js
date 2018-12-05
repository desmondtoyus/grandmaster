var archiver = require('archiver');
const fs = require('fs');
const unzip = require('unzip');
const fstream = require('fstream');
var sourceFile = require("./sourceFiles.js");

// import { cdnPath, newCdnPath, archievePath, dumpCdnPath} from "./imported.js";


    
// Function unzips directory
    async function unzipData(params) {
        let readStream = fs.createReadStream(sourceFile.archieveFile);
        let writeStream = fstream.Writer(sourceFile.dumpUnzippedFile);
         
        readStream
          .pipe(unzip.Parse())
          .pipe(writeStream)
    }

    // unzipData();