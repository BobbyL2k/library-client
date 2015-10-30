var usr = "admin";
var pass = "admin";
var bookData = {};

try{
	//main();
	process_data(
		{
			index: ["id","name"],
			book: [
			{
				id:"123",
				name:"eiei"
			}
			]
		}
	);
}catch(e){
	console.log("Error message", e.message);
}



function main () {
	console.log("main function called");
	$.getJSON( "http://127.0.0.1:3000", process_data);
}

function process_data(data) {
	if(!data){
		throw "new bookData is undefined"
	}
	if(!data.index){
		throw "Index of new bookData is not found";
	}
	if(!data.book){
		throw "Books of new bookData is not found";
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