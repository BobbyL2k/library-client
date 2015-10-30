var c_server_address = "http://127.0.0.1";
var c_server_port = "3000";

var g_username = "admin";
var g_password = "admin";
var g_bookData = {};
var g_currentBook = {
	value:-1,
	get: function getCurrentBook(){
		if(g_currentBook.value < 0)
			throw "No book selected";
		return g_currentBook.value;
	},
	set: function setCurrentBook(currentBook){
		console.log("g_currentBook", g_currentBook);
		g_currentBook.value = currentBook;
		console.log("g_currentBook", g_currentBook.value);
	}
};



(function (){
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
})();



function main () {
	console.log("main function called");
	$.getJSON( c_server_address+":"+c_server_port, process_data);
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
	g_bookData = data;
	update();
}

function update(){
	React.render(
		React.createElement(BookTable, {index: g_bookData.index, list: g_bookData.book, onClickBook: g_currentBook.set}),
		document.getElementById('list')
	);
}

function borrow_book(){
	var currentBook = g_currentBook.get();
	var request = {
		"auth":{
			"usr":g_username,
			"pass":g_password
		},
		"book":{
			"key":currentBook
		}
	}
	request = JSON.stringify(request);
	$.post( c_server_address+"/borrow:"+c_server_port, request, checkResponse);
}

function return_book(){
	var currentBook = g_currentBook.get();
	var request = {
		"auth":{
			"usr":g_username,
			"pass":g_password
		},
		"book":{
			"key":currentBook
		}
	}
	request = JSON.stringify(request);
	$.post( c_server_address+"/return:"+c_server_port, request, checkResponse);
}

function checkResponse(res){
	if(data.status != "success")
		throw data.error;
}