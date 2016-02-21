function buildZouitInfoWindowContent(feature){
	var content = '';

    content += INFO_WINDOW_CONTENT_TEMPLATE.cadastreMapInfoTableContainerHeader;

    //Start "CadastreMapInfo"
    content += INFO_WINDOW_CONTENT_TEMPLATE.zouitMapInfoTableHeader;

    if (feature.attributes["CODE_ZONE"]) {
       content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.zouitTypeMapInfoRow, [feature.attributes["CODE_ZONE"]]);
    }
    if (feature.attributes["DESCRIPTION"]) {
        content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.zouitDescriptionMapInfoRow, [feature.attributes["DESCRIPTION"]]);
    }

    content += INFO_WINDOW_CONTENT_TEMPLATE.zouitMapInfoTableFooter;
    content += INFO_WINDOW_CONTENT_TEMPLATE.cadastreMapInfoTableContainerFooter;

    return content;
}

function showZouitInfoWindow(feature, screenPoint){
    _map.infoWindow.resize(300, 170);

    _map.infoWindow.setTitle("ЗОУИТ");
    _map.infoWindow.setContent(buildZouitInfoWindowContent(feature));
	
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

function showZouitResultList(features) {
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
		
		resultListInnerHtml += dojo.string.substitute(RESULT_ITEM_HTML_TEMPLATE.zouit, features[i].attributes);
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

function highlightZouit(feature){
        var whereClause = "TZ_ID = '" + feature.attributes["TZ_ID"] + "'";
        var layerDefenitions = [];
        var layerIds = [0];
        for (var i = 0; i < layerIds.length; i++)
            layerDefenitions[layerIds[i]] = whereClause;

        _zouitLayers['select'].setVisibleLayers(layerIds);
        _zouitLayers['select'].setLayerDefinitions(layerDefenitions);
		
        _addressLayers['select'].hide();
        _cadastreLayers['select'].hide();
		_terrZoneLayers['select'].hide();
        _atdLayers['select'].hide();
        _frameLayers['select'].hide();

		_zouitLayers['select'].show();
}

function searchZouitCompleted() {
    selectPoint([_searchResultObjects[0].point], PIN_SYMBOL.load, true);

    highlightZouit(_searchResultObjects[0]);

    showZouitInfoWindow(
		_searchResultObjects[0], 
		_map.toScreen(
			(_clickedPoint != null)?(_searchResultObjects[0].clickedPoint = _clickedPoint):(_searchResultObjects[0].point)
		)
	);

    _onSearchCompleted = null;
}


function identifyZouit(geometry){
	_clickedPoint = geometry;

    var identifyQueryTask = new esri.tasks.IdentifyTask(LAYERS_URL.zouit);

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
            /*var whereClause = '';
            for (var i = 0; i < featureSet.length; i++) {
                whereClause += "," + featureSet[i].feature.attributes["Идентификатор"];
            }
		
            searchZouit("OIT_ID  IN (" + whereClause.substring(1) + ")");*/
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

            showResultList(PortalObjectTypes.zouit, resultFeatures);
            //showZouitResultList(resultFeatures);

            searchZouitCompleted();

        }
        else {
            showEmptyResultMessage();
            clearAllSelectionPoint();
        }

        showResultPanel();

    }, onIdentifyQueryError);

}

function searchResultZouitItemClicked(itemNumber){
	_map.infoWindow.hide();
	
	var selectedItem = _searchResultObjects[itemNumber - 1];
	
	selectPoint([selectedItem.point], PIN_SYMBOL.load, true);
	
	highlightZouit(selectedItem);
	
	showZouitInfoWindow( selectedItem, selectedItem.point);
			
	zoomToObject(selectedItem);
}