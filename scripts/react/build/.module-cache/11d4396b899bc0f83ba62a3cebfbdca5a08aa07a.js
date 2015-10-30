function main(){
	list = [];
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