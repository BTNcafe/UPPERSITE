/**
 * Default common config
 */
OVERRIDE(CONFIG, function(origin) {'use strict';

	global.CONFIG = CONFIG = COMBINE_DATA({
		origin : origin,
		extend : {
			isDevMode : false,
			port : 8889,
			defaultBoxName : 'UPPERSITE',
			defaultTitle : 'UPPERSITE',
			defaultLang : 'en',
			contactAddress : 'contact@btncafe.com',
			maxUploadFileMB : 10,
			transports : ['websocket', 'flashsocket', 'xhr-polling', 'jsonp-polling']
		}
	});
});
