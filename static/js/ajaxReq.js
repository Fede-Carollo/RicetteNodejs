function ajaxCall (url, method, parameters) {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: url, //default: currentPage
			type: method,
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			dataType: "json",
			data: parameters,
			headers: {
				authorization: /*auth.token ||*/ localStorage.getItem("token")
			},
			success: (data, textStatus, request) => {
				const token = request.getResponseHeader("token");
				const expiresDuration = request.getResponseHeader("token-expires-in");
				if(expiresDuration && token)
				{
					const auth = Auth.instanceClass();
					auth.refreshToken(+expiresDuration, token);
				}
				resolve(data)
			},
			error : (jqXHR, test_status, str_error) => {reject(jqXHR, test_status, str_error)}
		});
	})
};
