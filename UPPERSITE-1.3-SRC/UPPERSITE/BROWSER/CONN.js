/**
 * Connections object
 */
global.CONN = CONN = OBJECT({

	init : function(inner, self) {'use strict';

		var
		// socket
		socket = io.connect(undefined, {

			port : CONFIG.socketIOPorts === undefined || CONFIG.socketIOPorts[CONFIG.workerId] === undefined ? CONFIG.port + CONFIG.workerId : CONFIG.socketIOPorts[CONFIG.workerId],

			'flash policy port' : CONFIG.flashPolicyServerPort === undefined ? CONFIG.port + 1955 : CONFIG.flashPolicyServerPort,

			secure : false,

			// connection timeout is 5 seconds.
			'connect timeout' : 5000,

			transports : CONFIG.transports
		}),

		// is connected
		isConnected = false,

		// connect listeners
		connectListeners = [],

		// disconnect listeners
		disconnectListeners = [],

		// enter room.
		enterRoom,

		// exit room.
		exitRoom,

		// get socket.
		getSocket,

		// add connect listener.
		addConnectListener,

		// add disconnect listener.
		addDisconnectListener,

		// send to all.
		sendToAll;

		socket.addListener('__CONNECTED', function(id) {

			socket.id = id;

			isConnected = true;

			EACH(connectListeners, function(connectListener) {
				connectListener();
			});
		});

		socket.addListener('disconnect', function() {
			isConnected = false;

			EACH(disconnectListeners, function(disconnectListener) {
				disconnectListener();
			});
		});

		self.enterRoom = enterRoom = function(name) {
			//REQUIRED: name

			socket.emit('__ENTER_ROOM', name);
		};

		self.exitRoom = exitRoom = function(name) {
			//REQUIRED: name

			socket.emit('__EXIT_ROOM', name);
		};

		self.getSocket = getSocket = function() {
			return socket;
		};

		self.addConnectListener = addConnectListener = function(connectListener) {

			if (isConnected === true) {
				connectListener();
			}
			connectListeners.push(connectListener);
		};

		self.addDisconnectListener = addDisconnectListener = function(disconnectListener) {
			disconnectListeners.push(disconnectListener);
		};
	}
});
