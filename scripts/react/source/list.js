BookTableContent = React.createClass({
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
				columns[c] = (<td key={c}>{book[index[c]]}</td>);
			else
				columns[c] = (<td key={c}>-</td>);
		}
		return (
			<tr className={className} onClick={clickEvent}>
				{columns}
			</tr>
			);
	}
})

BookTable = React.createClass({
	render: function(){
		var list = this.props.list,
			index = this.props.index,
			selectedBookId = this.props.selectedBookId;
		var reactList = [],
			reactIndex = [];
		for (var c = 0; c < index.length; c++) {
			reactIndex[c] = (<th key={c}>{index[c]}</th>);
		};
		for (var c = 0; c < list.length; c++) {
			var selected = (list[c].id == selectedBookId);
			reactList[c] = (<BookTableContent key={c} book={list[c]} index={index} selected={selected} onClick={this.props.onClickBook}/>);
		};
		return (
			<table className="table table-hover table-responsive table-bordered">
				<thead>
					<tr>
						{reactIndex}
					</tr>
				</thead>
				<tbody>
					{reactList}
				</tbody>
	        </table>);
	}
});

EventButton = React.createClass({
	onClick: function(){
		this.props.onClick(this);
	},
	render: function(){
		var className = this.props.className,
			disabled = this.props.disabled,
			buttonName = this.props.buttonName;
		return (<button 
			type="button" 
			className={'btn '+className} 
			disabled={disabled} 
			onClick={this.onClick}>{buttonName}</button>);
	}
});