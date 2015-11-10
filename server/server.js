var express = require('express');
var app = express();
var library = require('./route/library.js');
var timeout = 3000;
var lastBeat;
var sv = app.listen(3000,function(){
});
function run(){
	var db = require('./db.js').Library("test.sql",function(){
		app.use('/library',library(db));
		lastBeat = process.hrtime();
		beat();
	});
	exports.db = db
}
ct = 3;
process.stdin.on('data',function(msg){
	beat();
})
function beat(){
	console.log("I'm alive");
}
run();
