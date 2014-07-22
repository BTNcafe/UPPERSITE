require('./UPPERSITE/BOOT.js');

BOOT({
	CONFIG : {
		isDevMode : true
	},
	NODE_CONFIG : {
		dbName : 'UPPERSITE-test',
		isNotRequiringDBAuth : true
	}
});
