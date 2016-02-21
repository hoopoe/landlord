dojo.declare("KosmosnimkiLayer", esri.layers.TiledMapServiceLayer, {
	constructor: function () {
		this.spatialReference = new esri.SpatialReference({
			"wkid": 3857
		});

		//layer provides tile info
		this.tileInfo = new esri.layers.TileInfo({
			"width": 256,
			"height": 256,
			"dpi": 96,
			"format": "PNG8",
			"compressionQuality": 0,
			"origin": {
				"x": -20037508.342787,
				"y": 20037508.342787
			},
			"spatialReference": {
				"wkid": 102113
			},
			"lods": [{
				"level": 0,
				"scale": 591657527.591555,
				"resolution": 156543.033928
			}, {
				"level": 1,
				"scale": 295828763.795777,
				"resolution": 78271.5169639999
			}, {
				"level": 2,
				"scale": 147914381.897889,
				"resolution": 39135.7584820001
			}, {
				"level": 3,
				"scale": 73957190.948944,
				"resolution": 19567.8792409999
			}, {
				"level": 4,
				"scale": 36978595.474472,
				"resolution": 9783.93962049996
			}, {
				"level": 5,
				"scale": 18489297.737236,
				"resolution": 4891.96981024998
			}, {
				"level": 6,
				"scale": 9244648.868618,
				"resolution": 2445.98490512499
			}, {
				"level": 7,
				"scale": 4622324.434309,
				"resolution": 1222.99245256249
			}, {
				"level": 8,
				"scale": 2311162.217155,
				"resolution": 611.49622628138
			}, {
				"level": 9,
				"scale": 1155581.108577,
				"resolution": 305.748113140558
			}, {
				"level": 10,
				"scale": 577790.554289,
				"resolution": 152.874056570411
			}, {
				"level": 11,
				"scale": 288895.277144,
				"resolution": 76.4370282850732
			}, {
				"level": 12,
				"scale": 144447.638572,
				"resolution": 38.2185141425366
			}, {
				"level": 13,
				"scale": 72223.819286,
				"resolution": 19.1092570712683
			}, {
				"level": 14,
				"scale": 36111.909643,
				"resolution": 9.55462853563415
			}, {
				"level": 15,
				"scale": 18055.954822,
				"resolution": 4.77731426794937
			}, {
				"level": 16,
				"scale": 9027.977411,
				"resolution": 2.38865713397468
			}, {
				"level": 17,
				"scale": 4513.988705,
				"resolution": 1.19432856685505
			}]
		});

		//layer provides initial extent & full extent.
		this.fullExtent = new esri.geometry.Extent({
			"xmin": -20037508.34,
			"ymin": -20037508.34,
			"xmax": 20037508.34,
			"ymax": 20037508.34,
			"spatialReference": {
				"wkid": 102113
			}
		});

		this.initialExtent = new esri.geometry.Extent({
			"xmin": -35222182.633799955,
			"ymin": -19567879.240999974,
			"xmax": 35222182.633799955,
			"ymax": 19567879.240999974,
			"spatialReference": {
				"wkid": 102113
			}
		});

        this.urlTemplate = 'http://maps.kosmosnimki.ru/TileService.ashx?Request=gettile&LayerName=04C9E7CE82C34172910ACDBF8F1DF49A&apikey=${api_key}&crs=epsg:3857&z=${z}&x=${x}&y=${y}';

		//set layer loaded property and fire onLoad event
		this.loaded = true;
		this.onLoad(this);
	},

	getTileUrl: function(level, row, col) {


        return dojo.string.substitute(this.urlTemplate, {
            api_key: '7BDJ6RRTHH',
            z: level,
            y: row,
            x: col
        });
	}
});

