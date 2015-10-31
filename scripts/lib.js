$.postJSON = function (request, data, callback){
	$.post(request, data, function(response){
		callback(JSON.parse(response));
	})
}