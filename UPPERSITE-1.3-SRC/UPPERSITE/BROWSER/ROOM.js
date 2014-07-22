FOR_BOX(function(box) {'use strict';

	/**
	 * Connection room class
	 */
	box.ROOM = CLASS({

		init : function(inner, self, name) {
			//REQUIRED: name

			var
			// to
			to = CONN.getSocket(),

			// ns
			ns = box.boxName + '/' + name,

			// listeners
			listeners = {},

			// is exited
			isExited,

			// on.
			on,

			// get.
			get,

			// post.
			post,

			// exit.
			exit;

			CONN.enterRoom(ns);

			self.on = on = function(methodName, _callback) {
				//REQUIRED: methodName
				//REQUIRED: _callback

				var
				// listener name
				listenerName = ns + '/' + methodName,

				// callback.
				callback;

				callback = function(result) {
					//REQUIRED: result

					_callback(CHECK_IS_DATA(result) === true ? UNPACK_DATA(result) : result);
				};

				if (listeners[listenerName] === undefined) {
					listeners[listenerName] = [];
				}
				listeners[listenerName].push(callback);

				to.addListener(listenerName, callback);

				return listenerName;
			};

			self.get = get = function(params, callback) {
				//REQUIRED: params
				//REQUIRED: params.methodName
				//REQUIRED: params.data
				//OPTIONAL: callback

				var
				// method name
				methodName = params.methodName,

				// data
				data = params.data,

				// instant listener name
				instantListenerName,

				// date attribute names
				dateAttrNames = [];

				box.GET({
					uri : '__FOR_ROOM/' + name + '/' + methodName,
					data : {
						socketId : to.id,
						data : data
					}
				}, function(content) {
				
					if (callback !== undefined) {
						callback(PARSE_STR(content));
					}
				});
			};

			self.post = post = function(params, callback) {
				//REQUIRED: params
				//REQUIRED: params.methodName
				//REQUIRED: params.data
				//OPTIONAL: callback

				var
				// method name
				methodName = params.methodName,

				// data
				data = params.data,

				// instant listener name
				instantListenerName,

				// date attribute names
				dateAttrNames = [];

				box.POST({
					uri : '__FOR_ROOM/' + name + '/' + methodName,
					data : {
						socketId : to.id,
						data : data
					}
				}, function(content) {
				
					if (callback !== undefined) {
						callback(PARSE_STR(content));
					}
				});
			};

			self.exit = exit = function() {

				if (isExited !== true) {

					EACH(listeners, function(callbacks, name) {
						EACH(callbacks, function(callback, i) {
							to.removeListener(name, callback);
						});
						delete listeners[name];
					});

					CONN.exitRoom(box.boxName + '/' + name);

					isExited = true;
				}
			};

		}
	});

});
