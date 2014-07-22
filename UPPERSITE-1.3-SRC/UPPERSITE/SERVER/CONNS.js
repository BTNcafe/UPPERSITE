/**
 * All connections object
 */
global.CONNS = CONNS = OBJECT(function(cls) {'use strict';

	return {

		init : function(inner, self) {

			var
			// socket pack
			socketPack = self.socketPack,

			// disconnect listeners
			disconnectListeners = [],

			// add disconnect listener.
			addDisconnectListener,

			// emit to all sockets.
			emitToAllSockets,

			// emit to all workers.
			emitToAllWorkers;

			self.addDisconnectListener = addDisconnectListener = function(disconnectListener) {
				//REQUIRED: disconnectListener

				disconnectListeners.push(disconnectListener);
			};

			socketPack.on('connection', function(socket) {

				var
				// room counts
				roomCounts = {};

				socket.addListener('disconnect', function() {
					EACH(disconnectListeners, function(disconnectListener) {
						disconnectListener(socket.id);
					});
				});

				socket.emit('__CONNECTED', socket.id);

				socket.addListener('__ENTER_ROOM', function(fullURI) {

					if (roomCounts[fullURI] === undefined) {
						socket.join(fullURI);
						roomCounts[fullURI] = 1;
					} else {
						roomCounts[fullURI] += 1;
					}
				});

				socket.addListener('__EXIT_ROOM', function(fullURI) {

					roomCounts[fullURI] -= 1;

					if (roomCounts[fullURI] === 0) {
						socket.leave(fullURI);
						delete roomCounts[fullURI];
					}
				});
			});

			self.emitToAllSockets = emitToAllSockets = function(params) {
				//REQUIRED: params
				//REQUIRED: params.fullURI
				//REQUIRED: params.listenerName
				//REQUIRED: params.data

				var
				// full uri
				fullURI = params.fullURI,

				// listener name
				listenerName = params.listenerName,

				// data
				data = params.data;

				// to all.
				CONNS.socketPack['in'](fullURI).emit(listenerName, data);
			};

			self.emitToAllWorkers = emitToAllWorkers = function(params) {
				//REQUIRED: params
				//REQUIRED: params.fullURI
				//REQUIRED: params.listenerName
				//REQUIRED: params.data

				emitToAllSockets(params);

				self.broadcastToAllWorkers({
					methodName : 'emitToAllSockets',
					data : params
				});
			};
		}
	};
});
