ModelExample.ArticleModel = CLASS(function(cls) {'use strict';

	var
	// valid data set
	validDataSet = {
		title : {
			notEmpty : true,
			size : {
				max : 255
			}
		},
		content : {
			notEmpty : true,
			size : {
				max : 10000
			}
		}
	};

	return {

		preset : function() {
			return ModelExample.MODEL;
		},

		params : function() {

			return {
				name : 'Article',
				config : {
					create : {
						valid : VALID(validDataSet)
					},
					update : {
						valid : VALID(validDataSet)
					}
				}
			};
		}
	};
});
