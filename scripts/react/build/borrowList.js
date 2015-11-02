var c_server_address = "http://127.0.0.1";
var c_server_port = "3000";
var c_server_prefix = "library";

function getServerAddress (postfix) {
	return c_server_address+':'+c_server_port+'/'+c_server_prefix+postfix;
}

var g_borrower_list = [];
var g_book_list = [];
var g_currentBorrowerData = {};

(function() {
	loadDumpData();
	re_render_book_table();
})();

function loadDumpData () {
	console.log("main function called");
	$.getJSON( getServerAddress("/dump"), process_data);
}

function process_data(data) {
	if(!data){
		throw "new bookData is undefined";
	}
	if(!data.borrowerList){
		throw "borrowerList is undefined";
	}
	g_borrower_list = data.borrowerList;
	if(!data.book){
		throw "borrowerList is undefined";
	}
	g_book_list = data.book;

	for(var c=0; c<g_borrower_list.length; c++){
		function getBookNameById(id){
			for(var c=0; c<g_book_list.length; c++){
				if(g_book_list[c].id == id)
					return g_book_list[c].bookName;
			}
			return "???";
		}
		g_borrower_list.bookName = getBookNameById(g_borrower_list.id);
	}
	re_render_book_table();
}

function re_render_book_table () {
	React.render(
		React.createElement(ReactSelectableTable, {
			visibleIndex: ['id','borrower', 'time'], 
			list: g_borrower_list, 
			selectedObject: g_currentBorrowerData, 
			setObjectCallback: 
				function(object){
					console.log(object, 'selected from table selection');
					g_currentBorrowerData = object;
					re_render_book_table();
				}
			}),
		document.getElementById('react-form')
		);
}