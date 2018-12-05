var express = require ('express')
var bodyParser = require('body-parser');
var path = require('path');
const port  = process.env.PORT || 8888 
var app = express();

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname,'')))

app.listen(port, function () {
    console.log(`Listening on ${port}`);
    
})