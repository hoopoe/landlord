var _map;
var _scalebar;
var _mapLayers;
var _cadastreLayers;

var _zouitLayers;
var _terrZoneLayers;
var _atdLayers;
var _frameLayers;

var _addressLayers;

var _fileObjectsLayer;

var _selectedTool;
var _toolbar;
var _toolbarFunctions = {
	"panTool": function () { _drawToolbar.deactivate(); _toolbar.deactivate();_measureToolbar.deactivate();},
	"zoomTool": function () { _drawToolbar.deactivate(); _toolbar.activate(esri.toolbars.Navigation.ZOOM_IN); _measureToolbar.deactivate();},
	"backTool": function () { _toolbar.zoomToPrevExtent(); },
	"nextTool": function () { _toolbar.zoomToNextExtent(); },
	
	"infoTool": function () { _drawToolbar.deactivate(); _toolbar.deactivate(); _measureToolbar.deactivate();},
	"infoToolLine": function () { _toolbar.deactivate(); _measureToolbar.deactivate(); _drawToolbar.activate(esri.toolbars.Draw.POLYLINE); },
	"infoToolPolygon": function () { _toolbar.deactivate(); _measureToolbar.deactivate(); _drawToolbar.activate(esri.toolbars.Draw.POLYGON); },
	
	"infoToolZouit": function () { _drawToolbar.deactivate(); _toolbar.deactivate(); _measureToolbar.deactivate();},
	"infoToolTerrZone": function () { _drawToolbar.deactivate(); _toolbar.deactivate(); _measureToolbar.deactivate();},
	"infoToolBorder": function () { _drawToolbar.deactivate(); _toolbar.deactivate(); _measureToolbar.deactivate();},
	
	"rulerTool": function () {
		_drawToolbar.deactivate();
		_toolbar.deactivate();
		_measureToolbar.activate(dataplus.toolbars.Measure.LENGTH);
	},
	"rulerAreaTool": function () {
		_drawToolbar.deactivate();
		_toolbar.deactivate();
		_measureToolbar.activate(dataplus.toolbars.Measure.AREA);
	}
};

isLoad(true, null);

var _geometryService;
var _drawToolbar;
var _measureToolbar;
var _measureType; // 1 - length, 2 - area and perimeter

var _frameVisibleLayers = [-1];
var _frameSelectedVisibleLayers = [-1];

dojo.require("esri.map");
dojo.require("esri.dijit.OverviewMap");
dojo.require("esri.toolbars.navigation");
dojo.require("dojo.parser");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dojo.data.ItemFileReadStore"); 
dojo.require("esri.tasks.locator");
dojo.require("esri.tasks.geometry");
dojo.require("esri.toolbars.draw");
dojo.require("esri.layers.osm");
dojo.require("esri.dijit.Scalebar");
dojo.require("dojo.io.script");
dojo.require("dojo.back");
//dojo.require("dojox.mobile");
//dojo.requireIf(!dojo.isWebKit, "dojox.mobile.compat");

function overviewMapInit() {
	var layer = new esri.layers.ArcGISTiledMapServiceLayer(LAYERS_URL.overview);
	layer.spatialReference = new esri.SpatialReference({ "wkid": 102113 });

	var overviewMap = new esri.dijit.OverviewMap({
		map: _map,
		baseLayer: layer,
		width: 160,
		height: 124,
		attachTo: "bottom-right",
		expandFactor: 3
	});	
	
	overviewMap.startup();
	
	dojo.query('#'+overviewMap.id).onclick(function(e){
		__eventGui(ACTIONS.ShowOverviewMap, '');
	});

}

function refreshMapcursor(){
	switch (_selectedTool) {
		case "panTool":
			changeMapCursor("mapCursorPan");
			break;
		case "zoomTool":
			changeMapCursor("mapCursorZoom");
			break;
		case "infoTool":
			changeMapCursor("mapCursorInfo");
			break;
		case "infoToolLine":
			changeMapCursor("mapCursorInfo");
			break;
		case "infoToolPolygon":
			changeMapCursor("mapCursorInfo");
			break;

		case "infoToolZouit":
			changeMapCursor("mapCursorInfo");
			break;
		case "infoToolTerrZone":
			changeMapCursor("mapCursorInfo");
			break;
		case "infoToolATD":
			changeMapCursor("mapCursorInfo");
			break;
		case "infoToolFrame":
			changeMapCursor("mapCursorInfo");
			break;
		case 'rulerTool':
			changeMapCursor('mapCursorRuler');
			break;
		case 'rulerAreaTool':
			changeMapCursor('mapCursorRuler');
			break;
	}
}

