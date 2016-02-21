var _whereClause;

function buildAtdInfoWindowContent(feature){
    var content = '';

    content += INFO_WINDOW_CONTENT_TEMPLATE.cadastreMapInfoTableContainerHeader;

    //Start "CadastreMapInfo"
    content += INFO_WINDOW_CONTENT_TEMPLATE.atdMapInfoTableHeader;

    switch(feature.attributes["_type"]){
        case 0:
            content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.atdMapCapitalInfoRow, [(feature.attributes["_center"] && feature.attributes["_center"] != " ")?(feature.attributes["_center"]):(NO_DATA)]);
            content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.atdMapOkatoInfoRow, [(feature.attributes["_okato"] && feature.attributes["_okato"] != " ")?(feature.attributes["_okato"]):(NO_DATA)]);
            content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.atdMapOktmoInfoRow, [(feature.attributes["_oktmo"] && feature.attributes["_oktmo"] != " ")?(feature.attributes["_oktmo"]):(NO_DATA)]);
            content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.atdMapMOInfoRow, [(feature.attributes["_mo"] && feature.attributes["_mo"] != " ")?(feature.attributes["_mo"]):(NO_DATA)]);
            content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.atdMapNPInfoRow, [(feature.attributes["_np"] && feature.attributes["_np"] != " ")?(feature.attributes["_np"]):(NO_DATA)]);
            content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.atdMapRosreestrInfoRow, [(feature.attributes["_rosreestr"] && feature.attributes["_rosreestr"] != " ")?(feature.attributes["_rosreestr"]):(NO_DATA)]);
            break;
        case 1:
            content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.atdMapCenterInfoRow, [(feature.attributes["_center"] && feature.attributes["_center"] != " ")?(feature.attributes["_center"]):(NO_DATA)]);

            content += INFO_WINDOW_CONTENT_TEMPLATE.atdMapParentInfoRow;
            content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.atdMapSubjectInfoRow,
				[
					(feature.attributes["_subject"] && feature.attributes["_subject"] != " ")?(
						"<a class='pseudoLink' onclick=\"parentAtdClick(0,'" + feature.attributes["_subjectId"] + "'); return false;\">" + feature.attributes["_subject"] + "</a>"
					):(NO_DATA)
				]
			);

            content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.atdMapOkatoInfoRow, [(feature.attributes["_okato"] && feature.attributes["_okato"] != " ")?(feature.attributes["_okato"]):(NO_DATA)]);
            content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.atdMapOktmoInfoRow, [(feature.attributes["_oktmo"] && feature.attributes["_oktmo"] != " ")?(feature.attributes["_oktmo"]):(NO_DATA)]);
            content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.atdMapMO2InfoRow, [(feature.attributes["_mo2"] && feature.attributes["_mo2"] != " ")?(feature.attributes["_mo2"]):(NO_DATA)]);
            content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.atdMapRosreestrInfoRow, [(feature.attributes["_rosreestr"] && feature.attributes["_rosreestr"] != " ")?(feature.attributes["_rosreestr"]):(NO_DATA)]);
            break;
        case 2:
            content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.atdMapCenterInfoRow, [(feature.attributes["_center"] && feature.attributes["_center"] != " ")?(feature.attributes["_center"]):(NO_DATA)]);

            content += INFO_WINDOW_CONTENT_TEMPLATE.atdMapParentInfoRow;

			var rayon = ((feature.attributes["_rayonId"] && feature.attributes["_rayon"] != " ")?
				("<a class='pseudoLink' onclick=\"parentAtdClick(1,'" + feature.attributes["_rayonId"] + "'); return false;\">" + feature.attributes["_rayon"] + "</a>"):
				(NO_DATA));

			if (feature.attributes["_rayonType"] == "мр"){
            	content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.atdMapRayon1InfoRow,[rayon]);
			}
			else {
				content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.atdMapRayon2InfoRow,[rayon]);
			}

			content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.atdMapSubjectInfoRow,
				[
					(feature.attributes["_subject"] && feature.attributes["_subject"] != " ")?(
						"<a class='pseudoLink' onclick=\"parentAtdClick(0,'" + feature.attributes["_subjectId"] + "'); return false;\">" + feature.attributes["_subject"] + "</a>"
					):(NO_DATA)
				]
			);

            content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.atdMapOkatoInfoRow, [(feature.attributes["_okato"] && feature.attributes["_okato"] != " ")?(feature.attributes["_okato"]):(NO_DATA)]);
            content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.atdMapOktmoInfoRow, [(feature.attributes["_oktmo"] && feature.attributes["_oktmo"] != " ")?(feature.attributes["_oktmo"]):(NO_DATA)]);
            content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.atdMapMO2InfoRow, [(feature.attributes["_mo2"] && feature.attributes["_mo2"] != " ")?(feature.attributes["_mo2"]):(NO_DATA)]);
            content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.atdMapRosreestrInfoRow, [(feature.attributes["_rosreestr"] && feature.attributes["_rosreestr"] != " ")?(feature.attributes["_rosreestr"]):(NO_DATA)]);
            break;
        case 3:
            content += INFO_WINDOW_CONTENT_TEMPLATE.atdMapParentInfoRow;
            content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.atdMapSettlementInfoRow,
				[
					(feature.attributes["_settlementId"] && feature.attributes["_settlement"] != " ")?(
						"<a class='pseudoLink' onclick=\"parentAtdClick(2,'" + feature.attributes["_settlementId"] + "'); return false;\">" + feature.attributes["_settlement"] + "</a>"
						):(NO_DATA)
				]
			);

			var rayon = ((feature.attributes["_rayonId"] && feature.attributes["_rayon"] != " ")?
				("<a class='pseudoLink' onclick=\"parentAtdClick(1,'" + feature.attributes["_rayonId"] + "'); return false;\">" + feature.attributes["_rayon"] + "</a>"):
				(NO_DATA));

			if (feature.attributes["_rayonType"] == "мр"){
				content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.atdMapRayon1InfoRow,[rayon]);
			}
			else {
				content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.atdMapRayon2InfoRow,[rayon]);
			}
			//content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.atdMapRayonInfoRow,
			//	[
			//		(feature.attributes["_rayonId"] && feature.attributes["_rayon"] != " ")?(
			//			"<a class='pseudoLink' onclick='parentAtdClick(1," + feature.attributes["_rayonId"] + "); return false;'>" + feature.attributes["_rayon"] + "</a>"
			//			):(NO_DATA)
			//	]
			//);
			content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.atdMapSubjectInfoRow,
				[
					(feature.attributes["_subject"] && feature.attributes["_subject"] != " ")?(
						"<a class='pseudoLink' onclick=\"parentAtdClick(0,'" + feature.attributes["_subjectId"] + "'); return false;\">" + feature.attributes["_subject"] + "</a>"
					):(NO_DATA)
				]
			);

            content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.atdMapOktmoInfoRow, [(feature.attributes["_oktmo"] && feature.attributes["_oktmo"] != " ")?(feature.attributes["_oktmo"]):(NO_DATA)]);
            content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.atdMapRosreestrInfoRow, [(feature.attributes["_rosreestr"] && feature.attributes["_rosreestr"] != " ")?(feature.attributes["_rosreestr"]):(NO_DATA)]);
            break;
    }

    content += INFO_WINDOW_CONTENT_TEMPLATE.atdMapInfoTableFooter;
    content += INFO_WINDOW_CONTENT_TEMPLATE.cadastreMapInfoTableContainerFooter;

    return content;
}

