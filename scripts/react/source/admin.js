var c_server_address = "http://127.0.0.1";
var c_server_port = "3000";
var c_server_prefix = "library";

function getServerAddress (postfix) {
	return c_server_address+':'+c_server_port+'/'+c_server_prefix+postfix;
}

var g_show_delete_modal = false;
function toggleDeleteModal(){
	g_show_delete_modal = !g_show_delete_modal;
	re_render_book_table();
}

var g_borrower_list_to_display = [];
var g_currentBorrowerData = {};

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
		if(!bookData.visibleIndex || !bookData.searchableIndex || !bookData.book || !bookData.borrowerList || !bookData.displayIndex){
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
		for(var c=0; c<g_bookData.value.borrowerList.length; c++){
			var borrowerData = g_bookData.value.borrowerList[c];
			if(borrowerData.id == bookId){
				resultList.push(borrowerData);
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
		// console.log("Setting Selected Book ID:", currentBookId);
		if(currentBookId != -1 && (g_currentBook.value === undefined || g_currentBook.value.id != currentBookId) ){
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
		// console.log("Selected Book:", g_currentBook.value);
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

var new_book_from_edit = {};

function clicked_on_book_to_edit (bookId) {
	g_currentBook.setId(bookId);
	var all_book = g_bookData.getAllBook();
	for(var c=0; c<all_book.length; c++){
		if(all_book[c].id == bookId)
			new_book_from_edit = JSON.parse(JSON.stringify(all_book[c]));
	}
	re_render_book_table();
}

function return_book_button_pressed(){
	console.log('return_book_button_pressed called');
	g_borrower_list_to_display = g_bookData.getBorrowerList(g_currentBook.getCurrentBook().id);
	console.log('g_borrower_list_to_display',g_borrower_list_to_display);
	toggleReturnModal();
}

function send_edit_book_data () {
	var data = JSON.stringify(new_book_from_edit);
	$.post(getServerAddress('/edit'), data, function(res) {
		console.log(res);
		main();
	});
}

function delete_book_data () {
	var data = JSON.stringify({
		id:g_currentBook.getCurrentBookId()
	});
	$.post(getServerAddress('/delete'), data, function (res) {
		console.log(res);
		toggleDeleteModal();
		g_currentBook.setId(-1);
		main();
	});
}

function re_render_book_table(newSearchTerm){
	console.log("Re-Rendering");
	if(newSearchTerm != undefined)
		g_last_search_value = newSearchTerm;
	var searchTerm = g_last_search_value;
	console.log("book selected:", g_currentBook.getCurrentBookIdNoCheck(searchTerm));
	React.render(
		<BookTable
			visibleIndex={g_bookData.getVisibleIndex()}
			displayIndex={g_bookData.value.displayIndex}
			list={g_bookData.getBookToShow(searchTerm)}
			selectedId={g_currentBook.getCurrentBookIdNoCheck(searchTerm)}
			onClickBook={clicked_on_book_to_edit}/>,
		document.getElementById('book-table-container')
	);
	// var currentBook = g_currentBook.getCurrentBookNoCheck(searchTerm);
	React.render(
		<div>
		<EventButton 
			className="btn-primary" 
			disabled={g_currentBook.value === undefined} 
			buttonName="ยืนยันการแก้ไข"
			onClick={send_edit_book_data}/>
		<EventButton 
			className="btn-danger" 
			disabled={g_currentBook.value === undefined} 
			buttonName="ลบหนังสือ"
			onClick={toggleDeleteModal}/>
		</div>,
		document.getElementById('button-container')
	);
	React.render(
		<div><BookEdit
		book={new_book_from_edit}
		displayIndex={g_bookData.value.displayIndex}/></div>,
		document.getElementById('book-details'));
	var style = {};
	if(g_show_delete_modal){
		style = {display:"block"};
	}
	else{
		style = {display:"none"};
	}
	console.log('g_borrower_list_to_display', g_borrower_list_to_display);
	borrower_input_box = (<SyncingTextField placeholder="ใส่ชื่อ หรือ รหัสประจำตัว" object={to_sync} property="borrower"/>);
	returner_selection_table = (<ReactSelectableTable
			visibleIndex={['id', 'borrower', 'time']}
			list={g_borrower_list_to_display}
			selectedObject={g_currentBorrowerData}
			setObjectCallback={function(object){
				console.log(object, 'selected from table selection');
				g_currentBorrowerData = object;
				re_render_book_table();
			}}/>);
	React.render( 
		<div style={style}>
		<ModalWarning
			header="ยืนยันการลบ"
			show={g_show_delete_modal}
			acceptCallback={delete_book_data}
			closeCallback={toggleDeleteModal}>
			คุณต้องการลบหนังสือออกจากระบบ ไม่สามารถย้อนกลับได้
		</ModalWarning>
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
			"borrower":g_currentBorrowerData.borrower
		}
	}
	request = JSON.stringify(request);
	console.log("Returning book ID:",currentBook);
	console.log("Returned by borrower:",g_currentBorrowerData.borrower);
	$.postJSON( getServerAddress("/return"), request, function (res) {
		checkResponse(res, function(){
			toggleReturnModal();
			main();
		});

	} );
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