var c_server_address = "http://127.0.0.1";
var c_server_port = "3000";

var g_username = "admin";
var g_password = "admin";
var g_bookData = {
	value: {},
	initialized: false,
	set: function(bookData){
		g_bookData.value = bookData;
		g_bookData.initialized = true
	},
	getAllBook: function(){
		if(!g_bookData.initialized)
			throw "g_bookData not initialized"
		return g_bookData.value;
	},
	getBookToShow: function(searchTerm){
		if(searchTerm === undefined)
			return g_bookData.getAllBook();
		var new_bookData = [];
		for(var c=0; c<g_bookData.value.length; c++){
			var found = false;
			for( key in g_bookData ){
				if(g_bookData[key].indexOf(searchTerm) != -1){
					found = true;
					break;
				}
			}
			if(found)
				new_bookData.push(g_bookData.value[c]);
		}
		return new_bookData;
	}
};
var g_currentBook = {
	value:-1,
	get: function getCurrentBook(){
		if(g_currentBook.value < 0)
			throw "No book selected";
		return g_currentBook.value;
	},
	set: function setCurrentBook(currentBook){
		g_currentBook.value = currentBook;
		console.log("Selected Book ID:", g_currentBook.value);
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
	g_bookData.set(data);
	re_render_book_table();
}

function search_input(domElement){
	console.log(domElement.value);
}

function re_render_book_table(searchTerm){
	React.render(
		React.createElement(BookTable, {
			index: g_bookIndex, 
			list: g_bookData.getBookToShow(searchTerm).book, 
			onClickBook: g_currentBook.set}),
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
	console.log("Borrowing book ID:"+currentBook);
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
	console.log("Returning book ID:"+currentBook);
	$.post( c_server_address+"/return:"+c_server_port, request, checkResponse);
}

function checkResponse(res){
	if(data.status != "success")
		throw data.error;
}