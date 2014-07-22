require('./UPPERSITE/BOOT.js');

BOOT({
	CONFIG : {
		defaultBoxName : 'ModelExample',
		isDevMode : true
	},
	NODE_CONFIG : {
		dbName : 'ModelExample-test',
		isNotRequiringDBAuth : true
	}
});
