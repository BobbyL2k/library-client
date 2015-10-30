BookItem = React.createClass({displayName: "BookItem",
	render: function() {
		var book = this.props.book,
			index = this.props.index;

		var str = "";
		for (var c = index.length - 1; c >= 0; c--) {
			if(book[index[c]])
				str += book[index[c]];
		};
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
			list[c] = (React.createElement(BookItem, {key: c, book: list[c], index: index}))
		};
		return (
			React.createElement("div", null, 
			list
			)
			);
	}
});