function mapLoaded() {
	overviewMapInit();
	initFileObjects();

	_measureToolbar = new dataplus.toolbars.Measure(_map);

	dojo.connect(_map, "onMouseDragStart", function () {
		if (_selectedTool != "zoomTool") {
			changeMapCursor("mapCursorPanActive");
		}
	});
	dojo.connect(_map.infoWindow, "onHide", infoWindowHide);

	dojo.connect(_map, "onKeyDown", function (keyEvent) {
		if (keyEvent.keyCode === dojo.keys.SHIFT) {
			changeMapCursor("mapCursorZoom");
		}
	});

	dojo.connect(_map, "onKeyUp", function (keyEvent) {
		if (keyEvent.keyCode === dojo.keys.SHIFT) {
			refreshMapcursor();
		}
	});

	dojo.connect(_map, "onMouseDragEnd", function () {
		refreshMapcursor();
	});  
	
	dojo.query("#map_zoom_slider").onclick(function(e){
		__eventGui(ACTIONS.ZoomSlider, '');
	});

	mapZoomEnd(null, null, null, _map.getLevel());
    dojo.byId('version').innerHTML = VERSION;
}

function mapMouseClicked(event) {
	if (_selectedTool == "infoTool") {
		hideInfoWindow();
		clearHighlightObject();
		selectPoint([event.mapPoint], PIN_SYMBOL.load, true);

        identifyObject(event.mapPoint);
	}
	else if (_selectedTool == "infoToolZouit"){
		hideInfoWindow();
		clearHighlightObject();
		selectPoint([event.mapPoint], PIN_SYMBOL.load, true);
		identifyZouit(event.mapPoint);
	}
	else if (_selectedTool == "infoToolTerrZone"){
		hideInfoWindow();
		clearHighlightObject();
		selectPoint([event.mapPoint], PIN_SYMBOL.load, true);
		identifyTerrZone(event.mapPoint);
	}
	else if (_selectedTool == "infoToolBorder"){
		hideInfoWindow();
		clearHighlightObject();
		selectPoint([event.mapPoint], PIN_SYMBOL.load, true);
		identifyBorder(event.mapPoint);
	}
    else if (_selectedTool == "infoToolATD"){
        hideInfoWindow();
        clearHighlightObject();
        selectPoint([event.mapPoint], PIN_SYMBOL.load, true);
        identifyATD(event.mapPoint);
    }
    else if (_selectedTool == "infoToolFrame"){
        hideInfoWindow();
        clearHighlightObject();
        selectPoint([event.mapPoint], PIN_SYMBOL.load, true);
        identifyFrame(event.mapPoint);
    }
	else if (_selectedTool == "rulerTool" || _selectedTool == "rulerAreaTool" || _selectedTool == "infoToolLine" || _selectedTool == "infoToolPolygon"){
		_map.graphics.clear();
	}
}

function mapMouseMove(event) {
	var point = event.mapPoint;
	//dojo.byId("info").innerHTML = point.x + ", " + point.y;
}

function addEnterClickOnSearchTextbox() {
	dojo.connect(dojo.byId('searchTextbox'), 'onkeypress', function (e) {
		if (e.keyCode == dojo.keys.ENTER) {
			searchButtonClick();
		}
	});
}

function mapZoomEnd(extent, zoomFactor, anchor, level) {
	changeThematicsMapsDisabled(level);
}

function pinSymbolInit() {
	PIN_SYMBOL.normal = new esri.symbol.PictureMarkerSymbol("/portalonline/i/pin_normal.png", 12, 12);
	PIN_SYMBOL.load = new esri.symbol.PictureMarkerSymbol("/portalonline/i/pin_load.gif", 16, 16);
	PIN_SYMBOL.searched = new esri.symbol.PictureMarkerSymbol("/portalonline/i/pin_searched.png", 9, 9);
}

function initFunctionality(){
    _map.graphics.clear();

    if (_measureType == 1){
        _drawToolbar.activate(esri.toolbars.Draw.POLYLINE);
    }
    else if (_measureType == 2){
        _drawToolbar.activate(esri.toolbars.Draw.POLYGON);
    }
}

