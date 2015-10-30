function main(){
	console.log("Main function called");
	var list = [],
		index = [];
	list[0] = {
		eiei:"gum",
		yo:"man"
	};

	React.render(
		React.createElement(BookTable, {index: index, list: list}),
		document.getElementById('list')
	);
}

main();