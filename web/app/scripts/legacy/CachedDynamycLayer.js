dojo.declare("dataplus.CachedDynamycLayer", esri.layers.TiledMapServiceLayer, {
            constructor: function (url, options) {
                options || (options = {});
                this.url = url;

                this.spatialReference = new esri.SpatialReference({
                    "wkid": 102100
                });

                //layer provides tile info
                this.tileInfo = new esri.layers.TileInfo({
                    "dpi": 96,
                    "format": "PNG32",
                    "compressionQuality": 0,
                    "origin": {
                        "x": -20037508.342787,
                        "y": 20037508.342787
                    },
                    "spatialReference": {
                        "wkid": 102100
                    },
                    "lods": [
                        {
                            "level": 0,
                            "resolution": 156543.03392800014,
                            "scale": 5.91657527591555E8
                        },
                        {
                            "level": 1,
                            "resolution": 78271.51696399994,
                            "scale": 2.95828763795777E8
                        },
                        {
                            "level": 2,
                            "resolution": 39135.75848200009,
                            "scale": 1.47914381897889E8
                        },
                        {
                            "level": 3,
                            "resolution": 19567.87924099992,
                            "scale": 7.3957190948944E7
                        },
                        {
                            "level": 4,
                            "resolution": 9783.93962049996,
                            "scale": 3.6978595474472E7
                        },
                        {
                            "level": 5,
                            "resolution": 4891.96981024998,
                            "scale": 1.8489297737236E7
                        },
                        {
                            "level": 6,
                            "resolution": 2445.98490512499,
                            "scale": 9244648.868618
                        },
                        {
                            "level": 7,
                            "resolution": 1222.992452562495,
                            "scale": 4622324.434309
                        },
                        {
                            "level": 8,
                            "resolution": 611.4962262813797,
                            "scale": 2311162.217155
                        },
                        {
                            "level": 9,
                            "resolution": 305.74811314055756,
                            "scale": 1155581.108577
                        },
                        {
                            "level": 10,
                            "resolution": 152.87405657041106,
                            "scale": 577790.554289
                        },
                        {
                            "level": 11,
                            "resolution": 76.43702828507324,
                            "scale": 288895.277144
                        },
                        {
                            "level": 12,
                            "resolution": 38.21851414253662,
                            "scale": 144447.638572
                        },
                        {
                            "level": 13,
                            "resolution": 19.10925707126831,
                            "scale": 72223.819286
                        },
                        {
                            "level": 14,
                            "resolution": 9.554628535634155,
                            "scale": 36111.909643
                        },
                        {
                            "level": 15,
                            "resolution": 4.77731426794937,
                            "scale": 18055.954822
                        },
                        {
                            "level": 16,
                            "resolution": 2.388657133974685,
                            "scale": 9027.977411
                        },
                        {
                            "level": 17,
                            "resolution": 1.1943285668550503,
                            "scale": 4513.988705
                        },
                        {
                            "level": 18,
                            "resolution": 0.5971642835598172,
                            "scale": 2256.994353
                        },
                        {
                            "level": 19,
                            "resolution": 0.29858214164761665,
                            "scale": 1128.497176
                        },
                        {
                            "level": 20,
                            "resolution": 0.14929107082380833,
                            "scale": 564.248588
                        }
                    ]
                });
                this.tileInfo.height = 256;
                this.tileInfo.width = 256;

                //layer provides initial extent & full extent.
                this.fullExtent = new esri.geometry.Extent({
                    "xmin": -20037507.0672,
                    "ymin": -30240971.9584,
                    "xmax": 20037507.067199998,
                    "ymax": 18418386,
                    "spatialReference": {
                        "wkid": 102100,
                        "latestWkid": 3857
                    }
                });

                this.initialExtent = new esri.geometry.Extent({
                    "xmin": -20037507.0672,
                    "ymin": 5039757.7651999965,
                    "xmax": 20037507.067199998,
                    "ymax": 16854341.5066,
                    "spatialReference": {
                        "wkid": 102100,
                        "latestWkid": 3857
                    }
                });

                if (options.tileInfo){
                    dojo.mixin(this.tileInfo, options.tileInfo);
                }

                if (options.tileServers && options.tileServers.length > 0){
                    this.tileServers = options.tileServers;
                }
                this.tsi = 0;

                this.loaded = true;
                this.onLoad(this);
            },

            calculateExtent: function (level, row, col){
                var xorigin = this.tileInfo.origin.x,
                    yorigin = this.tileInfo.origin.y
                    resolution = this.tileInfo.lods[level].resolution,
                    width = this.tileInfo.width,
                    height = this.tileInfo.height,
                    extent = {};

                extent.xmin = col*width*resolution + xorigin;
                extent.ymin = yorigin - (row+1)*height*resolution;
                extent.ymax = yorigin - row*height*resolution;
                extent.xmax = (col+1)*width*resolution + xorigin;
                extent.spatialReference = this.spatialReference;

                return new esri.geometry.Extent(extent);
            },



            getTileUrl: function(level, row, col) {
                var ts = this.tileServers,
                    url = ((ts ? ts[this.tsi++ % ts.length] : this._url.path)),
                    a = this.calculateExtent(level, row, col);
                    params = {};

                dojo.mixin(params, {
                    dpi: this.tileInfo.dpi,
                    format: this.tileInfo.format,
                    bbox : a.xmin + "," + a.ymin + "," + a.xmax + "," + a.ymax,
                    bboxSR : this.spatialReference.wkid,
                    imageSR : this.spatialReference.wkid,
                    size : this.tileInfo.height + "," + this.tileInfo.width,
                    transparent: true,
                    f: 'image'
                });

                return esri._getProxiedUrl(url + "/export?" + dojo.objectToQuery(params));
            }
        });



