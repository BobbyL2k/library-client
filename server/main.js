var spawn = require('child_process').spawn;
var lib;
function main(callback){
	var libraryServer = lib =spawn("node",[__dirname + "/server.js"]);
	var isAlive = true;
	libraryServer.stdout.on('data', function (data) {
	  callback(data);
	});
	libraryServer.stderr.on('data',function(data){
		console.log("error:" + data);
	})
	var intervalId =
	setInterval(function(){//Heartbeat
		if(isAlive)
			libraryServer.stdin.write("x");
		else
			clearInterval(intervalId);
	},500);
	libraryServer.on('exit',resurrect);
	libraryServer.on('error',resurrect);
	function resurrect(){
		console.log("Server downed");
		isAlive = false;
		console.log("Restarting..");
		libraryServer.kill();
		process.nextTick(run);
	}
}
exports.run = run = function(callback){
	var born = 0;
	main(function(data){
		if(born==0&&callback)callback();
		born=1;
		//each heartbe
	});
}
console.log(__filename);
console.log(process.cwd());
if(require.main === module) {
		run(function(){
			console.log("server started");
		});
}
