var c_server_address = "http://127.0.0.1";
var c_server_port = "3000";

var g_username = "admin";
var g_password = "admin";
var g_bookData = {
	value: {},
	initialized: false,
	set: function(bookData){
		if(!bookData.index || !bookData.searchableIndex || !bookData.book){
			throw "bookData data is incomplete";
		}
		g_bookData.value = bookData;
		g_bookData.initialized = true;
	},
	getIndex: function(){
		if(!g_bookData.initialized)
			throw "g_bookData not initialized"
		return g_bookData.value.index;
	},
	getSearchableIndex: function(){
		if(!g_bookData.initialized)
			throw "g_bookData not initialized"
		return g_bookData.value.searchableIndex;
	},
	getAllBook: function(){
		if(!g_bookData.initialized)
			throw "g_bookData not initialized"
		return g_bookData.value.book;
	},
	getBookToShow: function(searchTerm){
		if(searchTerm === undefined)
			return g_bookData.getAllBook();
		var new_bookData = [];
		var all_book = g_bookData.getAllBook();
		for(var c=0; c<all_book.length; c++){
			if(book_search_match(searchTerm, all_book[c]))
				new_bookData.push(all_book[c]);
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
	getNoCheck: function (){
		try{
			return g_currentBook.get();
		}catch(e){
			if(e == "No book selected")
				return undefined;
			else
				throw e;
		}
	},
	set: function setCurrentBook(currentBook){
		console.log("Setting Selected Book ID:", currentBook);
		if(g_currentBook.value == currentBook)
			g_currentBook.value = -1;
		else
			g_currentBook.value = currentBook;
		console.log("Selected Book ID:", g_currentBook.value);
		re_render_book_table();
	}
};


(function (){
	//main();
	process_data(
		{
			index: ["id","name"],
			searchableIndex: ["name"],
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

function book_search_match(searchTerm, book){
	if(searchTerm === undefined)
		return true;
	var searchableIndex = g_bookData.getSearchableIndex();
	for( key in book ){
		if( searchableIndex.indexOf(key) != -1 && book[key].indexOf(searchTerm) != -1 ){
			return true;
		}
	}
	return false;
}

function search_input(domElement){
	console.log(domElement.value);
	re_render_book_table(domElement.value);
}

function re_render_book_table(searchTerm){
	React.render(
		React.createElement(BookTable, {
			index: g_bookData.getSearchableIndex(), 
			list: g_bookData.getBookToShow(searchTerm), 
			selectedBook: g_currentBook.getNoCheck(), 
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