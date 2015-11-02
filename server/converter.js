XLSX = require('xlsx');
console.log(XLSX.readFile(process.argv[2]))
XLSX.utils.sheet_to_json(XLSX.readFile(process.argv[2]),function(err,data){
	console.log(data);
});