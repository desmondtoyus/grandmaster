var UglifyJS = require("uglify-js");
var code = require('./index');
var result = UglifyJS.minify(code);
console.log(result.error); // runtime error, or `undefined` if no error
console.log(result.code);