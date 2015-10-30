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
		var book = this.props.book,
			index = this.props.index;
		for(var c=0; c<index.length; c++){
			if(!book[index[c]])
				columns[c] = (React.createElement("td", {key: c}));
			else
				columns[c] = (React.createElement("td", {key: c}, book[index[c]]));
		}
		var columns = [];
		return (
			React.createElement("tr", null, 
				columns
			)
			);
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
			index[c] = (React.createElement("th", null, index[c]));
		};
		var table = (
		React.createElement("table", {className: "table table-responsive table-bordered"}, 
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