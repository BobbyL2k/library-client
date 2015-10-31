BookTableContent = React.createClass({displayName: "BookTableContent",
	onClick: function(){
		this.props.onClick(this.props.book.id);
	},
	render: function(){
		var book = this.props.book,
			visibleIndex = this.props.visibleIndex,
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
		for(var c=0; c<visibleIndex.length; c++){
			if(book[visibleIndex[c]] !== undefined)
				columns[c] = (React.createElement("td", {key: c}, book[visibleIndex[c]]));
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

BookInfo = React.createClass({displayName: "BookInfo",
	render: function(){
		var book = this.props.book;
		var children = [];
		for(key in book){
			children.push((React.createElement("dt", {key: children.length}, key)));
			children.push((React.createElement("dd", {key: children.length}, book[key])));
		}
		return (
      	React.createElement("dl", {className: "dl-horizontal"}, 
      		children
      	)
      	);
	}
});

BookTable = React.createClass({displayName: "BookTable",
	render: function(){
		var list = this.props.list,
			visibleIndex = this.props.visibleIndex,
			selectedId = this.props.selectedId;
		var reactList = [],
			reactIndex = [];
		for (var c = 0; c < visibleIndex.length; c++) {
			reactIndex[c] = (React.createElement("th", {key: c}, visibleIndex[c]));
		};
		for (var c = 0; c < list.length; c++) {
			var selected = (list[c].id == selectedId);
			reactList[c] = (React.createElement(BookTableContent, {key: c, book: list[c], visibleIndex: visibleIndex, selected: selected, onClick: this.props.onClickBook}));
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

SyncingTextField = React.createClass({displayName: "SyncingTextField",
	onChange: function(event){
		this.props.object[this.props.property] = event.target.value;
	},
	render: function(){
		var placeholder = this.props.placeholder;
		return (React.createElement("input", {type: "text", className: "form-control", placeholder: placeholder, onChange: this.onChange}))
	}
});

Modal = React.createClass({displayName: "Modal",
	accept: function(){
		this.props.acceptCallback();
	},
	close: function() {
		this.props.closeCallback();
	},
	render: function() {
		var header = this.props.header,
			show = this.props.show;
		var style = {};
		if(show){
			style = {display:"block"};
		}else{
			style = {display:"none"};
		}
		if(header === undefined)
			header = '';
		return (
			React.createElement("div", {className: "modal-content", style: style}, 
				React.createElement("div", {className: "modal-header"}, 
					React.createElement("button", {type: "button", className: "close", onClick: this.close}, "×"), 
					React.createElement("h4", {className: "modal-title"}, header)
				), 
				React.createElement("div", {className: "modal-body"}, 
					this.props.children
				), 
				React.createElement("div", {className: "modal-footer"}, 
					React.createElement("button", {type: "button", className: "btn btn-default", onClick: this.accept}, "ตกลง"), 
					React.createElement("button", {type: "button", className: "btn btn-danger", onClick: this.close}, "ยกเลิก")
				)
			)
		);
	}
})