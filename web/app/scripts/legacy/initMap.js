var _loadingLayers = {};

function createCadastreLayer() {
  var cadastreLayer = new dataplus.CachedDynamycLayer(LAYERS_URL.cadastre, {
    tileInfo: {
      width: 1024,
      height: 1024
    },
    tileServers: LAYERS_URL.cadastre_abc
  });

  return cadastreLayer;
}

function initMainLayer(onComplete) {
  var cadastreLayer = createCadastreLayer();
  if (onComplete)
    onComplete(cadastreLayer);
  //var cadastreLayer = new esri.layers.ArcGISDynamicMapServiceLayer(LAYERS_URL.cadastre);
  //cadastreLayer.setImageFormat("png32");
  //cadastreLayer.hide();

  /*dojo.connect(cadastreLayer, "onLoad", function(){
		if (onComplete) 
			onComplete(cadastreLayer);
	});*/
}

function translateScalebar() {
  if (esri.dijit.Scalebar) {
    esri.dijit.Scalebar.prototype._drawScaleBarOld = esri.dijit.Scalebar.prototype._drawScaleBar;
    esri.dijit.Scalebar.prototype._drawScaleBar = function(a, b, c) {
      var c1 = ((c == 'km') ? ('км') : ('м'));
      this._drawScaleBarOld(a, b, c1);
    }
  }
}


function initMapAndLayers(mainLayer) {
  var initExtent = null;

  esriConfig.defaults.io.proxyUrl = PROXY;
  esriConfig.defaults.io.alwaysUseProxy = false;
  esriConfig.defaults.io.corsEnabledServers.push("nsdi.ru");

  initExtent = new esri.geometry.Extent(3320427.1661233706, 8343996.825709338, 3322686.835772111, 8344952.288562928,
    new esri.SpatialReference({
      "wkid": 102113
    }));

  translateScalebar();

  _map = new esri.Map("map", {
    extent: initExtent,
    logo: false,
    wrapAround180: true,
    fitExtent: true
  });

  dojo.connect(_map, "onLoad", function() {
    setExtentByUrl(location.search);
  });



  if (typeof(addLoadingHandler) !== 'undefined')
    addLoadingHandler();

  initLocalStorage();

  _mapLayers = [];

  _mapLayers["map"] = esri.layers.ArcGISTiledMapServiceLayer(LAYERS_URL.map, {
    tileServers: [LAYERS_URL.map_a, LAYERS_URL.map_b, LAYERS_URL.map_c]
  });
  _mapLayers["map"].hide();
  _map.addLayer(_mapLayers["map"]);

  /*_mapLayers["ortofoto"] = new esri.layers.ArcGISTiledMapServiceLayer(LAYERS_URL.image);
	_mapLayers["ortofoto"].hide();
	_map.addLayer(_mapLayers["ortofoto"]);*/

  _mapLayers["arcgisonline"] = new esri.layers.ArcGISTiledMapServiceLayer(LAYERS_URL.arcgisonline);
  _mapLayers["arcgisonline"].hide();
  _map.addLayer(_mapLayers["arcgisonline"]);

  _mapLayers["kosmos"] = new KosmosnimkiLayer();
  _mapLayers["kosmos"].hide();
  _map.addLayer(_mapLayers["kosmos"]);

  _cadastreLayers = [];
  _zouitLayers = [];
  _terrZoneLayers = [];
  _atdLayers = [];
  _frameLayers = [];
  _addressLayers = [];
  _fileObjectsLayer = [];

  _addressLayers["select"] = new esri.layers.ArcGISDynamicMapServiceLayer(LAYERS_URL.addressSelect, {
    opacity: 0.45
  });
  _addressLayers["select"].setImageFormat("png32");
  _addressLayers["select"].hide();
  _map.addLayer(_addressLayers["select"]);

  _cadastreLayers["thematicsMap"] = new esri.layers.ArcGISDynamicMapServiceLayer(LAYERS_URL.thematicsMap);
  _cadastreLayers["thematicsMap"].setImageFormat("png32");
  _cadastreLayers["thematicsMap"].setOpacity(1.0);
  _cadastreLayers["thematicsMap"].hide();
  _map.addLayer(_cadastreLayers["thematicsMap"]);

  //----------------------------------------------------------------------------------------------------------
  _terrZoneLayers["terrZone"] = new esri.layers.ArcGISDynamicMapServiceLayer(LAYERS_URL.terrZone);
  _terrZoneLayers["terrZone"].setImageFormat("png32");
  _terrZoneLayers["terrZone"].hide();
  _map.addLayer(_terrZoneLayers["terrZone"]);

  _terrZoneLayers["select"] = new esri.layers.ArcGISDynamicMapServiceLayer(LAYERS_URL.terrZoneSelect, {
    opacity: 0.45
  });
  _terrZoneLayers["select"].setImageFormat("png32");
  _terrZoneLayers["select"].hide();
  _map.addLayer(_terrZoneLayers["select"]);

  _zouitLayers["zouit"] = new esri.layers.ArcGISDynamicMapServiceLayer(LAYERS_URL.zouit);
  _zouitLayers["zouit"].setImageFormat("png32");
  _zouitLayers["zouit"].hide();
  _map.addLayer(_zouitLayers["zouit"]);

  _zouitLayers["select"] = new esri.layers.ArcGISDynamicMapServiceLayer(LAYERS_URL.zouitSelect, {
    opacity: 0.45
  });
  _zouitLayers["select"].setImageFormat("png32");
  _zouitLayers["select"].hide();
  _map.addLayer(_zouitLayers["select"]);

  _atdLayers["atd"] = new esri.layers.ArcGISDynamicMapServiceLayer(LAYERS_URL.atd);
  _atdLayers["atd"].setImageFormat("png32");
  _atdLayers["atd"].hide();
  _map.addLayer(_atdLayers["atd"]);

  _atdLayers["select"] = new esri.layers.ArcGISDynamicMapServiceLayer(LAYERS_URL.atdSelect, {
    opacity: 0.45
  });
  _atdLayers["select"].setImageFormat("png32");
  _atdLayers["select"].hide();
  _map.addLayer(_atdLayers["select"]);

  _frameLayers["frame"] = new esri.layers.ArcGISDynamicMapServiceLayer(LAYERS_URL.frame);
  _frameLayers["frame"].setImageFormat("png32");
  _frameLayers["frame"].hide();
  _map.addLayer(_frameLayers["frame"]);

  _frameLayers["select"] = new esri.layers.ArcGISDynamicMapServiceLayer(LAYERS_URL.frameSelect, {
    opacity: 0.45
  });
  _frameLayers["select"].setImageFormat("png32");
  _frameLayers["select"].hide();
  _map.addLayer(_frameLayers["select"]);
  //----------------------------------------------------------------------------------------------------------

  if (mainLayer)
    _cadastreLayers["cadastre"] = mainLayer;
  else {
    _cadastreLayers["cadastre"] = createCadastreLayer();
    /*_cadastreLayers["cadastre"] = new esri.layers.ArcGISDynamicMapServiceLayer(LAYERS_URL.cadastre);
		_cadastreLayers["cadastre"].setImageFormat("png32");*/
  }
  _map.addLayer(_cadastreLayers["cadastre"]);

  _cadastreLayers["select"] = new esri.layers.ArcGISDynamicMapServiceLayer(LAYERS_URL.cadastreSelect, {
    // opacity: 0.45
    opacity: 0.65
  });
  _cadastreLayers["select"].setImageFormat("png32");
  _cadastreLayers["select"].hide();
  _map.addLayer(_cadastreLayers["select"]);

  _mapLayers["anno"] = new esri.layers.ArcGISTiledMapServiceLayer(LAYERS_URL.annotation, {
    tileServers: [LAYERS_URL.annotation_a, LAYERS_URL.annotation_b, LAYERS_URL.annotation_c]
  });
  _mapLayers["anno"].hide();
  _map.addLayer(_mapLayers["anno"]);

  _fileObjectsLayer["objects"] = new esri.layers.GraphicsLayer();
  _map.addLayer(_fileObjectsLayer["objects"]);

  _fileObjectsLayer["movers"] = new esri.layers.GraphicsLayer();
  _map.addLayer(_fileObjectsLayer["movers"]);
}

