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
	value: undefined,
	getCurrentBook: function (searchTerm){
		if(g_currentBook.value !== undefined && book_search_match(searchTerm, g_currentBook.value))
			return g_currentBook.value;
		else
			throw "No book selected";
	},
	getCurrentBookNoCheck: function (searchTerm){
		try{
			return g_currentBook.getCurrentBook(searchTerm);
		}catch(e){
			if(e == "No book selected")
				return undefined;
			else
				throw e;
		}
	},
	getCurrentBookId: function (searchTerm){
		return g_currentBook.getCurrentBook(searchTerm).id;
	},
	getCurrentBookIdNoCheck: function (searchTerm){
		try{
			return g_currentBook.getCurrentBookId(searchTerm);
		}catch(e){
			if(e == "No book selected")
				return -1;
			else
				throw e;
		}
	},
	setId: function (currentBookId){
		console.log("Setting Selected Book ID:", currentBookId);
		if(g_currentBook.value === undefined || g_currentBook.value.id != currentBookId){
			var all_book = g_bookData.getAllBook();
			for (var c = all_book.length - 1; c >= 0; c--) {
				if(all_book[c].id == currentBookId){
					g_currentBook.value = all_book[c];
					break;
				}
			};
		}
		else{
			g_currentBook.value = undefined;
		}
		console.log("Selected Book:", g_currentBook.value);
		re_render_book_table();
	}
};


(function (){
	//main();
	process_data(
		{
			index: ["id","name"],
			searchableIndex: ["name","count"],
			book: [
			{
				id:"123",
				name:"eiei",
				count:2
			},
			{
				id:"124",
				name:"eiei2",
			},
			{
				id:"125",
				name:"eiei5",
				count:0
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
			selectedBookId: g_currentBook.getCurrentBookIdNoCheck(searchTerm), 
			onClickBook: g_currentBook.setId}),
		document.getElementById('book-table-container')
	);
	var currentBook = g_currentBook.getCurrentBookNoCheck();
	React.render(
		React.createElement("div", null, 
		React.createElement(EventButton, {
			className: "btn-primary", 
			disabled: currentBook==undefined || currentBook.count == 0, 
			buttonName: "ยืมหนังสือ", 
			onClick: borrow_book}), 
		React.createElement(EventButton, {
			className: "btn-danger", 
			disabled: currentBook==undefined || currentBook.count == currentBook.maxCount, 
			buttonName: "คืนหนังสือ", 
			onClick: return_book})
		),
		document.getElementById('button-container')
	);
}

function borrow_book(){
	var currentBook = g_currentBook.getCurrentBookId();
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
	var currentBook = g_currentBook.getCurrentBookId();
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