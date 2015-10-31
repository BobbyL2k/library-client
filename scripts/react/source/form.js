FormGroup = React.createClass({
	onChange: function(event) {
		this.props.object[this.props.label] = event.target.value;
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
	render: function() {
		var bookDetails = this.props.bookDetails;
		var reactFormGroup = [];
		var submitLabel = this.props.submitLabel;
		for(var c=0; c<bookDetails.length; c++){
			reactFormGroup.push(<FormGroup key={c} label={bookDetails[c].label} placeholder={bookDetails[c].placeholder} object={this.props.object} />);
		}
		return (
			<form>
				{reactFormGroup}
		        <button type="submit" className="btn btn-primary">{submitLabel}</button>
		    </form>
		);
	}
});