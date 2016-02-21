//SELECT - поставить пимпочку на объекте
//HIGHLIGHT - подсветить желтым

function selectPoint(mapPoints, pin, clearCurrent) {
    var graphics = [];

    if (clearCurrent) {
        _map.graphics.clear();
    }

    for (var i = 0; i < mapPoints.length; i++) {        
        var graphic = new esri.Graphic(mapPoints[i], pin);
        _map.graphics.add(graphic);
        graphics.push(graphic);
    }

    return graphics;
}

function clearSelectionPoint(graphics) {
    for (var i = 0; i < graphics.length; i++) {
        _map.graphics.remove(graphics[i]);
    }
}

function addSearchedObject(feature, pin){
	var graphic = new esri.Graphic(feature.point, pin);
	_map.graphics.add(graphic);
}

function clearAllSelectionPoint() {
    _map.graphics.clear();
}

function getObjectIdField(objectType) {
    switch (objectType) {
        case PortalObjectTypes.cadastreOkrug:
            return FIELDS.cadastreOkrugId;
        case PortalObjectTypes.cadastreRayon:
            return FIELDS.cadastreRayonId;
        case PortalObjectTypes.cadastreKvartal:
            return FIELDS.cadastreKvartalId;
        case PortalObjectTypes.parcel:
            return FIELDS.parcelId;
		case PortalObjectTypes.oks:
            return FIELDS.oksId;
        case PortalObjectTypes.subject:
            return FIELDS.subjectId;
        case PortalObjectTypes.mo1Level:
            return FIELDS.mo1LevelId;
        case PortalObjectTypes.mo2Level:
            return FIELDS.mo2LevelId;
        case PortalObjectTypes.settlement:
            return FIELDS.settlementId;            
    }
}

function getLayerIds(objectType) {
    switch (objectType) {
        case PortalObjectTypes.cadastreOkrug:
            return LAYER_IDS.cadastreOkrug;
        case PortalObjectTypes.cadastreRayon:
            return LAYER_IDS.cadastreRayon;
        case PortalObjectTypes.cadastreKvartal:
            return LAYER_IDS.cadastreKvartal;
        case PortalObjectTypes.parcel:
            return LAYER_IDS.parcel;
		case PortalObjectTypes.oks:
            return LAYER_IDS.oks;
        case PortalObjectTypes.subject:
            return LAYER_IDS.subject;
        case PortalObjectTypes.mo1Level:
            return LAYER_IDS.mo1Level;
        case PortalObjectTypes.mo2Level:
            return LAYER_IDS.mo2Level;
        case PortalObjectTypes.settlement:
            return LAYER_IDS.settlement;
    }
}

function highlightObject(objectType, feature) {
    if ((objectType == PortalObjectTypes.cadastreOkrug || objectType == PortalObjectTypes.cadastreRayon ||
         objectType == PortalObjectTypes.cadastreKvartal || objectType == PortalObjectTypes.parcel || objectType == PortalObjectTypes.oks) &&
         (!feature.attributes[FIELDS.geometryError] || feature.attributes[FIELDS.geometryError] == ' ')) {

        var objectIdField = getObjectIdField(objectType);
        var whereClause = objectIdField + " LIKE '" + feature.attributes[objectIdField] + "'";
        var layerDefenitions = [];
        var layerIds = getLayerIds(objectType);

        for (var i = 0; i < layerIds.length; i++){
            layerDefenitions[layerIds[i]] = whereClause;
		}

        _cadastreLayers['select'].setVisibleLayers(layerIds);
        _cadastreLayers['select'].setLayerDefinitions(layerDefenitions);
        _addressLayers['select'].hide();        
		_terrZoneLayers['select'].hide();
		_zouitLayers['select'].hide();

		_cadastreLayers['select'].show();
    }
    else if (feature.attributes[FIELDS.geometryError] && feature.attributes[FIELDS.geometryError] !== " ") {
        _cadastreLayers['select'].hide();
    }
    else if (objectType == PortalObjectTypes.subject ||
        objectType == PortalObjectTypes.mo1Level ||
        objectType == PortalObjectTypes.mo2Level ||
	    objectType == PortalObjectTypes.settlement ||
		objectType == PortalObjectTypes.street ||
		objectType == PortalObjectTypes.building) {

        var objectIdField = getObjectIdField(objectType);
        var whereClause = objectIdField + " LIKE '" + feature.attributes[objectIdField] + "'";
        var layerDefenitions = [];
        var layerIds = getLayerIds(objectType);

		for (var i = 0; i < layerIds.length; i++){
            layerDefenitions[layerIds[i]] = whereClause;
		}

        _addressLayers['select'].setVisibleLayers(layerIds);
        _addressLayers['select'].setLayerDefinitions(layerDefenitions);
        _cadastreLayers['select'].hide();
        _addressLayers['select'].show();
    }
}

