var BORDER_TYPES = [
	"Государственная граница РФ",
	"Граница субъекта РФ",
	"Граница муниципального образования",
	"Граница муниципального образования 2 уровня",
	"Граница населенного пункта"
];

var BORDER_IDS = [
    ["BRD_ID = ${0}", "Идентификатор"],
    ["BRD_ID = ${0}", "Идентификатор"],
    ["BS_ID = '${0}'", "BS_ID"],
    ["BS_ID = '${0}'", "BS_ID"],
    ["BS_ID = '${0}'", "BS_ID"]
];

function getBorderType(feature){
    var fieldValue = feature.attributes[FIELDS.borderType];
    if (fieldValue != null && fieldValue != undefined){
        if (isNumber(fieldValue)){
            return fieldValue - 1;
        } else {
            return BORDER_TYPES.indexOf(fieldValue);
        }
    }
}

function buildBorderInfoWindowContent(feature){
	var content = '';

    content += INFO_WINDOW_CONTENT_TEMPLATE.cadastreMapInfoTableContainerHeader;
    
    //Start "CadastreMapInfo"
    content += INFO_WINDOW_CONTENT_TEMPLATE.borderMapInfoTableHeader;
    
    //if (feature.attributes["BRD_DESC"]) {
    //    content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.borderDescriptionMapInfoRow, [feature.attributes["BRD_DESC"]]);
    //}

    content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.borderSubjectsMapInfoRow, [
        (feature.attributes["BRD_NAME_STR"] && feature.attributes["BRD_NAME_STR"] != " ")?(feature.attributes["BRD_NAME_STR"]):(NO_DATA)
    ]);


    content += INFO_WINDOW_CONTENT_TEMPLATE.borderMapInfoTableFooter;
    content += INFO_WINDOW_CONTENT_TEMPLATE.cadastreMapInfoTableContainerFooter;


    return content;
}

function showBorderInfoWindow(feature, screenPoint){
    _map.infoWindow.resize(350, 170);

    _map.infoWindow.setTitle(BORDER_TYPES[feature.attributes[FIELDS.borderType] - 1]);
    _map.infoWindow.setContent(buildBorderInfoWindowContent(feature));
	
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

function showBorderResultList(features) {
	features.sort(function (item1, item2) {
		if (!item1.attributes["BRD_ID"])
			item1.attributes["BRD_ID"] = "";
		if (!item2.attributes["BRD_ID"])
			item2.attributes["BRD_ID"] = "";

		var val1 = item1.attributes["BRD_ID"];
		var val2 = item2.attributes["BRD_ID"];

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

        var borderType = getBorderType(features[i]);

        features[i].attributes.BRD_TYPE_STR = BORDER_TYPES[borderType];

        if (borderType > 1){
            features[i].attributes.BRD_NAME_STR = features[i].attributes[FIELDS.borderName];
        } else {
            features[i].attributes.BRD_NAME_STR = features[i].attributes[FIELDS.borderSub1] + '-' + features[i].attributes[FIELDS.borderSub2];
        }

		resultListInnerHtml += dojo.string.substitute(RESULT_ITEM_HTML_TEMPLATE.border, features[i].attributes);
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

function highlightBorder(feature){
    var borderType = getBorderType(feature);
    var idField = BORDER_IDS[borderType];
    var whereClause = dojo.string.substitute(idField[0], [feature.attributes[idField[1]]]);
    var layerDefenitions = [];
    var layerIds = BORDER_SELECTED_IDS[borderType];
    for (var i = 0; i < layerIds.length; i++)
        layerDefenitions[layerIds[i]] = whereClause;

    _atdLayers['select'].setVisibleLayers(layerIds);
    _atdLayers['select'].setLayerDefinitions(layerDefenitions);

    _addressLayers['select'].hide();
    _cadastreLayers['select'].hide();
    _terrZoneLayers['select'].hide();
    _zouitLayers['select'].hide();

    _atdLayers['select'].show();
}

function searchBorderCompleted() {
    selectPoint([_searchResultObjects[0].point], PIN_SYMBOL.load, true);

    highlightBorder(_searchResultObjects[0]);

    showBorderInfoWindow(
		_searchResultObjects[0], 
		_map.toScreen(
			(_clickedPoint != null)?(_searchResultObjects[0].clickedPoint = _clickedPoint):(_searchResultObjects[0].point)
		)
	);

    _onSearchCompleted = null;
}

function searchBorder(whereClause) {
	var query = new esri.tasks.Query();
	query.returnGeometry = true;
	query.outFields = ["*"];
	query.where = whereClause;
	
	var queryTask = new esri.tasks.QueryTask(LAYERS_URL.borderInfo);
	
	queryTask.execute(query, function (featureSet) {
		if (featureSet.features.length > 0) {
			for (var i in featureSet.features) {
				featureSet.features[i].point = featureSet.features[i].geometry;
			}

			showBorderResultList(featureSet.features);
			
			searchBorderCompleted();
		}
		else {
			showEmptyResultMessage();
		}
		showResultPanel();
	}, onQueryError);
}

function identifyBorder(geometry){
	_clickedPoint = geometry;

    var identifyQueryTask = new esri.tasks.IdentifyTask(LAYERS_URL.atdSelect);

    var parameters = new esri.tasks.IdentifyParameters();
    parameters.tolerance = 3;
    parameters.returnGeometry = false;
    parameters.layerOption = esri.tasks.IdentifyParameters.LAYER_OPTION_VISIBLE;
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

                    for (var attribute in feature.attributes){
                        if (attribute.toUpperCase() === field){
                            feature.attributes[field] = feature.attributes[attribute];
                        }
                    }

                    if (feature.attributes[field]){
                        feature.attributes[field]=  parseFloat(feature.attributes[field]);
                    }
                }

                resultFeatures.push(feature);
            }

            addPointAttribute(resultFeatures);

            showBorderResultList(resultFeatures);

            searchBorderCompleted();

        }
        else {
            showEmptyResultMessage();
            clearAllSelectionPoint();
        }

        showResultPanel();
    }, onIdentifyQueryError);
}

function searchResultBorderItemClicked(itemNumber){
	_map.infoWindow.hide();
	
	var selectedItem = _searchResultObjects[itemNumber - 1];
	
	selectPoint([selectedItem.point], PIN_SYMBOL.load, true);
	
	highlightBorder(selectedItem);
	
	showBorderInfoWindow(selectedItem, selectedItem.point);
			
	zoomToObject(selectedItem);
}