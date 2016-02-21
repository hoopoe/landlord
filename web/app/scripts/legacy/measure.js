dojo.require("esri.toolbars.edit");
dojo.require("esri.geometry");
dojo.require("esri.geometry.utils");


dojo.declare("dataplus.toolbars.Measure", esri.toolbars._Toolbar, {
	/*constants (begin)*/
	STRICT_OPTIONS: {
		allowDeleteVertices: false,//disable right mouse button delete
		allowAddVertices: true
	},

	DEFAULT_OPTIONS: {
		lineSymbol: new esri.symbol.SimpleLineSymbol(
			esri.symbol.SimpleLineSymbol.STYLE_SOLID,
			new dojo.Color([54, 130, 246]),
			2
		),
		polygonSymbol: new esri.symbol.SimpleFillSymbol(
			esri.symbol.SimpleFillSymbol.STYLE_SOLID,
			new esri.symbol.SimpleLineSymbol(
				esri.symbol.SimpleLineSymbol.STYLE_SOLID,
				new dojo.Color([54, 130, 246]),
				2
			),
			new dojo.Color([0, 96, 255, 0.35])
		),
		vertexSymbol: new esri.symbol.PictureMarkerSymbol(
			"/portalonline/i/measure/vertex.png",
			20,
			20
		),
		ghostVertexSymbol: new esri.symbol.PictureMarkerSymbol(
			"/portalonline/i/measure/ghost_vertex.png",
			13,
			13
		),
		ghostLineSymbol: new esri.symbol.SimpleLineSymbol(
			esri.symbol.SimpleLineSymbol.STYLE_DOT,
			new dojo.Color([0, 96, 255]),
			2
		),
		vertexTooltipPanelShape: {
			height: 21,
			stroke: {
				color: new dojo.Color([0, 132, 255]),
				style: "Solid",
				width: 1,
				cap: "square",
				join: "round"
			},
			fill: new dojo.Color([255, 255, 255])
		},
		lastVertexLabelPanelShape: {
			height: 21,
			stroke: {
				color: new dojo.Color([0, 132, 255]),
				style: "Solid",
				width: 1,
				cap: "square",
				join: "round"
			},
			fill: new dojo.Color([255, 255, 255])
		},
		lastVertexLabelCloseButtonShape: {
			width: 9,
			height: 9,
			src: "/portalonline/i/measure/close.png"
		}
	},
	/*constants (end)*/

	/*private variables (begin)*/
	_map: null,
	_options: null,
	_measureType: null,

	_length: 0,
	_graphic: null,

	_editToolbar: null,
	_esriGeometry: null,
	_numberBeatifier: null,

	_measure: {
		length: {
			segments: null,
			total: null
		},
		area: {
			total: null
		}
	},

	_moverTooltip: {
		group: null,
		panel: null,
		text: null
	},
	_lastMoverLabel: {
		group: null,
		panel: null,
		button: null,
		text: null
	},

	/**handlers connections (begin)**/
	_onMapClickHandler_connection: null,
	_onExtentChangeHandler_connection: null,
	_onMoverDblClickHandler_connection: null,
	/**handler connections (end)**/
	/*private variables (end)*/

	/*private methods (begin)*/
	_clear: function () {
		this._disableVertexEditing();

		if (this._graphic) {
			this._map.graphics.remove(this._graphic, true);
		}

		this._graphic = null;
		this._length = 0;
	},

	_setGfxText: function(textbox, message){
		switch (dojox.gfx.renderer) {
			case "svg":
				textbox.getEventSource().textContent = message;
				break;
			case "vml":
				textbox.rawNode.childNodes[1].string = message;
				break;
			default:
				throw new Error("Not supported renderer type: " + dojox.gfx.renderer);
		};
	},

	_showMoverTooltip: function (moverInfo) {
		var group = this._moverTooltip.group;

		if (group) {//if tooltip was created
			esri.show(group.getEventSource());

			var panel = this._moverTooltip.panel;
			var text = this._moverTooltip.text;

			this._setGfxText(
				text,
				(moverInfo.pointIndex + 1) + ") " +	this._numberBeatifier.makeMetricLengthBeauty(this._measure.length.segments[moverInfo.pointIndex - 1])
			);

			panel.setShape({
				width: text.getTextWidth() + (panel.shape.height - 10)
			});

			var moverShape = moverInfo.graphic._shape;

			group.setTransform(dojox.gfx.matrix.translate(moverShape.shape.x, moverShape.shape.y));
			dojo.place(group.getEventSource(), moverInfo.graphic._shape.getEventSource(), "before");
		}
	},

	_hideMoverTooltip: function () {
		if (this._moverTooltip.group) {
			esri.hide(this._moverTooltip.group.getEventSource());
		}
	},

	_destroyMoverTooltip: function () {
		if (this._moverTooltip.group) {
			this._moverTooltip.group.parent.remove(this._moverTooltip.group);
			this._moverTooltip.group = null;
		}
	},

	_refreshLastMoverLabel: function () {
		var group = this._lastMoverLabel.group;

		if (group) {//if label was created
			var panel = this._lastMoverLabel.panel;
			var text = this._lastMoverLabel.text;
			var button = this._lastMoverLabel.button;

			if (this._measure.area.total) {//this._measureType == dataplus.toolbars.Measure.AREA
				this._setGfxText(
					text,
					this._length + ") " + this._numberBeatifier.makeMetricAreaBeauty(this._measure.area.total)
				);
			} else {
				this._setGfxText(
					text,
					this._length + ") " + this._numberBeatifier.makeMetricLengthBeauty(this._measure.length.total)
				);
			}

			panel.setShape({
				width: text.getTextWidth() +
					button.shape.width +
					((panel.shape.height - button.shape.height) * 3 / 2)
			});

			button.setShape({
				x: panel.shape.width - Math.round((panel.shape.height - button.shape.height) / 2)
			});
		}
	},

	_showLastMoverLabel: function (moverInfo) {
		var group = this._lastMoverLabel.group;

		if (group) {//if label was created
			var moverShape = moverInfo.graphic._shape;

			if (moverShape) {
				this._refreshLastMoverLabel();

				group.setTransform(dojox.gfx.matrix.translate(moverShape.shape.x, moverShape.shape.y));
				dojo.place(group.getEventSource(), moverInfo.graphic._shape.getEventSource(), "before");

				esri.show(group.getEventSource());
			} else {
				this._destroyLastMoverLabel();
			}
		}
	},

	_destroyLastMoverLabel: function () {
		if (this._lastMoverLabel.group) {
			this._lastMoverLabel.group.parent.remove(this._lastMoverLabel.group);
			this._lastMoverLabel.group = null;
		}
	},

	_initEditToolbar: function () {
		var editToolbar = new esri.toolbars.Edit(this._map);
		editToolbar.onLastVertexRefresh = function () {};//create custom event

		dojo.connect(editToolbar, "onActivate", this, this._onEditToolbarActivateHandler);
		dojo.connect(editToolbar, "onDeactivate", this, this._onEditToolbarDeactivateHandler);

		dojo.connect(editToolbar, "onLastVertexRefresh", this, this._onLastMoverRefreshHandler);
		dojo.connect(editToolbar, "onVertexMouseOver", this, this._onMoverMouseOverHandler);
		dojo.connect(editToolbar, "onVertexMouseOut", this, this._onMoverMouseOutHandler);

		dojo.connect(editToolbar, "onVertexMoveStart", this, this._onMoverMouseDownHandler);

		dojo.connect(editToolbar, "onVertexAdd", this, this._onMoverAddHandler);

		return editToolbar;
	},

	_vertexEditorDeleteHandlerOverride: function (mover) {
		//"this" is "this._editToolbar._vertexEditor"
		var selectedMover = mover;//this._findMover(graphic);

		if (selectedMover) {
			var relatedGraphic = selectedMover.relatedGraphic;
			var relatedGeometry = relatedGraphic.geometry;
			var segIndex = selectedMover.segIndex;
			var ptIndex = selectedMover.ptIndex;

			relatedGeometry.removePoint(segIndex, ptIndex);

			if (this._canAdd) {
				this._deleteMidpoints(selectedMover);
			}

			this._deleteVertex(selectedMover);

			relatedGraphic.setGeometry(relatedGeometry);

			this.toolbar._endOperation("VERTICES");
		}
	},

	_enableVertexEditing: function () {
		if (this._graphic.geometry.type === "polygon") {
			this._graphic.geometry.type = "polyline";
			this._graphic.geometry.paths = this._graphic.geometry.rings;
		}

		this._editToolbar.activate(esri.toolbars.Edit.EDIT_VERTICES, this._graphic, this._options);

		this._editToolbar._vertexEditor._deleteHandler = this._vertexEditorDeleteHandlerOverride;
	},

	_refreshVertexEditing: function () {
		this._editToolbar.refresh();
	},

	_disableVertexEditing: function () {
		this._editToolbar.deactivate();
	},

	_fireLastVertexRefreshEvent: function () {
		var vertexMovers = this._editToolbar._vertexEditor._vertexMovers[0];

		this._editToolbar.onLastVertexRefresh(
			this._graphic,
			vertexMovers[vertexMovers.length - 1]._getInfo()
		);
	},

	_calculateSegmentLength: function (points) {
	   	var polylines = [];

		for (var i = 1, l = points.length; i < l; i++) {
			polylines.push({
				paths: [[
					points[i-1],
					points[i]
				]]
			});
		}

		return this._esriGeometry.geodesicLengths(polylines, esri.Units.METERS);
	},

	_makeMeasure: function (geometry) {
		var g = esri.geometry.webMercatorToGeographic(geometry);

		switch(this._measureType) {
			case dataplus.toolbars.Measure.LENGTH:
				this._measure.length.segments = this._calculateSegmentLength(g.paths[0]);
				this._measure.area.total = null;
				break;
			case dataplus.toolbars.Measure.AREA:
				this._measure.length.segments = this._calculateSegmentLength(g.rings[0]);
				if (g.rings[0].length > 2) {
					this._measure.area.total = Math.abs(esri.geometry.geodesicAreas([g], esri.Units.SQUARE_METERS)[0]);
				}
				else {
					this._measure.area.total = 0;
				}
				break;
		}

		var segments = this._measure.length.segments;
		var total = 0;
		dojo.forEach(segments, function (segment, i) {
			total += segment;
			segments[i] = total;
		});

		this._measure.length.total = total;
	},

	_redrawGraphics: function () {
		var g = this._graphic;

		if (g) {
			g.setGeometry(g.geometry);
		}
	},

	/**handlers (begin)**/
	_onMoverTooltipMouseOverHandler: function () {
		esri.show(this._moverTooltip.group.getEventSource());
	},

	_onMoverTooltipMouseOutHandler: function () {
		this._hideMoverTooltip();
	},

	_onMoverMouseOverHandler: function (graphic, moverInfo) {
		if (!moverInfo.isGhost && moverInfo.pointIndex > 0) {
			if (moverInfo.pointIndex != (this._editToolbar._vertexEditor._vertexMovers[0].length - 1)) {//last mover = total length
				if (this._moverTooltip.group == null) {
					var group = graphic._graphicsLayer._div.createGroup();
					var panelOptions = this._options.vertexTooltipPanelShape;

					var panel = group.createRect({
						x: this._options.vertexSymbol.width / 2,
						y: this._options.vertexSymbol.height / 2,
						width: 70,
						height: panelOptions.height
					});

					panel.setFill(this._options.vertexTooltipPanelShape.fill);
					panel.setStroke(this._options.vertexTooltipPanelShape.stroke);
					dojo.attr(panel.getEventSource(), "shape-rendering", "crispEdges");

					var text = group.createText({
						type: "text",
						x: (this._options.vertexSymbol.width / 2) + Math.round((panelOptions.height - 10)/2),
						y: (this._options.vertexSymbol.height / 2) + Math.round((panelOptions.height + 10)/2) - 1,
						align: "start"
					});
					text.setFont({
						family:"Arial",
						size:"10pt"
					});
					text.setFill("black");

					this._moverTooltip.group = group;
					this._moverTooltip.panel = panel;
					this._moverTooltip.text = text;

					var groupEventSource = group.getEventSource();

					dojo.connect(groupEventSource, "onmouseover", this, this._onMoverTooltipMouseOverHandler);
					dojo.connect(groupEventSource, "onmouseout", this, this._onMoverTooltipMouseOutHandler);
				}

				this._showMoverTooltip(moverInfo);
			}
		}
	},

	_onMoverMouseOutHandler: function () {
		this._hideMoverTooltip();
	},

	_onMoverMouseDownHandler: function (graphic, moverInfo) {
		this._hideMoverTooltip();
	},

	_onCloseButtonClickHandler: function (event) {
		event.stopPropagation();

		this._clear();
	},

	_onLastMoverRefreshHandler: function (graphic, moverInfo) {
		if (this._length > 1) {
			if (this._lastMoverLabel.group == null) {
				var group = graphic._graphicsLayer._div.createGroup();

				var panelOptions = this._options.lastVertexLabelPanelShape;
				var buttonOptions = this._options.lastVertexLabelCloseButtonShape;

				var panel = group.createRect({
					x: this._options.vertexSymbol.width / 2,
					y: this._options.vertexSymbol.height / 2,
					width: 100,
					height: panelOptions.height - 1
				});

				panel.setFill(this._options.lastVertexLabelPanelShape.fill);
				panel.setStroke(this._options.lastVertexLabelPanelShape.stroke);
				dojo.attr(panel.getEventSource(), "shape-rendering", "crispEdges");

				var text = group.createText({
					type: "text",
					x: (this._options.vertexSymbol.width / 2) + Math.round((panelOptions.height - buttonOptions.height)/2),
					y: (this._options.vertexSymbol.height / 2) + Math.round((panelOptions.height + 10)/2) - 1,
					align: "start"
				});
				text.setFont({
					family:"Arial",
					size:"10pt"
				});
				text.setFill("black");

				var button = group.createImage({
					type: "image",
					x: 100 - Math.round((panelOptions.height - buttonOptions.height)/2),
					y: (this._options.vertexSymbol.height / 2) + Math.round((panelOptions.height - buttonOptions.height)/2),
					width: buttonOptions.width,
					height: buttonOptions.height,
					src: buttonOptions.src
				});

				var buttonEventSource = button.getEventSource();

				dojo.style(buttonEventSource, "cursor", "pointer");
				dojo.connect(buttonEventSource, "onclick", this, this._onCloseButtonClickHandler);

				this._lastMoverLabel.group = group;
				this._lastMoverLabel.panel = panel;
				this._lastMoverLabel.button = button;
				this._lastMoverLabel.text = text;
			}

			this._showLastMoverLabel(moverInfo);
		}
		else {
			this._destroyLastMoverLabel();
		}
	},

	_onMoverAddHandler: function () {
		this._length++;
	},

	_onMoverDblClickHandler: function (event) {
		var mover = this._editToolbar._vertexEditor._findMover(event.graphic);

		if (!mover._placeholder) {
			if (this._length > 1) {
				this._length--;
				this._hideMoverTooltip();
				this._editToolbar._vertexEditor._deleteHandler(mover);
			}
			else {
				this._clear();
			}
		}
	},

	_onEditToolbarActivateHandler: function () {
		var moversLayer = this._editToolbar._vertexEditor._getGraphicsLayer();

		this._onMoverDblClickHandler_connection = dojo.connect(moversLayer, "onDblClick", this, this._onMoverDblClickHandler);
	},

	_onEditToolbarDeactivateHandler: function () {
		dojo.disconnect(this._onMoverDblClickHandler_connection);

		this._destroyMoverTooltip();
		this._destroyLastMoverLabel();
	},

	_onMapClickHandler: function (event) {
		var lineSymbol = this._options.lineSymbol;
		var polygonSymbol = this._options.polygonSymbol;

		var point = event.mapPoint.offset(0, 0);

		this._length++;

		if (this._length == 1) {
			var geometry = null;
			var symbol = null;

			switch(this._measureType) {
				case dataplus.toolbars.Measure.LENGTH:
					geometry = new esri.geometry.Polyline(this._map.spatialReference);
					geometry.addPath([point]);
					symbol = lineSymbol;
					break;
				case dataplus.toolbars.Measure.AREA:
					geometry = new esri.geometry.Polygon(this._map.spatialReference);
					geometry.addRing([point]);
					symbol = polygonSymbol;
					break;
			}

			this._graphic = this._map.graphics.add(new esri.Graphic(geometry, symbol), true);

			this._enableVertexEditing();

			dojo.connect(this._graphic, "setGeometry", this, function (geometry) {
				this._makeMeasure(geometry);
				this._fireLastVertexRefreshEvent();
			});
		}
		else {
			this._graphic.geometry._insertPoints([point], 0);

			this._refreshVertexEditing();//redraw movers
			this._graphic.setGeometry(this._graphic.geometry).setSymbol(this._graphic.symbol);//redraw graphics
		}
	},

	_onExtentChangeHandler: function (extent, delta, levelChange, lod) {
		if (levelChange || this._map.wrapAround180) {
			this._redrawGraphics();
		}
	},
	/**handlers (end)**/
	/*private methods (end)*/

	/*public variables (begin)*/
	lengthSymbol:null,
	areaSymbol: null,

	/**events (begin)**/
	onActivate: function () {},
	onDeactivate: function () {},
	/**events (end)**/
	/*public variables (end)*/

	/*constructor (begin)*/
	constructor: function (map, options) {
		this._map = map;

		this._options = dojo.mixin(
			dojo.mixin(
				this.DEFAULT_OPTIONS,
				options || {} //"options" is optionals
			),
			this.STRICT_OPTIONS
		);

		this._editToolbar = this._initEditToolbar();
		this._esriGeometry = esri.geometry;
		this._numberBeatifier = dataplus.toolbars.Measure.NumberBeautifier;
	},
	/*constructor (end)*/

	/*public methods (begin)*/
	activate: function (measureType) {
		if (this._measureType) {
			this.deactivate();
		}

		this._measureType = measureType;

		this._onMapClickHandler_connection = dojo.connect(this._map, "onClick", this, this._onMapClickHandler);
		this._onExtentChangeHandler_connection = dojo.connect(this._map, "onExtentChange", this, this._onExtentChangeHandler);

		this._map.disableDoubleClickZoom();

		this.onActivate(measureType);
	},

	deactivate: function () {
		this._clear();

		dojo.disconnect(this._onMapClickHandler_connection);
		dojo.disconnect(this._onExtentChangeHandler_connection);

		this._map.enableDoubleClickZoom();

		this.onDeactivate(this._measureType);
	}
	/*public methods (end)*/
});

