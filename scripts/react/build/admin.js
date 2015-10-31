var formObjectData = {};

function submitFormData(){
	$.post(C_ADMIN_ADD_BOOK_URL, formObjectData, function(data){
		console.log(data);
	})
}

(function () {
	var bookDetails = [
	{
		label:'ชื่อเรื่องหลัก',
		placeholder:'Name'
	}, 
	{
		label:'ชื่อเรื่องรอง',
		placeholder:'Author'
	}, 
	{
		label:'ผู้แต่งหลัก',
		placeholder:'Name'
	}, 
	{
		label:'ผู้แต่งรอง',
		placeholder:'Author'
	}, 
	{
		label:'ผู้แปล',
		placeholder:'Other'
	}, 
	{
		label:'ครั้งที่พิมพ์',
		placeholder:'Other'
	}, 
	{
		label:'จำนวนเล่ม',
		placeholder:'Other'
	}, 
	{
		label:'สำนักพิมพ์',
		placeholder:'Other'
	}, 
	{
		label:'ปีที่พิมพ์',
		placeholder:'Other'
	}, 
	{
		label:'ISBN',
		placeholder:'เลขประจำหนังสือ'
	}
	];

	React.render(
		React.createElement(ReactForm, {bookDetails: bookDetails, object: formObjectData, submitLabel: 'เพิ่มหนังสือ'}),
		document.getElementById("react-form")
	);
})();