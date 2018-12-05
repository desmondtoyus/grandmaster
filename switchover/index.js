var pg = require("pg");
const fs = require('fs');
const path = require('path');
var shell = require('shelljs');

var connectionString = {
    user: 'adserver_dev',
    host: 'adserver-db-dev.cy0ghploatrr.us-west-2.rds.amazonaws.com',
    database: 'adserver_db_dev',
    password: 'sm0rgasb0rd',
    port: 5432
};

var pool = new pg.Pool(connectionString);
let arr = [];
let cdnPath = "assets";
let cdnPath2 = "assets2";

pool.connect(function (err, client, done) {

    const query = client.query(new pg.Query("SELECT * from display_creatives"))
    query.on('row', (row) => {
        // console.log(row);
        if (row.filename !== '' || row.filename) {
            let obj = {}
            obj.id = row.id
            obj.filename = row.filename
            arr.push(obj)
        }
    })
    query.on('end', (res) => {
        // pool shutdown console.log("ending");
        console.log("ending", arr);
        pool.end()
        arr.map((item, index) => {
            console.log(`ITEM = ${item.filename}`);
            console.log(`ID = ${item.id}`)
            let newPath = `${cdnPath2}/${item.id}`
            let pcount=0;
            let ncount=0;
            let saving = saveToPath(newPath, item.filename)
            console.log('dhdhd', saving)
            if (saving) {
                pcount++
                console.log(pcount, 'Complete');
            } else {
                ncount++,
                console.log(ncount, 'not found');
            }
            if (pcount + ncount > arr.length) {
                console.log('DONE TOTAL =', pcount);
            }
        })

    })
    query.on('error', (res) => {
        console.log(res);
    })

    done()

})
async function saveToPath(filePath, filename) {
    let isDone =false
    try {
        fs.statSync(filePath);
        fs.access(`${cdnPath}/${filename}`, fs.F_OK, async(err) => {
            if (err) {
                console.error('Path does not exists')
                isDone =  false;
            } else {
                console.log('directory does exist');
                await shell.mkdir('-p', filePath);
                let inStr = await fs.createReadStream(`${cdnPath}/${filename}`);
                let outStr = await fs.createWriteStream(`${filePath}/${filename}`);
                inStr.pipe(outStr);
                isDone = true;
            }

        })
        return isDone;

    } catch (err) {
        if (err.code === 'ENOENT') {
            fs.access(`${cdnPath}/${filename}`, fs.F_OK, async(err) => {
                if (err) {
                    console.error('Path does not exists')
                    isDone =  false;
                } else {
                    console.log('directory does not exist');
                    await shell.mkdir('-p', filePath);
                    let inStr = await fs.createReadStream(`${cdnPath}/${filename}`);
                    let outStr = await fs.createWriteStream(`${filePath}/${filename}`);
                    inStr.pipe(outStr);
                    isDone = true;
                }

            })
            return isDone;
        }
    }
}