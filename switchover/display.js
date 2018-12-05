var pg = require("pg");
const fs = require('fs');
const path = require('path');
var shell = require('shelljs');
// import { cdnPath, newCdnPath, archievePath, dumpCdnPath} from "./imported.js";
var sourceFile = require("./sourceFiles.js");

var connectionString = {
    user: 'adserver_master',
    host: 'adserver-db.c39logbtfzjv.us-west-2.rds.amazonaws.com',
    database: 'adserver_db',
    password: 's)A5^Z1$)QhESt#q',
    port: 5432
};

var pool = new pg.Pool(connectionString);
let arr = [];

pool.connect(async function (err, client, done) {

    const query = client.query(new pg.Query("select * from display_creatives where party = 'first_party';"))
    query.on('row', (row) => {
        // console.log(row);
        // if (row.flight_id) {
            let obj = {}
            obj.id = row.flight_id
            obj.filename = row.filename
            arr.push(obj)
        // }
    })
    query.on('end',  (res) => {
        // pool shutdown console.log("ending");
        console.log("ending", arr);
        pool.end()
        console.log('THE TOTAL =', arr.length)
        arr.map((item, index) => {
                console.log(`ITEM = ${item.filename} S`);
                console.log(`ID = ${item.id}`)
                console.log('THIS IS THE PATH =', sourceFile.cdnPathDisplay)
                let newPath = `${sourceFile.newCdnPathDisplay}/${item.id}`
               saveToPath(newPath, item.filename)
               .then(succ=>{
                if (index+1 == arr.length) {
                    console.log('INSIDE=> Done');
                }
               })
        })

    })
    query.on('error', (res) => {
        console.log(res);
    })

    done()

})

async function saveToPath(filePath, filename) {
    let isDone =false;
    try {
        fs.statSync(filePath);
        fs.access(`${sourceFile.cdnPathDisplay}/${filename}`, fs.F_OK, async(err) => {
            if (err) {
                console.error('Path does not exists 1')
                return isDone =  false;
            } else {
                console.log('directory does exist 1');
                let inStr = await fs.createReadStream(`${sourceFile.cdnPathDisplay}/${filename}`);
                let outStr = await fs.createWriteStream(`${filePath}/${filename}`);
                inStr.pipe(outStr);
                return isDone = true;
            }

        })
        return isDone;

    } catch (err) {
        if (err.code === 'ENOENT') {
            fs.access(`${sourceFile.cdnPathDisplay}/${filename}`, fs.F_OK, async(err) => {
                if (err) {
                    console.error(`Path does not exists 2 => ${sourceFile.cdnPathDisplay}/${filename}`)
                    return isDone =  false;
                } else {
                    console.log('directory does not exist 2');
                    await shell.mkdir('-p', filePath);
                    let inStr = await fs.createReadStream(`${sourceFile.cdnPathDisplay}/${filename}`);
                    let outStr = await fs.createWriteStream(`${filePath}/${filename}`);
                    inStr.pipe(outStr);
                    return  isDone = true;
                }

            })
            return isDone;
        }
    }
}

