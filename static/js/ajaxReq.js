export function ajaxCall (url, method, parameters) {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: url, //default: currentPage
			type: method,
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			dataType: "json",
			data: parameters,
			headers: {
				authorization: /*auth.token ||*/ localStorage.getItem("getItem")
			},
			success: (data) => {resolve(data)},
			error : (jqXHR, test_status, str_error) => {reject(jqXHR, test_status, str_error)}
		});
	})
};