function drawEnd(geometry) {
	if (_selectedTool == "rulerTool" || _selectedTool == "rulerAreaTool" ){
		if (_measureType == 1) {
			_map.graphics.add(new esri.Graphic(geometry, _drawToolbar.lineSymbol));

			var lengthParams = new esri.tasks.LengthsParameters();
			//_map.graphics.clear();
			lengthParams.polylines = [geometry];
			lengthParams.lengthUnit = esri.tasks.GeometryService.UNIT_METER;
			lengthParams.geodesic = true;
			_geometryService.lengths(lengthParams);
		}
		else if (_measureType == 2) {
			_map.graphics.add(new esri.Graphic(geometry, _drawToolbar.fillSymbol));

			var areasAndLengthParams = new esri.tasks.AreasAndLengthsParameters();
			areasAndLengthParams.lengthUnit = esri.tasks.GeometryService.UNIT_METER;
			areasAndLengthParams.areaUnit = esri.tasks.GeometryService.UNIT_SQUARE_METERS;
			
			_geometryService.project([geometry],  new esri.SpatialReference({wkid:102028}), function(geometries) {
				 areasAndLengthParams.polygons = geometries;
				 _geometryService.areasAndLengths(areasAndLengthParams);
			});
		}
	}
	else if (_selectedTool == "infoToolLine" || _selectedTool == "infoToolPolygon"){
		hideInfoWindow();
		clearHighlightObject();

		identify(geometry);
	}
}

function numberToSpacesString(num){
	num += '';
	x = num.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ' ' + '$2');
	}
	return x1 + x2;
}

function formatLength(l){
	if (l < 1000)
		return Math.round(l) + ' м';
	else if (l < 2000)
		return Math.round(l)/1000 + ' км';
	else if (l < 7000)
		return Math.round(l/10)/100 + ' км';
	else if (l < 50000)
		return Math.round(l/100)/10 + ' км';
	else 
		return numberToSpacesString(Math.round(l/1000)) + ' км';
}

function formatArea(a){
	if (a < 10000)
		return numberToSpacesString(Math.round(a)) + ' кв.м';
	else if (a < 50000)
		return numberToSpacesString(Math.round(a)/10000) + ' га';
	else if (a < 100000)
		return numberToSpacesString(Math.round(a/10)/1000) + ' га';
	else if (a < 500000)
		return numberToSpacesString(Math.round(a/100)/100) + ' га';
	else if (a < 700000)
		return numberToSpacesString(Math.round(a/1000)/10) + ' га';
	else if (a < 1000000)
		return numberToSpacesString(Math.round(a/10000)) + ' га';
	else if (a < 5000000)
		return numberToSpacesString(Math.round(a/10000)/100) + ' кв. км';
	else if (a < 50000000)
		return numberToSpacesString(Math.round(a/100000)/10) + ' кв. км';
	else //if (a < 100000000000)
		return numberToSpacesString(Math.round(a/1000000)) + ' кв. км';
	//	//////
	//else if (a < 1000000000000000)
	//	return Math.round(a/1000000000) + ' тыс. кв. км';
	//	/////
	//else 
	//	return Math.round(a/1000000000000) + ' млн. кв. км';
}

function setRulerTextbox(length){
	dojo.byId('rulerTextbox').innerHTML = formatLength(length);
	
	//var rulerLabel = dojo.byId('rulerLabel');
	//rulerLabel.innerHTML = 'метр' + ((length % 10 == 1 && length % 100 != 11) ? (""): ((length % 10 >= 2 && length % 10 <= 4 && (length % 100 < 10 || length % 100 >= 20)) ? ("а") : ("ов")));
}

function setRulerAreaTextbox(area){
	dojo.byId('rulerAreaTextbox').innerHTML = formatArea(area);
	
	//dojo.byId('rulerAreaLabel').innerHTML = 'кв. метр' + ((length % 10 == 1 && length % 100 != 11) ? (""): ((length % 10 >= 2 && length % 10 <= 4 && (length % 100 < 10 || length % 100 >= 20)) ? ("а") : ("ов")));
}

function outputResult(result) {

    if (_measureType == 1) {
		setRulerTextbox(result.lengths[0]);
		changeRulerTextboxVisible(true);		
    }
    else if (_measureType == 2) {
        setRulerAreaTextbox(result.areas[0]);
		changeRulerAreaTextboxVisible(true);
    }
}

function outputAreaAndLengthResult(result) {

    _map.graphics.clear();
}

function measure() {
    initFunctionality();
}

