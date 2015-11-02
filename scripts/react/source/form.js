FormGroup = React.createClass({
	onChange: function(event) {
		if(this.props.validator){
			console.log('validate from', event.target.value, 'to', this.props.validator(event.target.value));
			event.target.value = this.props.validator(event.target.value);
		}
		this.props.object[this.props.property] = event.target.value;
	},
	render: function() {
		var label = this.props.label,
			placeholder = this.props.placeholder;
		return (
	        <div className="form-group">
	            <label for={'input'+label}>{label}</label>
	            <input type={label} className="form-control" id={'input'+label} placeholder={placeholder} onChange={this.onChange} />
	        </div>
	        );
	}
})

ReactForm = React.createClass({
	onClickSubmit: function() {
		this.props.onSubmit();
	},
	onClickCancel: function() {
		this.props.onCancel();
	},
	render: function() {
		var formDetails = this.props.formDetails;
		var reactFormGroup = [];
		var submitLabel = this.props.submitLabel,
			cancelLabel = this.props.cancelLabel,
			displayIndex = {};

		if(this.props.displayIndex)
			displayIndex = this.props.displayIndex;
		var indexToUse = [];
		for(var c=0; c<formDetails.length; c++){
			var temp = formDetails[c].label;
			if(displayIndex[formDetails[c].label])
				temp = displayIndex[formDetails[c].label];
			indexToUse.push(temp);
		}

		var labels = [];

		for(var c=0; c<formDetails.length; c++){
			var labelToAdd = formDetails[c].label;
			if(displayIndex[labelToAdd])
				labelToAdd = displayIndex[labelToAdd];
			labels.push(labelToAdd);
		}
		for(var c=0; c<formDetails.length; c++){
			reactFormGroup.push(<FormGroup key={c} property={formDetails[c].label} label={indexToUse[c]} placeholder={formDetails[c].placeholder} validator={formDetails[c].validator} object={this.props.object} />);
		}
		return (
			<div>
				{reactFormGroup}
		        <button type="submit" className="btn btn-primary" onClick={this.onClickSubmit}>{submitLabel}</button>
		        <button type="cancel" className="btn btn-danger" onClick={this.onClickCancel}>{cancelLabel}</button>
		    </div>
		);
	}
});

ReactTableContent = React.createClass({
	onClick: function () {
		this.props.onClick(this.props.object);
	},
	render: function () {
		var object = this.props.object,
			visibleIndex = this.props.visibleIndex,
			active = this.props.active;
		var cols = [],
			className = '';
		if(active){
			className = 'success';
		}
		for(var c=0; c<visibleIndex.length; c++){
			cols.push((<td key={c}>{object[visibleIndex[c]]}</td>));
		}
		return (<tr className={className} onClick={this.onClick}>{cols}</tr>);
	}
});

ReactSelectableTable = React.createClass({
	propTypes: {
		visibleIndex: React.PropTypes.array,
		list: React.PropTypes.array,
		selectedObject: React.PropTypes.object,
		setObjectCallback: React.PropTypes.func
	},
	onClickContent: function (object) {
		this.props.setObjectCallback(object);
	},
	render: function() {
		var visibleIndex = this.props.visibleIndex,
			list = this.props.list,
			selectedObject = this.props.selectedObject;
		var index = [],
			tableContent = [];
		for(var c=0; c<visibleIndex.length; c++){
			index.push((<th key={c}>{visibleIndex[c]}</th>));
		}
		console.log(list);
		for(var c=0; c<list.length; c++){
			console.log(list[c], selectedObject, list[c] === selectedObject);
			tableContent.push((<ReactTableContent
				key={c} 
				object={list[c]} 
				visibleIndex={visibleIndex} 
				active={list[c] === selectedObject} 
				onClick={this.onClickContent} />));
		}
		return (
			<table className="table table-hover table-responsive table-bordered">
				<thead>
					<tr>
						{index}
					</tr>
				</thead>
				<tbody>
					{tableContent}
				</tbody>
			</table>);
	}
});