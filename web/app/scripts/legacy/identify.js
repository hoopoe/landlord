var _identifyQueryTask;

function onIdentifyQueryError(){
    clearAllSelectionPoint();
    //////////////////////////////////////////////////
    //////////////////////////////////////////////////
}

function getCadastreObjectTypeById(id) {
    switch (id.length) {
        case 2:
            return PortalObjectTypes.cadastreOkrug;
        case 4:
            return PortalObjectTypes.cadastreRayon;
        case 11:
            return PortalObjectTypes.cadastreKvartal;
        case 16:
		case 18:
            return PortalObjectTypes.parcel;
		case 21:
            return PortalObjectTypes.oks;
    }
}

var _clickedPoint;

function searchCompleted() {
    selectPoint([_searchResultObjects[0].point], PIN_SYMBOL.load, true);

    var objectIdField = getObjectIdField(_searchResultObjectsType);
    highlightObject(_searchResultObjectsType, _searchResultObjects[0]);

    showInfoWindow(
		_searchResultObjectsType,
		_searchResultObjects[0], 
		_map.toScreen(
			(_clickedPoint != null)?(_searchResultObjects[0].clickedPoint = _clickedPoint):(_searchResultObjects[0].point)
		)
	);

	_selectedObject = { objectType: _searchResultObjectsType, object: _searchResultObjects[0] };
    _onSearchCompleted = null;
}

function identifyObject(geometry) {
    _clickedPoint = (geometry.type == "point")?(geometry):(null);

    if (!_identifyQueryTask) {
        _identifyQueryTask = new esri.tasks.IdentifyTask(LAYERS_URL.cadastreIdentify);
    }

    var parameters = new esri.tasks.IdentifyParameters();
    parameters.tolerance = 0;
    parameters.returnGeometry = false;
    parameters.layerOption = esri.tasks.IdentifyParameters.LAYER_OPTION_TOP;
    parameters.width = _map.width;
    parameters.height = _map.height;
    parameters.geometry = geometry;
    parameters.mapExtent = _map.extent;

    _identifyQueryTask.execute(parameters, function (featureSet) {
        if (featureSet.length > 0) {
			var objectType;
			if (typeof featureSet[0].feature.attributes["Тип ОКС"] !== "undefined") {
				objectType = PortalObjectTypes.oks;
			}
			else if(featureSet[0].value.split(':').length == 4) {
				objectType = PortalObjectTypes.parcel;
			}
			else {
				objectType = getCadastreObjectTypeById(featureSet[0].value);
			}

			var whereClause = '';
			var cadNumbers = '';
			for (var i = 0; i < featureSet.length; i++) {
				whereClause += ",'" + featureSet[i].value + "'";
				cadNumbers += ",'" + featureSet[i].feature.attributes[objectType == PortalObjectTypes.oks ? 'Кадастровый номер' : 'Строковый идентификатор ИПГУ'] + "'";
			}

            _onSearchCompleted = searchCompleted;

			if(objectType == PortalObjectTypes.parcel || objectType == PortalObjectTypes.oks){
				searchParcelObject(objectType, { cadNumbers: "[" + cadNumbers.substring(1) + "]", onlyAttributes: false});
				_identifyParcelsCadnums = "[" + cadNumbers.substring(1) + "]";
			}
			else {
				searchObject(objectType, getObjectIdField(objectType) + " IN (" + whereClause.substring(1) + ")");
			}
		}
		else{
			clearAllSelectionPoint();
		}
    }, onIdentifyQueryError);
}

function identify(geometry){
	_identifyParcelsCadnums = "";
	
	if (dojo.byId("infoBufferTextbox").value == ""){
			identifyObject(geometry);
		}
		else {
			var gsvc = new esri.tasks.GeometryService(LAYERS_URL.geometryService);
			var params = new esri.tasks.BufferParameters();
			params.geometries = [ geometry ];

			params.distances = [dojo.byId("infoBufferTextbox").value];
			params.unit = esri.tasks.GeometryService.UNIT_METER;
			params.outSpatialReference = _map.spatialReference;

			gsvc.buffer(params, function(g){
				identifyObject(g[0]);
			});
		}
}