function higlightCadastreObjects(objectsTypes, whereClause){
	var layerDefenitions = [];
	var layerIds = getLayerIds(objectsTypes);

	for (var i = 0; i < layerIds.length; i++)
		layerDefenitions[layerIds[i]] = whereClause;

	_cadastreLayers['select'].setVisibleLayers(layerIds);
	_cadastreLayers['select'].setLayerDefinitions(layerDefenitions);
	_addressLayers['select'].hide();
	_terrZoneLayers['select'].hide();
	_zouitLayers['select'].hide();

	_cadastreLayers['select'].show();
}

function clearHighlightObject() {
    _cadastreLayers['select'].hide();
	_zouitLayers["select"].hide();
	_terrZoneLayers["select"].hide();
    _atdLayers["select"].hide();
    _frameLayers["select"].hide();
}

function hideInfoWindow() {
    _map.infoWindow.hide();
}

function zoomToObjects(features){
	var fullExtent;
    var extent;

	for (var i in features) {
		if (features[i].attributes[FIELDS.xmin] && features[i].attributes[FIELDS.xmax] &&
            features[i].attributes[FIELDS.ymin] && (features[i].attributes[FIELDS.hasPolygon] == 1 || typeof(features[i].attributes[FIELDS.hasPolygon]) === 'undefined')) {
			extent = new esri.geometry.Extent(features[i].attributes[FIELDS.xmin], features[i].attributes[FIELDS.ymin], features[i].attributes[FIELDS.xmax], features[i].attributes[FIELDS.ymax], _map.spatialReference);
		}
		else {
			if (feature.point) {
				extent = new esri.geometry.Extent(features[i].point.x, features[i].point.y, features[i].point.x, features[i].point.y, _map.spatialReference);
			}
        }

		if (!fullExtent){
			fullExtent = extent;
        }
		else {
            fullExtent = fullExtent.union(extent);
        }
	}
	
	if (fullExtent) 
		_map.setExtent(fullExtent, true);
}

function zoomToObject(feature) {
    if (feature.attributes[FIELDS.xmin] && feature.attributes[FIELDS.xmax] &&
         feature.attributes[FIELDS.ymin] && feature.attributes[FIELDS.ymax]  && (feature.attributes[FIELDS.hasPolygon] == 1 || typeof(feature.attributes[FIELDS.hasPolygon]) === 'undefined')) {

        var extent = new esri.geometry.Extent(feature.attributes[FIELDS.xmin], feature.attributes[FIELDS.ymin],
                                             feature.attributes[FIELDS.xmax], feature.attributes[FIELDS.ymax],
                                             _map.spatialReference);

        _map.setExtent(extent, true);
    }
    else if (feature.point) {    
		feature.point.spatialReference = _map.spatialReference;
	    _map.centerAndZoom(feature.point, 11);//.centerAt(feature.point);
    }   
}

function mapPointToScreen(extent, point) {
    return esri.geometry.toScreenPoint(extent, _map.width, _map.height, point);
}

function getCopyrights(extent){
	/*var maps='';
	for(var i in _mapLayers) {
		if (_mapLayers.hasOwnProperty(i)) {
			if(_mapLayers[i].visible)
				maps = maps + ",'" + i + "'" ;
		}
	}
	
	if(maps != ''){
		_queryTask.getCopyrights(extent, maps.substring(1), _map.getLevel(), function(featureSet){
			var copyrightContainer = dojo.byId('copyright');
		    var copyright = '';
		
		featureSet.features.sort(function(a,b){ return (a.attributes['Owner'] == b.attributes['Owner'])?(0):((a.attributes['Owner'] > b.attributes['Owner'])?(1):(-1)); });
			for (var i = 0; i < featureSet.features.length; i++) {
				//console.log(featureSet.features[i].attributes['Owner']);
				copyright += featureSet.features[i].attributes['Owner']+ ' 2013'+ ', ';
			}
			
			copyrightContainer.innerHTML = copyright.substring(0,copyright.length - 2);
		});
	} */
}