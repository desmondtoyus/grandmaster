var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cors = require('cors')
var app = express();
var port = process.env.PORT || 8089;

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: "application/vnd.api+json" }));
app.use(express.static(path.join(__dirname, './')))

app.listen(port, function(){
    console.log(`Listening on port ${port}`);
})

