BookTableContent = React.createClass({displayName: "BookTableContent",
	onClick: function(){
		this.props.onClick(this.props.book.id);
	},
	render: function(){
		var book = this.props.book,
			index = this.props.index,
			selected = this.props.selected;
		var columns = [],
			className = "",
			clickEvent = this.onClick;
		if(selected){
			className = "success";
		}
		if(book.count == 0){
			className = "danger";
		}
		if(selected && book.count == 0){
			className = "info";
		}
		for(var c=0; c<index.length; c++){
			if(book[index[c]] !== undefined)
				columns[c] = (React.createElement("td", {key: c}, book[index[c]]));
			else
				columns[c] = (React.createElement("td", {key: c}, "-"));
		}
		return (
			React.createElement("tr", {className: className, onClick: clickEvent}, 
				columns
			)
			);
	}
})

BookTable = React.createClass({displayName: "BookTable",
	render: function(){
		var list = this.props.list,
			index = this.props.index,
			selectedBookId = this.props.selectedBookId;
		var reactList = [],
			reactIndex = [];
		for (var c = 0; c < index.length; c++) {
			reactIndex[c] = (React.createElement("th", {key: c}, index[c]));
		};
		for (var c = 0; c < list.length; c++) {
			var selected = (list[c].id == selectedBookId);
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

EventButton = React.createClass({displayName: "EventButton",
	onClick: function(){
		this.props.onClick(this);
	},
	render: function(){
		var className = this.props.className,
			disabled = this.props.disabled,
			buttonName = this.props.buttonName;
		return (React.createElement("button", {
			type: "button", 
			className: 'btn '+className, 
			disabled: disabled, 
			onClick: this.onClick}, buttonName));
	}
});