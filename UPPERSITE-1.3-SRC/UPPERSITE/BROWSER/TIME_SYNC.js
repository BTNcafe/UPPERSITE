/**
 * Time sync object (Client-side)
 */
global.TIME_SYNC = TIME_SYNC = METHOD({

	run : function() {'use strict';

		var
		// time sync room
		timeSyncRoom = UPPERSITE.ROOM('timeSync'),

		// now time
		now = new Date();

		timeSyncRoom.get({
			methodName : 'sync',
			data : {
				now : now
			}
		}, function(data) {

			// The local time = The server time + diff (diff: client time - server time)

			var
			// diff
			diff = data.diff;

			TIME.diff = diff;
		});
	}
});