function init(){
	toolbarConstructor();
	tabInit("searchExPanel");
	pinSymbolInit();
	addEnterClickOnSearchTextbox();
	resizeResultList();

	esriConfig.defaults.map.slider = {
		left: "15px",
		top: "15px",
		height: "185px",
		width: null
	};	
	localize();
		
	initMainLayer(function(mainLayer){
				
		initMapAndLayers(mainLayer);
		
	    _geometryService = new esri.tasks.GeometryService(LAYERS_URL.geometryService);

	    dojo.connect(_geometryService, "onLengthsComplete", outputResult);
	    dojo.connect(_geometryService, "onAreasAndLengthsComplete", outputResult);

	    _drawToolbar = new esri.toolbars.Draw(_map, { showTooltips: false});
		_drawToolbar.setLineSymbol(new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0,0,0]), 1));
		_drawToolbar.setFillSymbol(new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, _drawToolbar.lineSymbol ,new dojo.Color([255,255,0,0.25])));
		
	    dojo.connect(_drawToolbar, "onDrawEnd", drawEnd);
		
		dojo.connect(_map, "onLoad", mapLoaded);
		dojo.connect(_map, "onMouseMove", mapMouseMove);
		dojo.connect(_map, "onClick", mapMouseClicked);
		dojo.connect(_map, "onZoomEnd", mapZoomEnd);
		
		//dojo.connect(_map, "onMouseMove", showCoordinates);
		//dojo.connect(_map, "onMouseDrag", showCoordinates);
		
		_toolbar = new esri.toolbars.Navigation(_map);

		if (window.History){//Check History.js
			var browserHistoryTools = new BrowserHistoryTools(_map);
		}

		_selectedTool = "infoTool";
		changeMapCursor("mapCursorInfo"); //Инструмент по умолчанию
		
		dojo.connect(_map, "onExtentChange", getCopyrights);
	
		if(dojo.isWebKit && (navigator.userAgent.indexOf('iPad') >= 0 || navigator.userAgent.indexOf('iPhone') >= 0))
			prepareForIOS();
			
		_scalebar = new esri.dijit.Scalebar({ map:_map, scalebarUnit: 'metric' });
	});
}

dojo.addOnLoad(init);

var _legendCount = 1;
var _zoneCount = 0;

