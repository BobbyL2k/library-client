var C_URL_PREFIX = "http://127.0.0.1:3000/library";
var C_ADMIN_ADD_BOOK_URL = C_URL_PREFIX + "/add";
var C_GET_COLUMN_URL = C_URL_PREFIX + "/bookColumns";

var formObjectData = {};

function submitFormData(){
	console.log("submitFormData");
	$.post(C_ADMIN_ADD_BOOK_URL, JSON.stringify(formObjectData), function(data){
		console.log(data);
		window.location = 'admin.html';
	})
}

(function () {
	$.getJSON(C_GET_COLUMN_URL, function(list) {
		var formDetails = list.map(function (content) {
			var numberContent = ['left','totalBook','publishedYear'];
			if(numberContent.indexOf(content) != -1){
				return {
					label:content,
					placeholder:'ตัวเลข',
					validator:function(input){return parseInt(input);}
				};
			}
			else{
				return {
					label:content,
					placeholder:'ข้อความ',
					validator:function(input){return input;}
				};
			}
			return {label:content, placeholder:content};
		});
		var displayIndex = {
	        "bookName":"ชื่อหนัง",
	        "bookSubname":"ชื่อ อื่นๆ",
	        "author":"ผู้แต่ง",
	        "subAuthor":"ผู้แต่งรอง",
	        "translator":"ผู้แปล",
	        "edition":"ครั้งที่พิมพ์",
	        "left":"มีเหลือ",
	        "totalBook":"มีทั้งหมด",
	        "publisher":"สำนักพิมพ์",
	        "publishedYear":"ปีพิมพ์",
	        "ISBN":"ISBN",
	        "dewey":"dewey",
	        "category":"หมวดหมู่"
		}
		React.render(
			<ReactForm formDetails={formDetails} displayIndex={displayIndex} object={formObjectData} submitLabel={'เพิ่มหนังสือ'} onSubmit={submitFormData} cancelLabel={'ยกเลิก'} onCancel={function() {
				window.location = 'admin.html';
			}}/>,
			document.getElementById("react-form")
		);
	});

})();