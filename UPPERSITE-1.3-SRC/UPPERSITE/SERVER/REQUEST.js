FOR_BOX(function(box) {'use strict';

	/**
	 * request.
	 */
	box.REQUEST = METHOD(function(m) {'use strict';

		var
		// funcs
		funcs = {},

		// get funcs.
		getFuncs,

		// check uri.
		checkURI;

		m.getFuncs = getFuncs = function() {
			return funcs;
		};

		m.checkURI = checkURI = function(params, callbacks) {
			//REQUIRED: params
			//REQUIRED: params.uri
			//REQUIRED: params.method
			//REQUIRED: params.paramStr
			//REQUIRED: params.headers
			//REQUIRED: callbacks
			//REQUIRED: callbacks.response
			//REQUIRED: callbacks.serveErrorPage

			var
			// full uri
			fullURI = params.uri,

			// paramStr
			paramStr = params.paramStr,

			// ip
			ip = params.ip,

			// headers
			headers = params.headers,

			// method
			method = params.method,

			// response.
			response = callbacks.response,

			// serve error page.
			serveErrorPage = callbacks.serveErrorPage;

			return EACH(funcs, function(func, name) {

				var
				// uri
				uri = '',

				// temp name
				tempName = name,

				// params
				params = {},

				// get parameter.
				getParam;

				getParam = function(subURI) {
					//REQUIRED: subURI

					var
					// parameter name
					paramName,

					// temp name2
					tempName2;

					if (tempName.indexOf('{') !== -1 && tempName.indexOf('}') !== -1) {
						tempName2 = tempName.substring(0, tempName.indexOf('{'));

						if (uri + '/' === tempName2) {
							paramName = tempName.substring(tempName.indexOf('{') + 1, tempName.indexOf('}'));
							tempName = tempName2 + subURI + tempName.substring(tempName.indexOf('}') + 1);
							return {
								name : paramName,
								value : subURI
							};
						}
					}
				};

				EACH(fullURI.split('/'), function(subURI, i) {

					var
					// param
					param = getParam(subURI);

					if (param !== undefined) {
						params[param.name] = param.value;
					}

					if (i === 0) {
						uri = subURI;
					} else {
						uri += '/' + subURI;
					}

					if (uri === tempName) {
						return false;
					}
				});

				if (fullURI === tempName) {
					func(method, params, paramStr, headers, response, serveErrorPage);
					return false;
				}
			}) === false;
		};

		return {

			run : function(uri, func) {
				//REQUIRED: uri
				//REQUIRED: func

				funcs[uri] = func;
			}
		};
	});

});
