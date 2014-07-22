/**
 * Time sync object (Server-side)
 */
global.TIME_SYNC = TIME_SYNC = OBJECT({

	init : function() {'use strict';

		var
		// room
		room = UPPERSITE.ROOM('timeSync');

		room.on('sync', function(params, data, headers, ret) {

			var
			// now time
			now = new Date(),

			// client now time
			clientNow = data.now;

			ret({
				diff : clientNow - now
			});
		});
	}
});
