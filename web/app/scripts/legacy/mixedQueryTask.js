dojo.declare("Portal.MixedQueryTask", null, {
    constructor: function (url) {
		var _url = url;
		
		this.execute = function(query, queryResult, queryError){
			var dataToSend = { cadNum: query.cadNumber, cadNums: query.cadNumbers, onlyAttributes: query.onlyAttributes,  returnGeometry: true, f: "json"};

			if (query.page){
				dataToSend.page = query.page;
			}

			if (query.onlyIds){
				dataToSend.onlyIds = query.onlyIds;
			}

			var requestHandle = esri.request({
				url: _url,
				content: dataToSend,
				callbackParamName: "callback",
				error: queryError,
				load: dojo.hitch(this, function(data){
					var featureSet = new esri.tasks.FeatureSet(data);
					queryResult(featureSet); 
				})
			});
		};
		
	},
	execute: null
});