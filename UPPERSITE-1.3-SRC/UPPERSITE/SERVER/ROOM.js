FOR_BOX(function(box) {'use strict';

	/**
	 * Connection room class
	 */
	box.ROOM = CLASS({

		init : function(inner, self, name) {
			//REQUIRED: name

			var
			// on.
			on,

			// add disconnect listener.
			addDisconnectListener;

			self.on = on = function(methodName, callback) {
				//REQUIRED: methodName
				//REQUIRED: callback

				box.REQUEST_JSON('__FOR_ROOM/' + name + '/' + methodName, function(method, params, dummy, headers, response) {

					headers.socketId = dummy.socketId;

					callback(params, dummy.data, headers, function(result) {
						response({
							content : JSON.stringify(CHECK_IS_DATA(result) === true ? PACK_DATA(result) : result),
							contentType : 'application/json',
							encoding : 'utf-8'
						});
					});
				});
			};

			self.addDisconnectListener = addDisconnectListener = function(disconnectListener) {
				//REQUIRED: disconnectListener

				CONNS.addDisconnectListener(disconnectListener);
			};
		}
	});

});
