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

    const query = client.query(new pg.Query("select * from video_creatives where party = 'first_party'"))
    query.on('row', (row) => {
            let obj = {}
            obj.id = row.flight_id
            obj.filename = row.filename
            arr.push(obj)
    })
    query.on('end',  (res) => {
        // pool shutdown console.log("ending");
        console.log("ending", arr);
        pool.end()
        arr.map((item, index) => {
            console.log(`ITEM = ${item.filename} S`);
            console.log(`ID = ${item.id}`)
            let newPath = `${sourceFile.newCdnPathVideo}/${item.id}`
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
        fs.access(`${sourceFile.cdnPathVideo}/${filename}`, fs.F_OK, async(err) => {
            if (err) {
                console.error('Path does not exists')
                return isDone =  false;
            } else {
                console.log('directory does exist');
                let inStr = await fs.createReadStream(`${sourceFile.cdnPathVideo}/${filename}`);
                let outStr = await fs.createWriteStream(`${filePath}/${filename}`);
                inStr.pipe(outStr);
                return isDone = true;
            }

        })
        return isDone;

    } catch (err) {
        if (err.code === 'ENOENT') {
            fs.access(`${sourceFile.cdnPathVideo}/${filename}`, fs.F_OK, async(err) => {
                if (err) {
                    console.error('Path does not exists')
                    return isDone =  false;
                } else {
                    console.log('directory does not exist');
                    await shell.mkdir('-p', filePath);
                    let inStr = await fs.createReadStream(`${sourceFile.cdnPathVideo}/${filename}`);
                    let outStr = await fs.createWriteStream(`${filePath}/${filename}`);
                    inStr.pipe(outStr);
                    return  isDone = true;
                }

            })
            return isDone;
        }
    }
}