function toolButtonClick(toolId) {
	if (_toolbarFunctions.hasOwnProperty(toolId)) {
		_toolbarFunctions[toolId]();
		
		changeRulerTextboxVisible(false);
		changeRulerAreaTextboxVisible(false);
		changeInfoBufferTextboxVisible(false);
	}
	else if (toolId == 'linkTool'){
		changeRulerTextboxVisible(false);
		changeRulerAreaTextboxVisible(false);
		changeInfoBufferTextboxVisible(false);
	}

    var frameLayerVisible = false;
    var legendCheckbox = dojo.byId('legendCheckbox');

	if (!legendCheckbox.labels){
		legendCheckbox.labels = dojo.query("label[for=\"" + legendCheckbox.id + "\"]");
	}

	switch (toolId) {
		case "panTool":
			changeMapCursor("mapCursorPan");
            _selectedTool = toolId;
			break;
		case "zoomTool":
			changeMapCursor("mapCursorZoom");
            _selectedTool = toolId;
			break;
		case "infoTool":
			changeMapCursor("mapCursorInfo");
			changeInfoBufferTextboxVisible(true);
            _selectedTool = toolId;
			break;
		case "infoToolLine":
			changeMapCursor("mapCursorInfo");
			changeInfoBufferTextboxVisible(true);
            resetIdentifyCombobox(true);
            _selectedTool = toolId;
			break;
		case "infoToolPolygon":
			changeMapCursor("mapCursorInfo");
			changeInfoBufferTextboxVisible(true);
            resetIdentifyCombobox(true);
            _selectedTool = toolId;
			break;
		case "infoToolZouit":
			changeMapCursor("mapCursorInfo");
            _selectedTool = toolId;
			break;
		case "infoToolTerrZone":
			changeMapCursor("mapCursorInfo");
            _selectedTool = toolId;
			break;
		case "infoToolBorder":
			changeMapCursor("mapCursorInfo");
            _selectedTool = toolId;
			break;
        case "infoToolATD":
            changeMapCursor("mapCursorInfo");
            _selectedTool = toolId;
            break;
        case "infoToolFrame":
            changeMapCursor("mapCursorInfo");
            _selectedTool = toolId;
            break;
		case "basemapTool":
			changeBasemapListVisible();
			break;
		case 'linkTool':
			changeLinkTextboxVisible();
			setLinkText();
			break;
		case 'printTool':
			printMap();
			break;
		case 'cadastreTool':
			if (_cadastreLayers["cadastre"].visible) {
				_cadastreLayers["cadastre"].hide();
				dojo.byId("thematicMapCadastreLegend").style.display = 'none';
				_legendCount --;
				//dojo.addClass(legendCheckbox.labels[0], 'disabledLabel');
				//legendCheckbox.disabled = true;
			}
			else {
				_cadastreLayers["cadastre"].show();
				dojo.byId("thematicMapCadastreLegend").style.display = '';
				_legendCount ++;
				//dojo.removeClass(legendCheckbox.labels[0], 'disabledLabel');
				//legendCheckbox.disabled = false;
			}
			break;
		case 'zouitTool':
			if (_zouitLayers["zouit"].visible) {
				_zouitLayers["zouit"].hide();

				_zoneCount--;
				if (_zoneCount == 0){
					dojo.byId("thematicMapZoneLegend").style.display = 'none';
				}

				_legendCount--;
				//dojo.addClass(legendCheckbox.labels[0], 'disabledLabel');
				//legendCheckbox.disabled = true;
			}
			else {
				_zouitLayers["zouit"].show();
				dojo.byId("thematicMapZoneLegend").style.display = '';
				_legendCount++;
				_zoneCount++;
				//dojo.removeClass(legendCheckbox.labels[0], 'disabledLabel');
				//legendCheckbox.disabled = false;
			}
			break;
		case 'terrZoneTool':
			if (_terrZoneLayers["terrZone"].visible) {
				_terrZoneLayers["terrZone"].hide();

				_zoneCount--;
				if (_zoneCount == 0){
					dojo.byId("thematicMapZoneLegend").style.display = 'none';
				}
				_legendCount--;
				//dojo.addClass(legendCheckbox.labels[0], 'disabledLabel');
				//legendCheckbox.disabled = true;
			}
			else {
				_terrZoneLayers["terrZone"].show();
				dojo.byId("thematicMapZoneLegend").style.display = '';
				_legendCount++;
				_zoneCount++;
				//dojo.removeClass(legendCheckbox.labels[0], 'disabledLabel');
				//legendCheckbox.disabled = false;
			}
			break;
        case 'atdTool':
            if (_atdLayers["atd"].visible) {
                _atdLayers["atd"].hide();
				dojo.byId("thematicMapATDLegend").style.display = 'none';
				_legendCount--;
				//dojo.addClass(legendCheckbox.labels[0], 'disabledLabel');
				//legendCheckbox.disabled = true;
            }
            else {
                _atdLayers["atd"].show();
				dojo.byId("thematicMapATDLegend").style.display = '';
				_legendCount++;
				//dojo.removeClass(legendCheckbox.labels[0], 'disabledLabel');
				//legendCheckbox.disabled = false;
            }
            break;
		case "fullFrameTool":
            _frameVisibleLayers =  _frameVisibleLayers.concat(FRAME_LAYERS_GROUPED[0],FRAME_LAYERS_GROUPED[2],FRAME_LAYERS_GROUPED[3]);
            _frameLayers["frame"].setVisibleLayers(_frameVisibleLayers);

            _frameSelectedVisibleLayers =  _frameSelectedVisibleLayers.concat(FRAME_SELECTED_LAYERS_GROUPED[0],FRAME_SELECTED_LAYERS_GROUPED[2],FRAME_SELECTED_LAYERS_GROUPED[3]);
            _frameLayers["select"].setVisibleLayers(_frameSelectedVisibleLayers);

            _frameLayers["frame"].show();
            dojo.byId("thematicMapFrameLegend").style.display = '';
			_legendCount++;
            //legendCheckbox.disabled = false;
            //dojo.removeClass(legendCheckbox.labels[0], 'disabledLabel');

            dojo.byId("frame1Checkbox").checked = true;
            //dojo.byId("frame2Checkbox").checked = true;
            dojo.byId("frame3Checkbox").checked = true;
            dojo.byId("frame4Checkbox").checked = true;
            break;
        case 'frameTool':
            if (_frameLayers["frame"].visible) {
                _frameLayers["frame"].hide();
                //_frameLayers["select"].hide();
                dojo.byId("thematicMapFrameLegend").style.display = 'none';
				_legendCount--;
                //legendCheckbox.disabled = true;
                //dojo.addClass(legendCheckbox.labels[0], 'disabledLabel');
            }
            else{
                _frameLayers["frame"].show();
                //_frameLayers["select"].show();
                dojo.byId("thematicMapFrameLegend").style.display = '';
				_legendCount++;
                //legendCheckbox.disabled = false;
                //dojo.removeClass(legendCheckbox.labels[0], 'disabledLabel');
            }

            _frameLayers["frame"].setVisibleLayers(_frameVisibleLayers);
            _frameLayers["select"].setVisibleLayers(_frameSelectedVisibleLayers);
            break;
        case 'frame1Tool':
            if (dojo.byId("frame1Checkbox").checked){
                _frameVisibleLayers = _frameVisibleLayers.concat(FRAME_LAYERS_GROUPED[0]);
                _frameSelectedVisibleLayers = _frameSelectedVisibleLayers.concat(FRAME_SELECTED_LAYERS_GROUPED[0]);
                dojo.byId("frameCheckbox").checked = true;
                _frameLayers["frame"].show();
                dojo.byId("thematicMapFrameLegend").style.display = '';
                //legendCheckbox.disabled = false;
                //dojo.removeClass(legendCheckbox.labels[0], 'disabledLabel');
            }else{
                _frameVisibleLayers.splice(_frameVisibleLayers.indexOf(FRAME_LAYERS_GROUPED[0][0]), FRAME_LAYERS_GROUPED[0].length);
                _frameSelectedVisibleLayers.splice(_frameSelectedVisibleLayers.indexOf(FRAME_SELECTED_LAYERS_GROUPED[0][0]), FRAME_SELECTED_LAYERS_GROUPED[0].length);
            }

            _frameLayers["frame"].setVisibleLayers(_frameVisibleLayers);
            _frameLayers["select"].setVisibleLayers(_frameSelectedVisibleLayers);
            break;
        case 'frame2Tool':
            if (dojo.byId("frame2Checkbox").checked){
                _frameVisibleLayers = _frameVisibleLayers.concat(FRAME_LAYERS_GROUPED[1]);
                _frameSelectedVisibleLayers = _frameSelectedVisibleLayers.concat(FRAME_SELECTED_LAYERS_GROUPED[1]);
                dojo.byId("frameCheckbox").checked = true;
                _frameLayers["frame"].show();
                dojo.byId("thematicMapFrameLegend").style.display = '';
                //legendCheckbox.disabled = false;
                //dojo.removeClass(legendCheckbox.labels[0], 'disabledLabel');
            }else{
                _frameVisibleLayers.splice(_frameVisibleLayers.indexOf(FRAME_LAYERS_GROUPED[1][0]), FRAME_LAYERS_GROUPED[1].length);
                _frameSelectedVisibleLayers.splice(_frameSelectedVisibleLayers.indexOf(FRAME_SELECTED_LAYERS_GROUPED[1][0]), FRAME_SELECTED_LAYERS_GROUPED[1].length);
            }

            _frameLayers["frame"].setVisibleLayers(_frameVisibleLayers);
            _frameLayers["select"].setVisibleLayers(_frameSelectedVisibleLayers);
            break;
        case 'frame3Tool':
            if (dojo.byId("frame3Checkbox").checked){
                _frameVisibleLayers = _frameVisibleLayers.concat(FRAME_LAYERS_GROUPED[2]);
                _frameSelectedVisibleLayers = _frameSelectedVisibleLayers.concat(FRAME_SELECTED_LAYERS_GROUPED[2]);
                dojo.byId("frameCheckbox").checked = true;
                _frameLayers["frame"].show();
                dojo.byId("thematicMapFrameLegend").style.display = '';
                //legendCheckbox.disabled = false;
                //dojo.removeClass(legendCheckbox.labels[0], 'disabledLabel');
            }else{
                _frameVisibleLayers.splice(_frameVisibleLayers.indexOf(FRAME_LAYERS_GROUPED[2][0]), FRAME_LAYERS_GROUPED[2].length);
                _frameSelectedVisibleLayers.splice(_frameSelectedVisibleLayers.indexOf(FRAME_SELECTED_LAYERS_GROUPED[2][0]), FRAME_SELECTED_LAYERS_GROUPED[2].length);
            }

            _frameLayers["frame"].setVisibleLayers(_frameVisibleLayers);
            _frameLayers["select"].setVisibleLayers(_frameSelectedVisibleLayers);
            break;
        case 'frame4Tool':
            if (dojo.byId("frame4Checkbox").checked){
                _frameVisibleLayers = _frameVisibleLayers.concat(FRAME_LAYERS_GROUPED[3]);
                _frameSelectedVisibleLayers = _frameSelectedVisibleLayers.concat(FRAME_SELECTED_LAYERS_GROUPED[3]);
                dojo.byId("frameCheckbox").checked = true;
                _frameLayers["frame"].show();
                dojo.byId("thematicMapFrameLegend").style.display = '';
                //legendCheckbox.disabled = false;
                //dojo.removeClass(legendCheckbox.labels[0], 'disabledLabel');
            }else{
                _frameVisibleLayers.splice(_frameVisibleLayers.indexOf(FRAME_LAYERS_GROUPED[3][0]), FRAME_LAYERS_GROUPED[3].length);
                _frameSelectedVisibleLayers.splice(_frameSelectedVisibleLayers.indexOf(FRAME_SELECTED_LAYERS_GROUPED[3][0]), FRAME_SELECTED_LAYERS_GROUPED[3].length);
            }

            _frameLayers["frame"].setVisibleLayers(_frameVisibleLayers);
            _frameLayers["select"].setVisibleLayers(_frameSelectedVisibleLayers);
            break;
		case 'rulerTool':
			_measureType = 1;
			changeMapCursor("mapCursorRuler");
            _selectedTool = toolId;
			break;
		case 'rulerAreaTool':
			_measureType = 2;
			changeMapCursor("mapCursorRuler");
            _selectedTool = toolId;
			break;
	}

	if (_legendCount > 0){
		legendCheckbox.disabled = false;
		dojo.removeClass(legendCheckbox.labels[0], 'disabledLabel');
	}
	else{
		//legendCheckbox.disabled = true;
		//dojo.addClass(legendCheckbox.labels[0], 'disabledLabel');
	}

	_map.graphics.clear();

	if (toolId.indexOf("infoTool") > -1){
		activateFileObjectsEditing();
	}
	else{
		deactivateFileObjectsEditing();
	}
}

