BookTableContent = React.createClass({displayName: "BookTableContent",
	onClick: function(){
		this.props.onClick(this.props.book.id);
	},
	render: function(){
		var book = this.props.book,
			index = this.props.index,
			selected = this.props.selected;
		var columns = [],
			className = "";
		if(selected){
			className = "active";
		}
		for(var c=0; c<index.length; c++){
			if(book[index[c]])
				columns[c] = (React.createElement("td", {key: c}, book[index[c]]));
			else
				columns[c] = (React.createElement("td", {key: c}, "-"));
		}
		return (
			React.createElement("tr", {className: className, onClick: this.onClick}, 
				columns
			)
			);
	}
})

BookTable = React.createClass({displayName: "BookTable",
	render: function(){
		var list = this.props.list,
			index = this.props.index,
			selectedBook = this.props.selectedBook;
		var reactList = [],
			reactIndex = [];
		for (var c = 0; c < index.length; c++) {
			reactIndex[c] = (React.createElement("th", {key: c}, index[c]));
		};
		for (var c = 0; c < list.length; c++) {
			var selected = list[c].id == selectedBook;
			reactList[c] = (React.createElement(BookTableContent, {key: c, book: list[c], index: index, selected: selected, onClick: this.props.onClickBook}));
		};
		return (
			React.createElement("table", {className: "table table-hover table-responsive table-bordered"}, 
				React.createElement("thead", null, 
					React.createElement("tr", null, 
						reactIndex
					)
				), 
				React.createElement("tbody", null, 
					reactList
				)
	        ));
	}
});