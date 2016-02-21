function buildTerrZoneInfoWindowContent(feature){
	var content = '';

    content += INFO_WINDOW_CONTENT_TEMPLATE.cadastreMapInfoTableContainerHeader;

    //Start "CadastreMapInfo"
    content += INFO_WINDOW_CONTENT_TEMPLATE.terrZoneMapInfoTableHeader;

    if (feature.attributes["CODE_ZONE"]) {
       content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.terrZoneTypeMapInfoRow, [feature.attributes["CODE_ZONE"]]);
    }
    if (feature.attributes["DESCRIPTION"]) {
        content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.terrZoneDescriptionMapInfoRow, [feature.attributes["DESCRIPTION"]]);
    }

    content += INFO_WINDOW_CONTENT_TEMPLATE.terrZoneMapInfoTableFooter;
    content += INFO_WINDOW_CONTENT_TEMPLATE.cadastreMapInfoTableContainerFooter;

    return content;
}
function showTerrZoneInfoWindow(feature, screenPoint){
    _map.infoWindow.resize(300, 170);

    _map.infoWindow.setTitle("Территориальная зона");
    _map.infoWindow.setContent(buildTerrZoneInfoWindowContent(feature));
	
    _map.infoWindow.feature = feature;

    _map.infoWindow.fixedAnchor = null;
    _map.infoWindow.show(screenPoint, _map.getInfoWindowAnchor(screenPoint));
	

    if (feature.clickedPoint) {
        selectPoint([feature.clickedPoint], PIN_SYMBOL.normal, true);
        feature.clickedPoint = null;
    }
    else {
        selectPoint([feature.point], PIN_SYMBOL.normal, true);
    }    
}


function showTerrZoneResultList(features) {
	features.sort(function (item1, item2) {
		if (!item1.attributes["TZ_ID"])
			item1.attributes["TZ_ID"] = "";
		if (!item2.attributes["TZ_ID"])
			item2.attributes["TZ_ID"] = "";

		var val1 = item1.attributes["TZ_ID"];
		var val2 = item2.attributes["TZ_ID"];

		if (val1 == val2)
			return 0;
		if (val1 > val2)
			return 1;
		if (val1 < val2)
			return -1;
	});

    var resultListInnerHtml = '';

    for (var i = 0; i < features.length; i++) {
        features[i].attributes.ItemNumber = i + 1;
		
		for(var attr in features[i].attributes){
			if(features[i].attributes[attr] == "Null" || typeof(features[i].attributes[attr]) === 'undefined' || features[i].attributes[attr] == null){
				features[i].attributes[attr] = " ";	
			}				
		}

        features[i].attributes.ErrorSymbol = "";

        if (!features[i].attributes["CODE_ZONE_VALUE"]){
            features[i].attributes["CODE_ZONE_VALUE"] = features[i].attributes["CODE_ZONE"];
        }
		
		resultListInnerHtml += dojo.string.substitute(RESULT_ITEM_HTML_TEMPLATE.terrZone, features[i].attributes);
	}

    _searchResultObjects = features;

	if (dojo.hasClass("searchExPanel", "searchExPanelOpenState")) {
		searchExClick();
	}

    dojo.byId('resultItemLabel').innerHTML = '';
	dojo.byId('resultList').innerHTML = resultListInnerHtml;
	dojo.byId('emptyResultPanel').style.display = 'none';
	dojo.byId('resultListPanel').style.display = '';
	dojo.byId('bookmarksAllButton').style.display = 'none';
}

function highlightTerrZone(feature){
        var whereClause = "TZ_ID = '" + feature.attributes["TZ_ID"] + "'";
        var layerDefenitions = [];
        var layerIds = [0];
        for (var i = 0; i < layerIds.length; i++)
            layerDefenitions[layerIds[i]] = whereClause;

        _terrZoneLayers['select'].setVisibleLayers(layerIds);
        _terrZoneLayers['select'].setLayerDefinitions(layerDefenitions);
		
        _addressLayers['select'].hide();
        _cadastreLayers['select'].hide();
		_zouitLayers['select'].hide();
        _atdLayers['select'].hide();
        _frameLayers['select'].hide();
		_terrZoneLayers['select'].show();
}

function searchTerrZoneCompleted() {
    selectPoint([_searchResultObjects[0].point], PIN_SYMBOL.load, true);

    highlightTerrZone(_searchResultObjects[0]);

    showTerrZoneInfoWindow(
		_searchResultObjects[0], 
		_map.toScreen(
			(_clickedPoint != null)?(_searchResultObjects[0].clickedPoint = _clickedPoint):(_searchResultObjects[0].point)
		)
	);

    _onSearchCompleted = null;
}

function searchTerrZone(whereClause) {
	var query = new esri.tasks.Query();
	query.returnGeometry = true;
	query.outFields = ["*"];
	query.where = whereClause;
	
	var queryTask = new esri.tasks.QueryTask(LAYERS_URL.terrZoneInfo);
	
	queryTask.execute(query, function (featureSet) {
		if (featureSet.features.length > 0) {
		
			for (var i in featureSet.features) {
				featureSet.features[i].point = featureSet.features[i].geometry;
			}
			
            showResultList(PortalObjectTypes.terrZone, featureSet.features);
			//showTerrZoneResultList(featureSet.features);
			
			searchTerrZoneCompleted();
		}
		else {
			showEmptyResultMessage();
		}
		showResultPanel();
	}, onQueryError);
}

function identifyTerrZone(geometry){
	_clickedPoint = geometry;

    var identifyQueryTask = new esri.tasks.IdentifyTask(LAYERS_URL.terrZone);
    //var identifyQueryTask = new esri.tasks.IdentifyTask(LAYERS_URL.terrZoneSelect);

    var parameters = new esri.tasks.IdentifyParameters();
    parameters.tolerance = 0;
    parameters.returnGeometry = false;
    parameters.layerOption = esri.tasks.IdentifyParameters.LAYER_OPTION_TOP;
    parameters.width = _map.width;
    parameters.height = _map.height;
    parameters.geometry = geometry;
    parameters.mapExtent = _map.extent;

    identifyQueryTask.execute(parameters, function (featureSet) {
        if (featureSet.length > 0) {

            var resultFeatures = [];

            for (var i in featureSet) {
                var feature = featureSet[i].feature;
                var fieldsToParse = ["XC", "YC", "XMAX", "XMIN", "YMAX", "YMIN"];

                for(var i = 0; i < fieldsToParse.length; i++){
                    var field = fieldsToParse[i];

                    if (feature.attributes[field]){
                        feature.attributes[field]=  parseFloat(feature.attributes[field]);
                    }
                }

                resultFeatures.push(feature);
            }

            addPointAttribute(resultFeatures);

            showTerrZoneResultList(resultFeatures);

            searchTerrZoneCompleted();

        }
        else {
            showEmptyResultMessage();
            clearAllSelectionPoint();
        }

        showResultPanel();

    }, onIdentifyQueryError);
}

function searchResultTerrZoneItemClicked(itemNumber){
	_map.infoWindow.hide();
	
	var selectedItem = _searchResultObjects[itemNumber - 1];
	
	selectPoint([selectedItem.point], PIN_SYMBOL.load, true);
	
	highlightTerrZone(selectedItem);
	
	showTerrZoneInfoWindow( selectedItem, selectedItem.point);
			
	zoomToObject(selectedItem);
}