function changeMapCursor(cursorClass) {
	if (dojo.hasClass("map_container", "mapCursorPan")) {
		dojo.removeClass("map_container", "mapCursorPan");
	}
	else if (dojo.hasClass("map_container", "mapCursorPanActive")) {
		dojo.removeClass("map_container", "mapCursorPanActive");
	}
	else if (dojo.hasClass("map_container", "mapCursorZoom")) {
		dojo.removeClass("map_container", "mapCursorZoom");
	}
	else if (dojo.hasClass("map_container", "mapCursorInfo")) {
		dojo.removeClass("map_container", "mapCursorInfo");
	}
	
	dojo.addClass("map_container", cursorClass);
}

function changeAnnoVisible()
{
    if (_mapLayers["anno"]){
        if (dojo.byId('annoCheckBox').checked){
            _mapLayers["anno"].show();
        }
        else{
            _mapLayers["anno"].hide();
        }
    }
}

function changeCsvObjectsVisible()
{
	if (dojo.byId('csvObjectsCheckBox').checked){
		_fileObjectsLayer["objects"].show();
	}
	else{
		_fileObjectsLayer["objects"].hide();
	}
}

function changeBasemapLayer(layers) {
    
	for(var i in _mapLayers) {
		if (_mapLayers.hasOwnProperty(i) && i != 'anno') {
			_mapLayers[i].hide();
		}
	}
	if (layers) {
		var layerArray = layers.split("|");

		for (var j = 0; j < layerArray.length; j++) {
			if(_mapLayers.hasOwnProperty(layerArray[j]))
				_mapLayers[layerArray[j]].show();
			
			if(layerArray[j] == 'osm'){
				_mapLayers["anno"].hide();
				dojo.byId('annoCheckBox').checked = false;
				dojo.byId('annoCheckBox').disabled = true;
			}
			else{
				dojo.byId('annoCheckBox').disabled = false;
			}
		}
	}
	getCopyrights(_map.extent);
}

