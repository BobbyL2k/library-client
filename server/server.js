var express = require('express');
var app = express();
var library = require('./route/library.js');

var sv = app.listen(3000,function(){
});
function run(){
	var db = require('./db.js').Library("test.sql",function(){
		app.use('/library',library(db));
		console.log("initialized");
	});
	exports.db = db
}
run();