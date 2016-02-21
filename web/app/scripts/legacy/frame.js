function buildFrameInfoWindowContent(feature){
    var content = '';

    content += INFO_WINDOW_CONTENT_TEMPLATE.cadastreMapInfoTableContainerHeader;

    //Start "CadastreMapInfo"
    content += INFO_WINDOW_CONTENT_TEMPLATE.zouitMapInfoTableHeader;

    if (feature.attributes["NAME_"]) {
        content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.frameNameMapInfoRow, [(feature.attributes["NAME_"] == ' ')?(NO_DATA):(feature.attributes["NAME_"])]);
    }

    if (feature.attributes["HOLDER"]) {
        content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.frameHolderMapInfoRow, [(feature.attributes["HOLDER"] == ' ')?(NO_DATA):(feature.attributes["HOLDER"])]);
    }

    if (feature.attributes["SCALE"]) {
        content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.frameScaleMapInfoRow, [(feature.attributes["SCALE"] == ' ')?(NO_DATA):("1:" + feature.attributes["SCALE"])]);
    }

	if (feature.attributes["YEAR_CREATE"] && feature.attributes["YEAR_CREATE"] != " ") {
        var d = new Date(feature.attributes["YEAR_CREATE"]);
        content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.frameDateMapInfoRow, [formatDate(d.getDate(),d.getMonth(),d.getFullYear())]);
    }
    else{
        content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.frameDateMapInfoRow, [NO_DATA]);
    }

	content += INFO_WINDOW_CONTENT_TEMPLATE.frameLinkMapInfoRow;

	if (feature.attributes["GUID"] && feature.attributes["GUID"] !== ' ') {
		esri.request({
			url: "http://nsdi.ru/geoportal/rest/find/document",
			content: {
				searchText: feature.attributes["GUID"],
				max: 1,
				f: "json"
			},
			load: function(data){
				if (data.records.length > 0) {
					dojo.byId("frameInfoLink").href = data.records[0].links[1].href;
					dojo.byId("frameInfoLink").style.display = "";
				}

                dojo.byId("frameInfoLinkLoadingIndicator").style.display = "none";
			},
			error: esriConfig.defaults.io.errorHandler
		});
    } else {
        setTimeout(function () {
            var loader = dojo.byId("frameInfoLinkLoadingIndicator");
            if (loader) {
                loader.style.display = "none";
            }
        }, 2000);
    }

    content += INFO_WINDOW_CONTENT_TEMPLATE.zouitMapInfoTableFooter;
    content += INFO_WINDOW_CONTENT_TEMPLATE.cadastreMapInfoTableContainerFooter;

    return content;
}

function buildFrameIfoWindowTitle(feature){
	var type = feature.attributes["D_TYPE"];

	if (type == "CTK"){
		return "Цифровые топокарты";
	}
	else if (type == "GeoEye"){
		return "Ортофотопокрытия";
	}
	else if (type == "OCNK"){
		return "ОЦНК";
	}
	else if (type == "OFP"){
		return "Ортофотопланы";
	}
}

