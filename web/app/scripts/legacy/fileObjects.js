dojo.require("esri.toolbars.edit");

var _pointSymbol = null;
var _selectedPointSymbol = null;
var _lineSymbol = null;
var _selectedLineSymbol = null;
var _fillSymbol = null;
var _selectedFillSymbol = null;

/*CSV (begin)*/
var CSV_OBJECTS_SPLITTER = ";";

function checkCsvObjectsFileContent(content){
	return true;
}

function convertCsvStoreToGeometryArray(csvStore){
	return dojo.map(csvStore, function(line){
		var lineLength = line.length;

		if (lineLength == 1){//point
			return esri.geometry.geographicToWebMercator(
				new esri.geometry.Point({
						x: line[0][0],
						y: line[0][1],
						spatialReference: {wkid: 4326}
					}
				));
		}
		else if (line[0][0] == line[lineLength - 1][0] && line[0][1] == line[lineLength - 1][1]){//polygon
			return esri.geometry.geographicToWebMercator(
				new esri.geometry.Polygon({
						rings: [line],
						spatialReference: {wkid: 4326}
					}
				));
		}
		else{//polyline
			return  esri.geometry.geographicToWebMercator(
				new esri.geometry.Polyline({
						paths: [line],
						spatialReference: {wkid: 4326}
					}
				));
		}
	});
}

function handleCsvObjects(result){
	if (checkCsvObjectsFileContent(result)){
		var lines = result.split("\n");
		var csvStore = dojo.map(lines, function(line){
			var coordinates = line.split(CSV_OBJECTS_SPLITTER);
			return dojo.map(coordinates, function(coordinate){
				var pair = coordinate.split(",");
				return [parseFloat(pair[0]), parseFloat(pair[1])];
			});
		});

		var geometryObjects = convertCsvStoreToGeometryArray(csvStore);
		var fileExtent = null;

		dojo.forEach(geometryObjects, function(geometry){
			var symbol = null;

			switch(geometry.type){
				case "point":
					symbol = _pointSymbol;
					break;
				case "polyline":
					symbol = _lineSymbol;
					break;
				case "polygon":
					symbol = _fillSymbol;
					break;
			}

			var extent = geometry.getExtent();

			if(extent){
				if (fileExtent){
					fileExtent = fileExtent.union(extent);
				}
				else{
					fileExtent = extent;
				}
			}

			_fileObjectsLayer["objects"].add(new esri.Graphic(geometry,symbol));
		});

		_map.setExtent(fileExtent, true);
	}
}
/*CSV (end)*/

/*KML (begin)*/
function checkKmlObjectsFileContent(content){
	return true;
}

function xmlNodeValue(node) {
	if (!node) {
		return '';
	} else {
		return (node.innerText || node.text || node.textContent).trim();
	}
};

function getGeometries(node, type) {
	var path;
	var coordinate;
	var geometry;

	return dojo.map(
		node.getElementsByTagName(type),
		function(element){
			path = xmlNodeValue(element.getElementsByTagName("coordinates")[0])
				.trim()
				.replace(/\s+/g, " ")
				.replace(/, /g, ",")
				.split(" ");

			switch (type){
				case "Point":
					coordinate = path[0].split(",");
					geometry = esri.geometry.geographicToWebMercator(
						new esri.geometry.Point({
								x: coordinate[0],
								y: coordinate[1],
								spatialReference: {wkid: 4326}
							}
						));
					break;
				case "LineString":
					coordinate = dojo.map(path, function(points){return points.split(",");});

					geometry = esri.geometry.geographicToWebMercator(
						new esri.geometry.Polyline({
								paths: [coordinate],
								spatialReference: {wkid: 4326}
							}
						));
					break;
				case "LinearRing":
					coordinate = dojo.map(path, function(points){return points.split(",");});

					geometry = esri.geometry.geographicToWebMercator(
						new esri.geometry.Polygon({
								rings: [coordinate],
								spatialReference: {wkid: 4326}
							}
						));
					break;
			};

			return geometry;
		}
	);
}

function handleKmlObjects(result){
	if (checkKmlObjectsFileContent(result)) {
		var xml = (new DOMParser()).parseFromString(result,"text/xml");

		var geometries = getGeometries(xml, "LinearRing");
		geometries.push.apply(geometries, getGeometries(xml, "LineString"));
		geometries.push.apply(geometries, getGeometries(xml, "Point"));

		var fileExtent = null;

		dojo.forEach(geometries, function(geometry){
			if (geometry){
				var symbol = null;

				switch(geometry.type){
					case "point":
						symbol = _pointSymbol;
						break;
					case "polyline":
						symbol = _lineSymbol;
						break;
					case "polygon":
						symbol = _fillSymbol;
						break;
				}

				var extent = geometry.getExtent();

				if(extent){
					if (fileExtent){
						fileExtent = fileExtent.union(extent);
					}
					else{
						fileExtent = extent;
					}
				}

				_fileObjectsLayer["objects"].add(new esri.Graphic(geometry,symbol));
			}
		});

		_map.setExtent(fileExtent, true);
	}
}
/*KML (end)*/

