FormGroup = React.createClass({displayName: "FormGroup",
	onChange: function(event) {
		this.props.object[this.props.label] = event.target.value;
	},
	render: function() {
		var label = this.props.label,
			placeholder = this.props.placeholder;
		return (
	        React.createElement("div", {className: "form-group"}, 
	            React.createElement("label", {for: 'input'+label}, label), 
	            React.createElement("input", {type: label, className: "form-control", id: 'input'+label, placeholder: placeholder, onChange: this.onChange})
	        )
	        );
	}
})

ReactForm = React.createClass({displayName: "ReactForm",
	render: function() {
		var bookDetails = this.props.bookDetails;
		var reactFormGroup = [];
		var submitLabel = this.props.submitLabel;
		for(var c=0; c<bookDetails.length; c++){
			reactFormGroup.push(React.createElement(FormGroup, {key: c, label: bookDetails[c].label, placeholder: bookDetails[c].placeholder, object: this.props.object}));
		}
		return (
			React.createElement("form", null, 
				reactFormGroup, 
		        React.createElement("button", {type: "submit", className: "btn btn-primary"}, submitLabel)
		    )
		);
	}
});