function showFrameInfoWindow(feature, screenPoint){
    _map.infoWindow.resize(300, 170);

    _map.infoWindow.setTitle(buildFrameIfoWindowTitle(feature));
    _map.infoWindow.setContent(buildFrameInfoWindowContent(feature));

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

function showFrameResultList(features, template) {
    features.sort(function (item1, item2) {
        if (!item1.attributes["SCALE"])
            item1.attributes["SCALE"] = "";
        if (!item2.attributes["SCALE"])
            item2.attributes["SCALE"] = "";

        var val1 = item1.attributes["SCALE"];
        var val2 = item2.attributes["SCALE"];

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

        resultListInnerHtml += dojo.string.substitute(template, features[i].attributes);
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

function highlightFrame(feature){
    //var whereClause = "OBJECTID = " + feature.attributes["ORIG_FID"];
	var whereClause = "CNT_ID LIKE '" + feature.attributes["CNT_ID"] + "'";
    var layerDefenitions = [];
    var layerIds = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19];
    for (var i = 0; i < layerIds.length; i++)
        layerDefenitions[layerIds[i]] = whereClause;

    _frameLayers['select'].setVisibleLayers(layerIds);
    _frameLayers['select'].setLayerDefinitions(layerDefenitions);

    _addressLayers['select'].hide();
    _cadastreLayers['select'].hide();
    _terrZoneLayers['select'].hide();
    _atdLayers['select'].hide();
    _zouitLayers['select'].hide();

    _frameLayers['select'].show();
}

function searchFrameCompleted() {
    selectPoint([_searchResultObjects[0].point], PIN_SYMBOL.load, true);

    highlightFrame(_searchResultObjects[0]);

    showFrameInfoWindow(
        _searchResultObjects[0],
        _map.toScreen(
            (_clickedPoint != null)?(_searchResultObjects[0].clickedPoint = _clickedPoint):(_searchResultObjects[0].point)
        )
    );

    _onSearchCompleted = null;
}

function searchFrame(whereClause, layerId) {
    var query = new esri.tasks.Query();
    query.returnGeometry = true;
    query.outFields = ["*"];
    query.where = whereClause;

    var url;
    var type;
    //var template;

    //if (layerId >= 1 && layerId <= 6){
    //    url = LAYERS_URL.frame1Info;
    //    type = "ЦТК ОП";
    //    //template = RESULT_ITEM_HTML_TEMPLATE.frame1;
    //}
    //else if (layerId >= 8 && layerId <= 13){
    //    url = LAYERS_URL.frame2Info;
    //    type = "ОЦНК";
    //    //template = RESULT_ITEM_HTML_TEMPLATE.frame2;
    //}
    //else if (layerId == 16){
    //    url = LAYERS_URL.frame3Info;
    //    type = "Ортофотоплан";
    //    //template = RESULT_ITEM_HTML_TEMPLATE.frame3;
    //}
    //else{
    //    url = LAYERS_URL.frame4Info;
    //    type = "Ортофотопокрытие";
    //    //template = RESULT_ITEM_HTML_TEMPLATE.frame4;
    //}

    var queryTask = new esri.tasks.QueryTask(LAYERS_URL.frameInfo);

    queryTask.execute(query, function (featureSet) {
		clearAllSelectionPoint();
        if (featureSet.features.length > 0) {

            for (var i in featureSet.features) {
                featureSet.features[i].point = featureSet.features[i].geometry;
                featureSet.features[i].attributes["_type"] = type;
                featureSet.features[i].attributes["_name"] = (featureSet.features[i].attributes["NAME_"])?(featureSet.features[i].attributes["NAME_"]):("Нет данных");
                featureSet.features[i].attributes["_holder"] = (featureSet.features[i].attributes["HOLDER"])?(featureSet.features[i].attributes["HOLDER"]):("");
				featureSet.features[i].attributes["_scale"] = (featureSet.features[i].attributes["SCALE"])?("1:" + featureSet.features[i].attributes["SCALE"]):("");
            }

            showResultList(PortalObjectTypes.frame, featureSet.features);
            //showFrameResultList(featureSet.features, RESULT_ITEM_HTML_TEMPLATE.frame);

            searchFrameCompleted();
        }
        else {
            showEmptyResultMessage();
        }
        showResultPanel();
    }, onQueryError);
}

function identifyFrame(geometry){
    _clickedPoint = geometry;

    var identifyQueryTask = new esri.tasks.IdentifyTask(LAYERS_URL.frameSelect);

    var parameters = new esri.tasks.IdentifyParameters();
    parameters.tolerance = 0;
    parameters.returnGeometry = false;
    parameters.layerOption = esri.tasks.IdentifyParameters.LAYER_OPTION_ALL;
    parameters.width = _map.width;
    parameters.height = _map.height;
    parameters.geometry = geometry;
    parameters.mapExtent = _map.extent;
    parameters.layerIds = _frameSelectedVisibleLayers.slice(1);

    identifyQueryTask.execute(parameters, function (featureSet) {
        if (featureSet.length > 0) {
            var whereClause = '';
            for (var i = 0; i < featureSet.length; i++) {
                //whereClause += "," + featureSet[i].feature.attributes["Object ID"];
				whereClause += ",'" + featureSet[i].feature.attributes["CNT_ID"] + "'";
            }

            //searchFrame("ORIG_FID IN (" + whereClause.substring(1) + ")", featureSet[0].layerId);
			searchFrame("CNT_ID IN (" + whereClause.substring(1) + ")", featureSet[0].layerId);
        }
    }, onIdentifyQueryError);
}

function searchResultFrameItemClicked(itemNumber){
    _map.infoWindow.hide();

    var selectedItem = _searchResultObjects[itemNumber - 1];

    selectPoint([selectedItem.point], PIN_SYMBOL.load, true);

    highlightFrame(selectedItem);

    showFrameInfoWindow( selectedItem, selectedItem.point);

    zoomToObject(selectedItem);
}