dojo.mixin(dataplus.toolbars.Measure, {
	LENGTH: "length",
	AREA: "area"
});

dojo.mixin(dataplus.toolbars.Measure, {
	NumberBeautifier: {
		makeNumberBeauty: function (number) {
			number += "";
			x = number.split(".");
			x1 = x[0];
			x2 = x.length > 1 ? "." + x[1] : "";
			var rgx = /(\d+)(\d{3})/;
			while (rgx.test(x1)) {
				x1 = x1.replace(rgx, "$1" + ' ' + "$2");
			}
			return x1 + x2;
		},

		makeMetricLengthBeauty: function (length) {
			if (length < 1000)
				return Math.round(length) + " м";
			else if (length < 2000)
				return Math.round(length)/1000 + " км";
			else if (length < 7000)
				return Math.round(length/10)/100 + " км";
			else if (length < 50000)
				return Math.round(length/100)/10 + " км";
			else
				return this.makeNumberBeauty(Math.round(length/1000)) + " км";
		},

		makeMetricAreaBeauty: function (area) {
			if (area < 10000)
				return this.makeNumberBeauty(Math.round(area)) + " м²";
			else if (area < 50000)
				return this.makeNumberBeauty(Math.round(area)/10000) + " га";
			else if (area < 100000)
				return this.makeNumberBeauty(Math.round(area/10)/1000) + " га";
			else if (area < 500000)
				return this.makeNumberBeauty(Math.round(area/100)/100) + " га";
			else if (area < 700000)
				return this.makeNumberBeauty(Math.round(area/1000)/10) + " га";
			else if (area < 1000000)
				return this.makeNumberBeauty(Math.round(area/10000)) + " га";
			else if (area < 5000000)
				return this.makeNumberBeauty(Math.round(area/10000)/100) + " км²";
			else if (area < 50000000)
				return this.makeNumberBeauty(Math.round(area/100000)/10) + " км²";
			else
				return this.makeNumberBeauty(Math.round(area/1000000)) + " км²";
		}
	}
});