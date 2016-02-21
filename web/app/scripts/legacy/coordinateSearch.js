var SPLITTERS = [" ", ",", ";"];

var _activeSplitter = null;
var _result = null;

function checkCoordinate(str){
	var str = str.replace(/\s{2,}/g, " ");

	for(var s in SPLITTERS){
		var parts = str.split(SPLITTERS[s]);

		if (parts.length == 2){
			_activeSplitter = SPLITTERS[s];
			return (!isNaN(parseFloat(dojo.trim(parts[0])))) && (!isNaN(parseFloat(dojo.trim(parts[1]))))
		}
	}

	_activeSplitter = null;

	return false;
}

function searchCoordinate(str){
	var str = str.replace(/\s{2,}/g, " ");

	var coordinate = str.split(_activeSplitter);

	try{
		_result = {
			ItemNumber: 1,
			x: parseFloat(dojo.trim(coordinate[0])),
			y: parseFloat(dojo.trim(coordinate[1]))
		};

		dojo.byId('resultItemLabel').innerHTML = "Найдена <strong>1 координата</strong>";
		dojo.byId('resultItemLabel').style.marginTop = '8px';

		dojo.byId('resultList').innerHTML = dojo.string.substitute(RESULT_ITEM_HTML_TEMPLATE.coordinate, _result);

		dojo.byId('emptyResultPanel').style.display = 'none';
		dojo.byId('resultListPanel').style.display = '';
		dojo.byId('bookmarksAllButton').style.display = 'none';

		showResultPanel();

		searchResultCoordinateItemClicked();
	}
	catch(e){
		_result = null;
		//emptySearchResultMessage();
	}
}

function searchResultCoordinateItemClicked(){
	if (_result){
		var point = esri.geometry.geographicToWebMercator(
			new esri.geometry.Point(
				_result.y,
				_result.x,
				_map.spatialReference
			)
		);

		_map.centerAndZoom(point, 15);

		selectPoint([point], PIN_SYMBOL.normal, true);
	}
}