function buildbuildAtdInfoWindowTitle(f){
    switch(f.attributes["_type"]){
        case 0:
            return 'Субъект РФ: ' + f.attributes["_name"];
        case 1:
            return MO1_TYPES[f.attributes["Municipality1_point.TYPE"]] + ": " + f.attributes["_name"];
        case 2:
            return MO2_TYPES[f.attributes["Municipality2_point.TYPE"]] + ": " + f.attributes["_name"];
        case 3:
            return 'Населенный пункт: ' + f.attributes["_name"];
    }
}

function showAtdInfoWindow(feature, screenPoint){
    _map.infoWindow.resize(300, 170);

    _map.infoWindow.setTitle(buildbuildAtdInfoWindowTitle(feature));
    _map.infoWindow.setContent(buildAtdInfoWindowContent(feature));

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

function highlightAtd(f){
    var layerDefenitions = [];
    var layerIds =  [26,27,28,29];

    for (var i = 0; i < layerIds.length; i++)
        layerDefenitions[layerIds[i]] = _whereClause;

    _atdLayers['select'].setVisibleLayers(layerIds);
    _atdLayers['select'].setLayerDefinitions(layerDefenitions);

    _addressLayers['select'].hide();
    _cadastreLayers['select'].hide();
    _terrZoneLayers['select'].hide();
    _zouitLayers['select'].hide();

    _atdLayers['select'].show();
}


function zoomToAtd(feature) {
	if (feature.attributes["_xmin"] && feature.attributes["_xmax"] &&
		feature.attributes["_ymin"] && feature.attributes["_ymax"]) {

		var extent = new esri.geometry.Extent(
			feature.attributes["_xmin"],
			feature.attributes["_ymin"],
			feature.attributes["_xmax"],
			feature.attributes["_ymax"],
			_map.spatialReference
		);

		_map.setExtent(extent, true);
	}
}

function searchAtdCompleted() {
    selectPoint([_searchResultObjects[0].point], PIN_SYMBOL.load, true);

    highlightAtd(_searchResultObjects[0]);

    showAtdInfoWindow( _searchResultObjects[0], _map.toScreen(_searchResultObjects[0].point));

	if (_parentClick){
		zoomToAtd( _searchResultObjects[0]);
	}

    _onSearchCompleted = null;
}

function showAtdResultList(features) {
    var resultListInnerHtml = '';

    for (var i = 0; i < features.length; i++) {
        features[i].attributes.ItemNumber = i + 1;

        for(var attr in features[i].attributes){
            if(features[i].attributes[attr] == "Null" || typeof(features[i].attributes[attr]) === 'undefined' || features[i].attributes[attr] == null){
                features[i].attributes[attr] = " ";
            }
        }

        features[i].attributes.ErrorSymbol = "";

        //features[i].attributes.BRD_TYPE_STR = BORDER_TYPES[features[i].attributes["BRD_TYPE"] - 1];

        resultListInnerHtml += dojo.string.substitute(RESULT_ITEM_HTML_TEMPLATE.atd, features[i].attributes);
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

function prepareFeature(f, type){
    f.attributes["_center"] = (f.attributes["Settlement_point.NAME"])?(f.attributes["Settlement_point.NAME"]):(null);

    f.attributes["_subject"] = (f.attributes["Region_point.NAME"])?(f.attributes["Region_point.NAME"]):(null);
	f.attributes["_subjectId"] = (f.attributes["Region_point.REGIONCODE"])?(f.attributes["Region_point.REGIONCODE"]):(null);
    f.attributes["_rayon"] = (f.attributes["Municipality1_point.NAME"])?(f.attributes["Municipality1_point.NAME"]):(null);
	f.attributes["_rayonId"] = (f.attributes["Municipality1_point.MUNICIPALITY1ID"])?(f.attributes["Municipality1_point.MUNICIPALITY1ID"]):(null);
	f.attributes["_rayonType"] = (f.attributes["Municipality1_point.TYPE"])?(f.attributes["Municipality1_point.TYPE"]):(null);
    f.attributes["_settlement"] = (f.attributes["Municipality2_point.NAME"])?(f.attributes["Municipality2_point.NAME"]):(null);
	f.attributes["_settlementId"] = (f.attributes["Municipality2_point.MUNICIPALITY2ID"])?(f.attributes["Municipality2_point.MUNICIPALITY2ID"]):(null);


    if (f.attributes["Settlement_point.OKATOCODE"]){
        f.attributes["_okato"] = f.attributes["Settlement_point.OKATOCODE"]
    }else if (f.attributes["Municipality2_point.OKATOCOD"]){
        f.attributes["_okato"] = f.attributes["Municipality2_point.OKATOCOD"]
    }else if(f.attributes["Municipality1_point.OKATOCODE"]){
        f.attributes["_okato"] = f.attributes["Municipality1_point.OKATOCODE"]
    }else if(f.attributes["Region_point.OKATOCODE"]){
        f.attributes["_okato"] = f.attributes["Region_point.OKATOCODE"]
    }else{
        f.attributes["_okato"] =  null;
    }

    if (f.attributes["Settlement_point.OKTMO1CODE"]){
        f.attributes["_oktmo"] = f.attributes["Settlement_point.OKTMO1CODE"]
    }else if (f.attributes["Municipality2_point.OKTMO1CODE"]){
        f.attributes["_oktmo"] = f.attributes["Municipality2_point.OKTMO1CODE"]
    }else if(f.attributes["Municipality1_point.OKTMO1CODE"]){
        f.attributes["_oktmo"] = f.attributes["Municipality1_point.OKTMO1CODE"]
    }else if(f.attributes["Region_point.OKTMO1CODE"]){
        f.attributes["_oktmo"] = f.attributes["Region_point.OKTMO1CODE"]
    }else{
        f.attributes["_oktmo"] =  null;
    }

	if (f.attributes["Settlement_point.M1_CNT"]){
		f.attributes["_mo"] = f.attributes["Settlement_point.M1_CNT"]
	}else if (f.attributes["Municipality2_point.M1_CNT"]){
		f.attributes["_mo"] = f.attributes["Municipality2_point.M1_CNT"]
	}else if(f.attributes["Municipality1_point.M1_CNT"]){
		f.attributes["_mo"] = f.attributes["Municipality1_point.M1_CNT"]
	}else if(f.attributes["Region_point.M1_CNT"]){
		f.attributes["_mo"] = f.attributes["Region_point.M1_CNT"]
	}else{
		f.attributes["_mo"] =  null;
	}

	if (f.attributes["Settlement_point.M2_CNT"]){
		f.attributes["_mo2"] = f.attributes["Settlement_point.M2_CNT"]
	}else if (f.attributes["Municipality2_point.M2_CNT"]){
		f.attributes["_mo2"] = f.attributes["Municipality2_point.M2_CNT"]
	}else if(f.attributes["Municipality1_point.M2_CNT"]){
		f.attributes["_mo2"] = f.attributes["Municipality1_point.M2_CNT"]
	}else if(f.attributes["Region_point.M2_CNT"]){
		f.attributes["_mo2"] = f.attributes["Region_point.M2_CNT"]
	}else{
		f.attributes["_mo2"] =  null;
	}

	if (f.attributes["Settlement_point.SET_CNT"]){
		f.attributes["_np"] = f.attributes["Settlement_point.SET_CNT"]
	}else if (f.attributes["Municipality2_point.SET_CNT"]){
		f.attributes["_np"] = f.attributes["Municipality2_point.SET_CNT"]
	}else if(f.attributes["Municipality1_point.SET_CNT"]){
		f.attributes["_np"] = f.attributes["Municipality1_point.SET_CNT"]
	}else if(f.attributes["Region_point.SET_CNT"]){
		f.attributes["_np"] = f.attributes["Region_point.SET_CNT"]
	}else{
		f.attributes["_np"] =  null;
	}

	if (f.attributes["Settlement_point.OFFICES_CNT"]){
		f.attributes["_rosreestr"] = f.attributes["Settlement_point.OFFICES_CNT"]
	}else if (f.attributes["Municipality2_point.OFFICES_CNT"]){
		f.attributes["_rosreestr"] = f.attributes["Municipality2_point.OFFICES_CNT"]
	}else if(f.attributes["Municipality1_point.OFFICES_CNT"]){
		f.attributes["_rosreestr"] = f.attributes["Municipality1_point.OFFICES_CNT"]
	}else if(f.attributes["Region_point.OFFICES_CNT"]){
		f.attributes["_rosreestr"] = f.attributes["Region_point.OFFICES_CNT"]
	}else{
		f.attributes["_rosreestr"] =  null;
	}

    f.attributes["_name"] = null;

    switch (type){
        case 0:
            f.attributes["_name"] =  f.attributes["Region_point.NAME"];
			f.attributes["_xmin"] =  f.attributes["Region_point.XMIN"];
			f.attributes["_xmax"] =  f.attributes["Region_point.XMAX"];
			f.attributes["_ymin"] =  f.attributes["Region_point.YMIN"];
			f.attributes["_ymax"] =  f.attributes["Region_point.YMAX"];
            break;
        case 1:
            f.attributes["_name"] =  f.attributes["Municipality1_point.NAME"];
			f.attributes["_xmin"] =  f.attributes["Municipality1_point.XMIN"];
			f.attributes["_xmax"] =  f.attributes["Municipality1_point.XMAX"];
			f.attributes["_ymin"] =  f.attributes["Municipality1_point.YMIN"];
			f.attributes["_ymax"] =  f.attributes["Municipality1_point.YMAX"];
            break;
        case 2:
            f.attributes["_name"] = f.attributes["Municipality2_point.NAME"];
			f.attributes["_xmin"] =  f.attributes["Municipality2_point.XMIN"];
			f.attributes["_xmax"] =  f.attributes["Municipality2_point.XMAX"];
			f.attributes["_ymin"] =  f.attributes["Municipality2_point.YMIN"];
			f.attributes["_ymax"] =  f.attributes["Municipality2_point.YMAX"];
            break;
        case 3:
            f.attributes["_name"] =  f.attributes["Settlement_point.NAME"];
			f.attributes["_xmin"] =  f.attributes["Settlement_point.XMIN"];
			f.attributes["_xmax"] =  f.attributes["Settlement_point.XMAX"];
			f.attributes["_ymin"] =  f.attributes["Settlement_point.YMIN"];
			f.attributes["_ymax"] =  f.attributes["Settlement_point.YMAX"];
            break;
    }

    f.attributes["_type"] = type;
}

function searchATD(whereClause, qt, type) {
    var query = new esri.tasks.Query();
    query.returnGeometry = true;
    query.outFields = ["*"];
    query.where = whereClause;

    qt.execute(query, function (featureSet) {
        if (featureSet.features.length > 0) {

            for (var i in featureSet.features) {
                featureSet.features[i].point = _clickedPoint;
                prepareFeature(featureSet.features[i], type);
            }

            showAtdResultList(featureSet.features);
            searchAtdCompleted();
        }
        else {
            showEmptyResultMessage();
        }
        showResultPanel();
    }, onQueryError);
}

var ATD1_FIELD = 'Идентификатор НП',
    ATD2_FIELD = 'Идентификатор МО 2 уровня',
    ATD3_FIELD = 'Идентификатор МО 1 уровня',
    ATD4_FIELD = 'Код СФ';

function getAtdInfo(f){
    if (f.attributes['Тип границы']){
        return {type:-1};
    }
    if (f.attributes['Идентификатор полного адреса']){
        switch(f.attributes['Идентификатор полного адреса'].split('|').length){
            case 1:
                return {type: 0, field: 'Region_point.REGIONCODE', field2: 'REGIONCODE', alias: ATD4_FIELD, qt: new esri.tasks.QueryTask(LAYERS_URL.atdInfo0)};
                break;
            case 2:
                return {type: 1, field: 'Municipality1_point.MUNICIPALITY1ID', field2: 'MUNICIPALITY1ID', alias: ATD3_FIELD, qt: new esri.tasks.QueryTask(LAYERS_URL.atdInfo1)};
                break;
            case 3:
                return {type: 2, field: 'Municipality2_point.MUNICIPALITY2ID', field2: 'MUNICIPALITY2ID', alias: ATD2_FIELD, qt: new esri.tasks.QueryTask(LAYERS_URL.atdInfo2)};
                break;
        }
    }
    else{
        return {type: 3, field: 'Settlement_point.SETTLEMENTID', field2: 'SETTLEMENTID', alias: ATD1_FIELD, qt: new esri.tasks.QueryTask(LAYERS_URL.atdInfo3)};
    }
}

function identifyATD(geometry){
    _clickedPoint = geometry;
	_parentClick = false;

    var identifyQueryTask = new esri.tasks.IdentifyTask(LAYERS_URL.atdSelect);

    var parameters = new esri.tasks.IdentifyParameters();
    parameters.tolerance = 3;
    parameters.returnGeometry = false;
    parameters.layerOption = esri.tasks.IdentifyParameters.LAYER_OPTION_TOP;
    parameters.width = _map.width;
    parameters.height = _map.height;
    parameters.geometry = geometry;
    parameters.mapExtent = _map.extent;

    identifyQueryTask.execute(parameters, function (featureSet) {
        if (featureSet.length > 0) {
            var atdInfo = getAtdInfo(featureSet[0].feature);

            var whereClause = '';

            if (atdInfo.type == -1){
                for (var i = 0; i < featureSet.length; i++) {
                    whereClause += "," + featureSet[i].feature.attributes["Идентификатор"];
                }

                searchBorder("BRD_ID IN (" + whereClause.substring(1) + ")");
            }
            else{
                for (var i = 0; i < featureSet.length; i++) {
                    whereClause += ",'" + featureSet[i].feature.attributes[atdInfo.alias] + "'";
                }

                _whereClause = atdInfo.field2 + " IN (" + whereClause.substring(1) + ")";

                searchATD(atdInfo.field + " IN (" + whereClause.substring(1) + ")", atdInfo.qt, atdInfo.type);
            }
        }

        clearAllSelectionPoint();
    }, onIdentifyQueryError);
}

var _parentClick = false;

function parentAtdClick(type, id){
	var info;

	switch(type){
		case 0:
			info = {field: 'Region_point.REGIONCODE', field2: 'REGIONCODE', qt: new esri.tasks.QueryTask(LAYERS_URL.atdInfo0)};
			break;
		case 1:
			info = {field: 'Municipality1_point.MUNICIPALITY1ID', field2: 'MUNICIPALITY1ID', qt: new esri.tasks.QueryTask(LAYERS_URL.atdInfo1)};
			break;
		case 2:
			info = {field: 'Municipality2_point.MUNICIPALITY2ID', field2: 'MUNICIPALITY2ID', qt: new esri.tasks.QueryTask(LAYERS_URL.atdInfo2)};
			break;
	}

	_whereClause = info.field2 + " LIKE '" + id + "'";

	_parentClick = true;

	searchATD(info.field + " LIKE '" + id + "'",  info.qt, type);
}

function searchResultAtdItemClicked(itemNumber){
	_map.infoWindow.hide();

	var selectedItem = _searchResultObjects[itemNumber - 1];

	selectPoint([selectedItem.point], PIN_SYMBOL.load, true);

	highlightAtd(selectedItem);

	showAtdInfoWindow( selectedItem, selectedItem.point);

	zoomToAtd(selectedItem);
}
