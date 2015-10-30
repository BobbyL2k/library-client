var usr = "admin";
var pass = "admin";
var bookData = {};

try{
	//main();
	process_data();
}catch(e){
	console.log("Error message", e);
}



function main () {
	console.log("main function called");
	$.getJSON( "http://127.0.0.1:3000", process_data);
}

function process_data(data) {
	if(!data.index){
		throw "Index data not found";
	}
	if(!data.book){
		throw "Books data not found";
	}
	bookData = data;
	update();
}

function update(){
	React.render(
		React.createElement(BookTable, {index: index, content: tableData}),
		document.getElementById('list')
	);
}