//Require History.js
var BrowserHistoryTools = function(map){
	this._map = map;
	this._history = window.History;
	this._htmlUrl = null;

	if (this._map && this._history &&  this._history.enabled){
		this._isExtentChanged = false;
		this._isHistoryChanged = false;
		this._isFirstExtentChanged = true;

		this._extentChange = function(extent){
			var state = { "extent": extent};

			if (this._isFirstExtentChanged){
				this._isHistoryChanged = true;
				this._isFirstExtentChanged = false;
				this._htmlUrl = ((this._history.isInternetExplorer())?("?h=4"):(null));

				this._history.replaceState(state, "", this._htmlUrl);
			}
			else{
				if (this._isExtentChanged){
					this._isExtentChanged = false;
				}
				else{
					this._isHistoryChanged = true;

					this._history.pushState(state, "", this._htmlUrl);
				}
			}
		};

		this._stateChange = function(){
			if (this._isHistoryChanged){
				this._isHistoryChanged = false;
			}
			else{
				var state = this._history.getState();

				if (state && state.data && state.data.extent){
					this._isExtentChanged = true;
					this._map.setExtent(new esri.geometry.Extent(state.data.extent));
				}
			}
		};

		dojo.connect(this._map, "onExtentChange", this, this._extentChange);

		this._history.Adapter.bind(window, "statechange", function(host){
			return function(){
				host._stateChange.call(host);
			};
		}(this));
	}
	else{
		throw "BrowserHistoryTools error.";
	}
}
