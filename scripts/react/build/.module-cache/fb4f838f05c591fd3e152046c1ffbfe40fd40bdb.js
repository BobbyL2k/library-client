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

BookTableIndex = React.createClass({displayName: "BookTableIndex",
	render: function(){

	}
})

BookTable = React.createClass({displayName: "BookTable",
	render: function(){
		var list = this.props.list,
			index = this.props.index;
		for (var c = 0; c < list.length; c++) {
			list[c] = (React.createElement(BookItem, {key: c, book: list[c], index: index}));
		};
		for (var c = 0; c < index.length; c++) {
			index[c] = (React.createElement(BookTableIndex, {index: index}));
		}
		var table = (
		React.createElement("table", {class: "table table-responsive table-bordered"}, 
			React.createElement("thead", null, 
				React.createElement("tr", null, 
					index
				)
			), 
			React.createElement("tbody", null, 
				list
			)
        ));
		return (
			React.createElement("div", null, 
				table
			)
			);
	}
});