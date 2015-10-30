function main(){
	console.log("Main function called");
	var list = [],
		index = [];
	for(var c=0; c<10; c++){
		list[c] = {
			eiei:"gum",
			yo:"man"
		};
	}

	React.render(
		React.createElement(BookTable, {index: index, list: list}),
		document.getElementById('list')
	);
}

main();