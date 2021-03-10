function ajaxCall (url, method, parameters, noContent = false ) {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: url, //default: currentPage
			type: method,
			contentType: noContent? false: "application/x-www-form-urlencoded; charset=UTF-8",
			processData: !noContent,
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

function ajaxMultipartCall (url, method, parameters, recipeName ) {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: url, //default: currentPage
			type: method,
			contentType: false,	//prevent jquery to set headers
			processData: false,
			cache: false,
			data: parameters,
			headers: {
				authorization: /*auth.token ||*/ localStorage.getItem("token"),
				recipeName: recipeName
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

function registerMultipart (url, method, parameters ) {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: url, //default: currentPage
			type: method,
			contentType: false,	//prevent jquery to set headers
			processData: false,
			cache: false,
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

function savePhoto(url, method, parameters ) {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: url, //default: currentPage
			type: method,
			contentType: false,	
			processData: false,
			cache: false,
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

