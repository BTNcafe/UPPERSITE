FOR_BOX(function(box) {'use strict';

	/**
	 * request json.
	 */
	box.REQUEST_JSON = METHOD({

		run : function(uri, func) {

			box.REQUEST.getFuncs()[uri] = function(method, params, paramStr, headers, response, serveErrorPage) {

				var
				// querystring
				qs = require('querystring'),

				// data
				data;

				try {
					data = UNPACK_DATA(JSON.parse(qs.parse(paramStr).data));
				} catch(e) {
					serveErrorPage(e);
					return;
				}

				return func(method, params, data, headers, response, serveErrorPage);
			};
		}
	});

});
