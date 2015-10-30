var usr = "admin";
var pass = "admin";
var bookData = {};

main();

function main () {
	console.log("main function called");
	$.getJSON( "http://127.0.0.1:3000", function(data) {
		if(!data.index){
			throw "Index data not found";
		}
		if(!data.book){
			throw "Books data not found";
		}
		update();
	});
}

function update(){
	React.render(
		React.createElement(BookTable, {index: index, content: tableData}),
		document.getElementById('list')
	);
}