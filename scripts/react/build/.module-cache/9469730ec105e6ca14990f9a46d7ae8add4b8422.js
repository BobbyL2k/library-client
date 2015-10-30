BookTableContent = React.createClass({displayName: "BookTableContent",
	render: function(){
		var book = this.props.book,
			index = this.props.index;
		var columns = [];
		// console.log(book);
		for(var c=0; c<index.length; c++){
			console.log(book[index[c]]);
			if(book[index[c]])
				columns[c] = (React.createElement("td", {key: c}, book[index[c]]));
			else
				columns[c] = (React.createElement("td", {key: c}, "-"));
		}
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
			list[c] = (React.createElement(BookTableContent, {key: c, book: list[c], index: index}));
		};
		for (var c = 0; c < index.length; c++) {
			index[c] = (React.createElement("th", null, index[c]));
		};
		return (
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
	}
});