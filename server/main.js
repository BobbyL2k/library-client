var spawn = require('child_process').spawn;
var lib;
module.exports = function(callback){
	var libraryServer = lib =spawn("node",["./server/server.js"]);
	libraryServer.stdout.on('data', function (data) {
	console.log(data);
	  callback();
	});
	libraryServer.stderr.on('data',function(data){
		console.log("error:" + data);
	})
}
process.on('exit', function() {
  lib.kill();
});