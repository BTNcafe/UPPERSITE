/**
 * Node-side Configuration
 */
OVERRIDE(NODE_CONFIG, function(origin) {

	global.NODE_CONFIG = NODE_CONFIG = COMBINE_DATA({
		origin : origin,
		extend : {
			dbName : 'UPPERSITE-testdb',
			dbUsername : 'test',
			dbPassword : 'test',
			maxDataCount : 1000
		}
	});
});
