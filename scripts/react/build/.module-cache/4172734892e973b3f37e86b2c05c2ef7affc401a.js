BookItem = React.createClass({displayName: "BookItem",
	render() {
		var book = this.props.book,
			index = this.props.index;
		for (var c = index.length - 1; c >= 0; c--) {
		};
		var str = JSON.stringify(book);
		return (
			React.createElement("div", null, str)
		);
	}
})

BookTable = React.createClass({displayName: "BookTable",
	render: function(){
		var list = this.props.list,
			index = this.props.index;
		for (var c = list.length - 1; c >= 0; c--) {
			list[c] = (React.createElement(BookItem, {book: list[c], index: index}))
		};
		return (
			React.createElement("div", null, 
			list
			)
			);
	}
});