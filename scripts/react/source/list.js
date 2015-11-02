BookTableContent = React.createClass({
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
		if(book.left == 0){
			className = "danger";
		}
		if(selected && book.count == 0){
			className = "info";
		}
		for(var c=0; c<visibleIndex.length; c++){
			if(book[visibleIndex[c]] !== undefined)
				columns[c] = (<td key={c}>{book[visibleIndex[c]]}</td>);
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

BookEdit = React.createClass({
	render: function(){
		var displayIndexMapper = {}
		if(this.props.displayIndex){
			displayIndexMapper = this.props.displayIndex;
			console.log("BookInfo", displayIndexMapper);
		}
		var book = this.props.book;
		var children = [];
		for(key in book){
			if(key == 'id')
				continue;
			var displayIndex = key;
			if(displayIndexMapper[key])
				displayIndex = displayIndexMapper[key];
			children.push((<dt key={children.length}>{displayIndex}</dt>));
			children.push((<dd key={children.length}><SyncingTextField2 placeholder="" object={this.props.book} property={key}/></dd>));
		}
		return (
      	<dl className="dl-horizontal">
      		{children}
      	</dl>
      	);
	}
});

BookInfo = React.createClass({
	render: function(){
		var displayIndexMapper = {}
		if(this.props.displayIndex){
			displayIndexMapper = this.props.displayIndex;
			console.log("BookInfo", displayIndexMapper);
		}
		var book = this.props.book;
		var children = [];
		for(key in book){
			if(key == 'id')
				continue;
			var displayIndex = key;
			if(displayIndexMapper[key])
				displayIndex = displayIndexMapper[key];
			children.push((<dt key={children.length}>{displayIndex}</dt>));
			children.push((<dd key={children.length}>{book[key]}</dd>));
		}
		return (
      	<dl className="dl-horizontal">
      		{children}
      	</dl>
      	);
	}
});

BookTable = React.createClass({
	render: function(){
		var list = this.props.list,
			visibleIndex = this.props.visibleIndex,
			selectedId = this.props.selectedId;
		var reactList = [],
			reactIndex = [];
		console.log(this.props.displayIndex);
		for (var c = 0; c < visibleIndex.length; c++) {
			var displayIndex = visibleIndex[c];
			if(this.props.displayIndex !== undefined && this.props.displayIndex[visibleIndex[c]] !== undefined)
				displayIndex = this.props.displayIndex[visibleIndex[c]];
			reactIndex[c] = (<th key={c}>{displayIndex}</th>);
		};
		for (var c = 0; c < list.length; c++) {
			var selected = (list[c].id == selectedId);
			reactList[c] = (<BookTableContent key={c} book={list[c]} visibleIndex={visibleIndex} selected={selected} onClick={this.props.onClickBook}/>);
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

SyncingTextField = React.createClass({
	onChange: function(event){
		this.props.object[this.props.property] = event.target.value;
	},
	render: function(){
		var placeholder = this.props.placeholder;
		return (<input type="text" className="form-control" placeholder={placeholder} onChange={this.onChange}/>)
	}
});

SyncingTextField2 = React.createClass({
	onChange: function(event){
		var lastValue = event.target.value;
		console.log(lastValue);
		this.props.object[this.props.property] = lastValue;
		re_render_book_table();
	},
	render: function(){
		var placeholder = this.props.placeholder;
		return (<input type="text" className="form-control" value={this.props.object[this.props.property]} placeholder={placeholder} onChange={this.onChange}/>)
	}
});

Modal = React.createClass({
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
			<div className="modal-content" style={style}>
				<div className="modal-header">
					<button type="button" className="close" onClick={this.close}>&times;</button>
					<h4 className="modal-title">{header}</h4>
				</div>
				<div className="modal-body">
					{this.props.children}
				</div>
				<div className="modal-footer">
					<button type="button" className="btn btn-default" onClick={this.accept}>ตกลง</button>
					<button type="button" className="btn btn-danger" onClick={this.close}>ยกเลิก</button>
				</div>
			</div>
		);
	}
});

ModalWarning = React.createClass({
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
			<div className="modal-content" style={style}>
				<div className="modal-header">
					<button type="button" className="close" onClick={this.close}>&times;</button>
					<h4 className="modal-title">{header}</h4>
				</div>
				<div className="modal-body">
					{this.props.children}
				</div>
				<div className="modal-footer">
					<button type="button" className="btn btn-danger" onClick={this.accept}>ลบหนังสือ</button>
					<button type="button" className="btn btn-default" onClick={this.close}>ยกเลิก</button>
				</div>
			</div>
		);
	}
});