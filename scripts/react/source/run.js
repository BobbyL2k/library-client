var c_server_address = "http://0.0.0.0";
var c_server_port = "3000";
var c_server_prefix = "library";

function getServerAddress (postfix) {
	return c_server_address+':'+c_server_port+'/'+c_server_prefix+postfix;
}

var g_show_borrow_modal = false;
var g_show_return_modal = false;
function toggleBorrowModal(){
	g_show_borrow_modal = !g_show_borrow_modal;
	re_render_book_table();
}
function toggleReturnModal(){
	g_show_return_modal = !g_show_return_modal;
	re_render_book_table();
}

var g_borrower_list_to_display = [];

var to_sync = {
	borrower:"",
	returner:""
};

var g_last_search_value = '';

var borrower_input_box;
var returner_input_box;

var g_username = "admin";
var g_password = "admin";
var g_bookData = {
	value: {},
	initialized: false,
	set: function(bookData){
		if(!bookData.visibleIndex || !bookData.searchableIndex || !bookData.book){
			throw "bookData data is incomplete";
		}
		g_bookData.value = bookData;
		g_bookData.initialized = true;
	},
	getVisibleIndex: function(){
		if(!g_bookData.initialized)
			throw "g_bookData not initialized"
		return g_bookData.value.visibleIndex;
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
	},
	getBorrowerList: function(bookId) {
		if(!g_bookData.initialized)
			throw "g_bookData not initialized"
		var resultList = [];
		for(var c=0; c<g_bookData.borrowerList.length; c++){
			var borrowerData = g_bookData.borrower_list[c];
			if(borrowerData.bookId){
				resultList.push(bookData);
			}
		}
		return resultList;
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
	main();
	// process_data(
	// 	{
	// 		visibleIndex: ["name", "count"],
	// 		searchableIndex: ["name"],
	// 		book: [
	// 		{
	// 			id:"123",
	// 			name:"eiei",
	// 			count:2
	// 		},
	// 		{
	// 			id:"124",
	// 			name:"eiei2",
	// 		},
	// 		{
	// 			id:"125",
	// 			name:"eiei5",
	// 			count:0
	// 		}
	// 		]
	// 	}
	// );
})();

function main () {
	console.log("main function called");
	$.getJSON( getServerAddress("/dump"), process_data);
}

function process_data(data) {
	if(!data){
		throw "new bookData is undefined"
	}
	if(!data.visibleIndex){
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
	searchTerms = searchTerm.split(' ');
	for(var c=0; c<searchTerms.length; c++){
		var searchableIndex = g_bookData.getSearchableIndex();
		var found = false;
		for( key in book ){
			var str = ''+book[key];
			if( searchableIndex.indexOf(key) != -1 && str.indexOf(searchTerms[c]) != -1 ){
				found = true;
				break;
			}
		}
		if(!found)
			return false;
	}
	return true;
}

function search_input(domElement){
	console.log(domElement.value);
	re_render_book_table(domElement.value);
}

function return_book_button_pressed(){
	var data = bookData.getBorrowerList(g_currentBook.getCurrentBook());
	g_borrower_list_to_display = data.borrower_list;
	toggleReturnModal();
}

function re_render_book_table(newSearchTerm){
	if(newSearchTerm != undefined)
		g_last_search_value = newSearchTerm;
	var searchTerm = g_last_search_value;
	console.log("book selected:", g_currentBook.getCurrentBookIdNoCheck(searchTerm));
	React.render(
		<BookTable
			visibleIndex={g_bookData.getVisibleIndex()}
			list={g_bookData.getBookToShow(searchTerm)}
			selectedBookId={g_currentBook.getCurrentBookIdNoCheck(searchTerm)}
			onClickBook={g_currentBook.setId}/>,
		document.getElementById('book-table-container')
	);
	var currentBook = g_currentBook.getCurrentBookNoCheck(searchTerm);
	React.render(
		<div>
		<EventButton 
			className="btn-primary" 
			disabled={currentBook==undefined || currentBook.count == 0} 
			buttonName="ยืมหนังสือ"
			onClick={toggleBorrowModal}/>
		<EventButton 
			className="btn-danger" 
			disabled={currentBook==undefined || currentBook.count == currentBook.maxCount} 
			buttonName="คืนหนังสือ"
			onClick={return_book_button_pressed}/>
		</div>,
		document.getElementById('button-container')
	);
	console.log("currentBook", currentBook);
	React.render(
		<div><BookInfo book={currentBook}/></div>,
		document.getElementById('book-details'));
	var style = {};
	if(g_show_borrow_modal){
		style = {display:"block"};
	}
	else{
		style = {display:"none"};
	}
	borrower_input_box = (<SyncingTextField placeholder="ใส่ชื่อ หรือ รหัสประจำตัว" object={to_sync} property="borrower"/>);
	returner_input_box = (<SyncingTextField placeholder="ค้นหา" object={to_sync} property="returner"/>);
	React.render(
		<div style={style}>
		<Modal
			header="ลงชื่อผู้ยืม"
			show={g_show_borrow_modal}
			acceptCallback={borrow_book}
			closeCallback={toggleBorrowModal}>
			{borrower_input_box}
		</Modal>
		<Modal
			header="ยืนยันผู้คือ"
			show={g_show_return_modal}
			acceptCallback={return_book}
			closeCallback={toggleReturnModal}>
			{returner_input_box/**/}
		</Modal>
		</div>,
		document.getElementById('modal-container')
	);
}

function borrow_book(){
	var currentBook = g_currentBook.getCurrentBookId();
	var request = {
		"auth":{
			"usr":g_username,
			"pass":g_password
		},
		"data":{
			"bookId":currentBook,
			"borrower":to_sync.borrower
		}
	}
	request = JSON.stringify(request);
	console.log("Borrowing book ID:"+currentBook);
	$.postJSON( getServerAddress("/borrow"), request, function(response){
		checkResponse(response, function(){
			toggleBorrowModal();
			main();
		});
	});
}

function return_book(){
	var currentBook = g_currentBook.getCurrentBookId();
	var request = {
		"auth":{
			"usr":g_username,
			"pass":g_password
		},
		"data":{
			"bookId":currentBook,
			"borrower":to_sync.returner
		}
	}
	request = JSON.stringify(request);
	console.log("Returning book ID:"+currentBook);
	$.postJSON( getServerAddress("/return"), request, checkResponse);
}

function checkResponse(res, callback){
	console.log(res);
	if(res.status != "success"){
		console.log("error on checkResponse");
		throw res.error;
	}
	if(callback)
		callback(res);
}