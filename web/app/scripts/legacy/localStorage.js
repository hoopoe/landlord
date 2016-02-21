function initLocalStorage() {
	if (window.localStorage && window.Worker){
		var ioWorker = new Worker("js/ioWorker.js");

		ioWorker.onmessage = function(event) {
			try{
				localStorage.setItem(event.data[0], event.data[1]);
			}
			catch(error){
				if (error){
					try{
						for(var length = 0, newItemLength = event.data[1].length; length < newItemLength;){
							var oldKey = localStorage.key(0);
							var oldItem = localStorage.getItem(oldKey);

							length += oldItem.length;

							localStorage.removeItem(oldKey);
						}

						localStorage.setItem(event.data[0], event.data[1]);
					}
					catch(error){
						console.log('Problem adding tile to local storage. Storage might be full');
					}
				}
				else{
					console.log('Problem adding tile to local storage. Storage might be full');
				}
			}
		};

		ioWorker.onerror = function(error) {
			console.log("Worker to Parent: ", error);
		};

		//dojo.extend(esri.layers.ArcGISTiledMapServiceLayer, {
		//	getTileUrl : function(level, row, col) {
		//		var url = this._url.path + "/tile/" + level + "/" + row + "/" + col;
		//		if (localStorage.getItem(url) !== null) {
		//			return "data:image;base64," + localStorage.getItem(url);
		//		} else {
		//			ioWorker.postMessage([url]);
		//			return url;
		//		}
		//	}
		//});
	}
}