BookItem = React.createClass({displayName: "BookItem",
	render: function() {
		// var book = this.props.book,
		// 	index = this.props.index;
		// for (var c = index.length - 1; c >= 0; c--) {
		// };
		// var str = JSON.stringify(book);
		var str = "test";
		console.log('called');
		return (
			React.createElement("div", null, str)
		);
	}
});

BookTable = React.createClass({displayName: "BookTable",
	render: function(){
		var list = this.props.list,
			index = this.props.index;
		for (var c = 0; c < list.length; c++) {
			list[c] = (React.createElement(BookItem, {book: list[c], index: index}))
		};
		return (
			React.createElement("div", null, 
			list
			)
			);
	}
});