function setExtentByUrl(url, forPrint) {
  //url = location.search.substring(1);
  if (url.length > 0)
    url = url.substring(1);

  var parametr = url.split("&");

  var values = new Array();
  for (i in parametr) {
    var j = parametr[i].split("=");
    values[j[0]] = unescape(j[1]);
  }



  var initMapLayers = function() {
    if (values["mls"] != null) {
      var layersArray = values["mls"].split('|');
      for (i in _mapLayers) {
        if (contains(layersArray, i)) {
          _mapLayers[i].show();
        } else {
          _mapLayers[i].hide();
        }
      }
    } else {
      _mapLayers["map"].show();
      _mapLayers["anno"].show();
    }
  };

  var extentChangeConnection = dojo.connect(_map, "onExtentChange", function() {
    dojo.disconnect(extentChangeConnection);
    initMapLayers();
  });

  if (values["x"] != null && values["y"] != null) {
    var center = new esri.geometry.Point(parseFloat(values["x"]), parseFloat(values["y"]), new esri.SpatialReference({
      "wkid": 102113
    }));

    if (values["l"] != null)
      _map.centerAndZoom(center, parseInt(values["l"]));
    else
      _map.centerAt(center);
  } else {
    initMapLayers();
  }



  if (values["cls"] != null) {
    var layersArray = values["cls"].split('|');
    for (i in _cadastreLayers) {
      if (contains(layersArray, i))
        _cadastreLayers[i].show();
      else
        _cadastreLayers[i].hide();
    }
  }

  if (!forPrint && values["cn"]) {
    var searchedText = values["cn"];
    var cadastreType = getCadastreObjectType(searchedText);
    var cadastreNumber = normalizeCadastreNumber(searchedText);

    if (cadastreType == PortalObjectTypes.parcel) {
      searchParcelObject(cadastreType, {
        cadNumber: searchedText,
        onlyAttributes: false
      });
    } else {
      cadastreNumber = normalizeSearchCadastreNumber(searchedText);
      searchObject(cadastreType, getIdField(cadastreType) + " like '" + cadastreNumber + "%'");
    }
  }



}

function contains(items, item) {
  for (var i = 0; i < items.length; i++) {
    if (items[i] == item) {
      return true;
    }
  }
  return false;
}