//function showCoordinates(evt){
//	var mp = esri.geometry.webMercatorToGeographic(evt.mapPoint);
//	var X=mp.x,Y=mp.y;
//
//	var d,m,s;
//	X = Math.abs(X);
//	d=parseInt(X);
//	m=parseInt((X-d)*60.0);
//	s=parseInt(((X-d)*60.0-m)*60.0);
//
//	X=dojo.string.pad(d,3,' ',false)+'°';
//	X=X+dojo.string.pad(m,2,' ',false)+"'";
//	X=X+dojo.string.pad(s,3,' ',false)+"''";
//
//	Y = Math.abs(Y);
//	d=parseInt(Y);
//	m=parseInt((Y-d)*60.0);
//	s=parseInt(((Y-d)*60.0-m)*60.0);
//
//	Y=dojo.string.pad(d,3,' ',false)+'°';
//	Y=Y+dojo.string.pad(m,2,' ',false)+"'";
//	Y=Y+dojo.string.pad(s,3,' ',false)+"''";
//
//	dojo.byId("mapCoordinatesX").innerHTML = X;
//	dojo.byId("mapCoordinatesXT").innerHTML = (mp.x > 0)?('В.Д.'):('З.Д.');
//	dojo.byId("mapCoordinatesY").innerHTML = Y;
//	dojo.byId("mapCoordinatesYT").innerHTML = (mp.y > 0)?('С.Ш.'):('Ю.Ш.');
//}

function measureLength(geometry) {	
	_measureGraphicsLayer.clear();
	
	var graphic = new esri.Graphic(geometry);
	_measureGraphicsLayer.add(graphic);
	
	var geometryService = esri.tasks.GeometryService(LAYERS_URL.geometryService);
	dojo.connect(geometryService, "onLengthsComplete", function(result){
		alert(dojo.number.format(result.lengths[0] / 1000) + " kilometers");
	});

	var lengthParams = new esri.tasks.LengthsParameters();
	lengthParams.polylines = [graphic];
	lengthParams.lengthUnit = esri.tasks.GeometryService.UNIT_METER;
	lengthParams.geodesic = true;
	geometryService.lengths(lengthParams);

	toolbarButtonMouseDown("panTool");	
	toolButtonClick("panTool");
}