function handleFileObjects(file) {
	var reader = new FileReader();

	reader.onload = function(event) {
		if (file.name.indexOf(".csv") > -1) {
			handleCsvObjects(event.target.result);
		}
		else if (file.name.indexOf(".kml") > -1) {
			handleKmlObjects(event.target.result);
		}
	};

	if (file.name.indexOf(".csv") > -1 || file.name.indexOf(".kml") > -1) {
		reader.readAsText(file);
	}
}

function dropFileHandler(event){
	event.stopPropagation();
	event.preventDefault();

	var files = event.dataTransfer.files;
	var count = files.length;

	if (count > 0){
		handleFileObjects(files[0]);
	}
}

function symbolizeFileObject(graphic, isSelect){
	switch(graphic.geometry.type){
		case "point":
			graphic.setSymbol(isSelect ? _selectedPointSymbol : _pointSymbol);
			break;
		case "polyline":
			symbol = _lineSymbol;
			graphic.setSymbol(isSelect ? _selectedLineSymbol : _lineSymbol);
			break;
		case "polygon":
			symbol = _fillSymbol;
			graphic.setSymbol(isSelect ? _selectedFillSymbol : _fillSymbol);
			break;
	}
};

function deactivateFileObjectsEditing(){};
function activateFileObjectsEditing(){};

function initFileObjects(){
	if (window.File && window.FileReader && window.FileList && window.Blob){
		_lineSymbol = new esri.symbol.SimpleLineSymbol(
			esri.symbol.SimpleLineSymbol.STYLE_SOLID,
			new dojo.Color([29,162,48]),
			3
		);
		_selectedLineSymbol = new esri.symbol.SimpleLineSymbol(
			esri.symbol.SimpleLineSymbol.STYLE_SOLID,
			new dojo.Color([255,200,0]),
			3
		);
		_pointSymbol = new esri.symbol.SimpleMarkerSymbol(
			esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE,
			7,
			_lineSymbol,
			new dojo.Color([29,162,48, 0.75])
		);
		_selectedPointSymbol = new esri.symbol.SimpleMarkerSymbol(
			esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE,
			7,
			_selectedLineSymbol,
			new dojo.Color([29,162,48, 0.75])
		);

		_fillSymbol = new esri.symbol.SimpleFillSymbol(
			esri.symbol.SimpleFillSymbol.STYLE_SOLID,
			_lineSymbol,
			new dojo.Color([29,162,48,0.5])
		);
		_selectedFillSymbol = new esri.symbol.SimpleFillSymbol(
			esri.symbol.SimpleFillSymbol.STYLE_SOLID,
			_selectedLineSymbol,
			new dojo.Color([29,162,48,0.5])
		);


		var dropbox = dojo.byId("map");

		dojo.connect(dropbox, "dragenter", dojo.stopEvent);
		dojo.connect(dropbox, "dragexit", dojo.stopEvent);
		dojo.connect(dropbox, "dragover", dojo.stopEvent);
		dojo.connect(dropbox, "drop", dropFileHandler);

		var editToolbar = new esri.toolbars.Edit(_map,{
			allowDeletevertices: false,
			vertexSymbol: new esri.symbol.PictureMarkerSymbol(
				"/portalonline/i/fileObjects/vertex.png",
				19,
				19
			)
		});
		editToolbar._scratchGL = _fileObjectsLayer["movers"];//draw movers in _fileObjectsLayer["movers"]

		var fileObjectsEventSource = _fileObjectsLayer["objects"]._div.getEventSource();
		var editingGraphic = null;
		var fileObjectsLayerClickEventHandlerConnection;

		activateFileObjectsEditing = function(){
			fileObjectsLayerClickEventHandlerConnection = dojo.connect(
				_fileObjectsLayer["objects"],
				"onClick",
				function(event){
					dojo.stopEvent(event);

					if (editingGraphic && editingGraphic === event.graphic) {
						editToolbar.deactivate();
						symbolizeFileObject(editingGraphic, false);
						editingGraphic = null;
					} else {
						if (editingGraphic){
							symbolizeFileObject(editingGraphic, false);
						}

						editingGraphic = event.graphic;
						symbolizeFileObject(editingGraphic, true);
						editToolbar.activate(esri.toolbars.Edit.EDIT_VERTICES | esri.toolbars.Edit.MOVE, editingGraphic);
					}
				}
			);

			dojo.style(fileObjectsEventSource, "cursor", "pointer");
		};

		deactivateFileObjectsEditing = function(){//global function
			if (editingGraphic){
				dojo.disconnect(fileObjectsLayerClickEventHandlerConnection);
				editToolbar.deactivate();

				symbolizeFileObject(editingGraphic, false);
				editingGraphic = null;

				dojo.style(fileObjectsEventSource, "cursor", "default");
			}
		};

		activateFileObjectsEditing();
	}
}