function printMap() {    
	window.open('print.html' + getLink());
}

function setLinkText() {
	var index = window.location.href.indexOf('?');
	var href;
	if (index != -1)
		href = window.location.href.substring(0, index);
	else
		href = window.location.href;
	
	var linkTextBox = dojo.byId('linkTextbox');
	
	linkTextBox.value = href.replace('#','') + getLink();
	linkTextBox.select(); 
}

function getLink() {
	var href = '?l=' + _map.getLevel() + '&x=' + _map.extent.getCenter().x + '&y=' + _map.extent.getCenter().y;

	var visibleMapLayersId = '';
	for (i in _mapLayers) {
		if (_mapLayers[i].visible) {
			visibleMapLayersId += '|' + i;
		}
	}

	var visibleCadastreLayerId = '';
	if (_cadastreLayers['cadastre'] && _cadastreLayers['cadastre'].visible){
		visibleCadastreLayerId = 'cadastre';
	}

	href += '&mls=' + visibleMapLayersId.substring(1) + '&cls=' + visibleCadastreLayerId;

	if(_selectedObject && _selectedObject.objectType!==PortalObjectTypes.addressLocator){		
		//href += '&ot='+_selectedObject.objectType + '&oid='+_selectedObject.object.attributes[FIELDS.objectId];
		href += '&cn=' + _selectedObject.object.attributes[FIELDS.cadastreNumber];
	}
	
	return href;
}

function numberFormat(_number, _cfg) {

	function obj_merge(obj_first, obj_second) {
		var obj_return = {};
		for (key in obj_first) {
			if (typeof obj_second[key] !== 'undefined') obj_return[key] = obj_second[key];
			else obj_return[key] = obj_first[key];
		}
		return obj_return;
	}

	function thousands_sep(_num, _sep) {
		if (_num.length <= 3) return _num;
		var _count = _num.length;
		var _num_parser = '';
		var _count_digits = 0;
		for (var _p = (_count - 1); _p >= 0; _p--) {
			var _num_digit = _num.substr(_p, 1);
			if (_count_digits % 3 == 0 && _count_digits != 0 && !isNaN(parseFloat(_num_digit))) _num_parser = _sep + _num_parser;
			_num_parser = _num_digit + _num_parser;
			_count_digits++;
		}
		return _num_parser;
	}

	if (typeof _number !== 'number') {
		_number = parseFloat(_number);
		if (isNaN(_number)) return NO_DATA;
	}

	var _cfg_default = { before: '', after: '', decimals: 2, dec_point: '.', thousands_sep: ',' };
	if (_cfg && typeof _cfg === 'object') {
		_cfg = obj_merge(_cfg_default, _cfg);
	}
	else _cfg = _cfg_default;
	_number = _number.toFixed(_cfg.decimals);
	if (_number.indexOf('.') != -1) {
		var _number_arr = _number.split('.');
		var _number = thousands_sep(_number_arr[0], _cfg.thousands_sep) + _cfg.dec_point + _number_arr[1];
	}
	else var _number = thousands_sep(_number, _cfg.thousands_sep);

	return _cfg.before + _number + _cfg.after;
}

function localize(){
	if(esri.nls.jsapi.ru && esri.nls.jsapi.ru.widgets)
		esri.nls.jsapi.ru.widgets.overviewMap = {"NLS_invalidSR":"Система координат неправильная",
												 "NLS_invalidType":"Тип слоя не поддерживается",
												 "NLS_noMap":"Карта не указана",
												 "NLS_hide":"Скрыть обзорную карту",
												 "NLS_drag":"Перетащите чтобы подвинуть карту",
												 "NLS_maximize":"Развернуть",
												 "NLS_noLayer":"Основная карта не имеет базовых слоев",
												 "NLS_restore":"Восстановить",
												 "NLS_show":"Открыть обзорную карту"};
}

function bufferTextBoxKeyValidate(s, e) {
    var event = e || window.event;

    var key = event.keyCode || event.which;
    key = String.fromCharCode(key);

    var regex = /[0-9]/;

    if(!regex.test(key) ) {
        event.returnValue = false;
        if(event.preventDefault){
            event.preventDefault();
        }
    }
    else if (parseInt(s.value*1 + key) > 1000001){
        event.returnValue = false;
        if(event.preventDefault){
            event.preventDefault();
        }

    }
}