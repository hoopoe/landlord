function resizeResultList() {
    var paginationControl = dojo.byId("resultListPages");
    var paginationHeight = paginationControl ? dojo.marginBox(paginationControl).h : 0;
    var newHeight = dojo.byId("sidebarDiv").clientHeight -
                  dojo.query(".searchConditionContainer")[0].clientHeight
                  - 48
                  - paginationHeight
				  - 152;//
	if (newHeight > -1){
		var resultList = dojo.query(".resultList")[0];
		dojo.style(resultList, ({ height: newHeight + "px"}));
	}
}

function bodyLoad() {
    if (dojo.isIE) {
        resizeSidebar();
    }
}

function resizeSidebar() {
    var newHeight = dojo.byId("mapContainerDiv").clientHeight + 41 + "px";

    dojo.style(dojo.byId("sidebarDiv"),
		{
		    height: newHeight
		});

	dojo.style(dojo.byId('sidebarSwitcherDiv'),
		{
		    height: newHeight
		});
}

function resizeMap() {
    if (_map != null) {
        var mapContainer = dojo.byId("mapContainerDiv");
        var mapDiv = dojo.byId("map");

        dojo.style(mapDiv,
		{
		    width: mapContainer.clientWidth - 2 + "px", //-2 - �����
		    height: mapContainer.clientHeight - 2 + "px"
		});

        _map.resize();
        _map.reposition();
    }
}

function bodyResize() {
    
    if (dojo.isIE) {
        resizeSidebar();
    }

    if (dojo.query(".resultListContainerClose .resultList").length == 0) {
        resizeResultList();
    }
	
	resizeMap();
}

function switcherClick() {
    if (dojo.hasClass('switcherButton', 'switcherButtonOpenSate')) {
        dojo.removeClass('switcherButton', 'switcherButtonOpenSate');
        dojo.addClass('switcherButton', 'switcherButtonCloseSate');
        dojo.removeClass('sidebarDiv', 'sidebarOpenState');
        dojo.addClass('sidebarDiv', 'sidebarCloseState');
        dojo.removeClass('contentDiv', 'contentOpenState'); 
        dojo.addClass('contentDiv', 'contentCloseState'); 
		
		__eventGui(ACTIONS.SidebarHide);
    }
    else {
        dojo.removeClass('switcherButton', 'switcherButtonCloseSate');
        dojo.addClass('switcherButton', 'switcherButtonOpenSate');
        dojo.removeClass('sidebarDiv', 'sidebarCloseState');
        dojo.addClass('sidebarDiv', 'sidebarOpenState');
        dojo.removeClass('contentDiv', 'contentCloseState'); 
        dojo.addClass('contentDiv', 'contentOpenState'); 
		__eventGui(ACTIONS.SidebarShow);
    }

    bodyResize();
}

var _isSearchExPanelParse = false;

function searchExClick() {
    if (dojo.hasClass("searchExPanel", "searchExPanelCloseState")) {
        dojo.removeClass("searchExPanel", "searchExPanelCloseState");
        dojo.addClass("searchExPanel", "searchExPanelOpenState");
        dojo.byId('searchExRightTriangleImage').style.display = 'none';
        dojo.byId('searchExDownTriangleImage').style.display = '';
        dojo.byId('searchTextbox').disabled = true;
		__eventGui(ACTIONS.ShowExPanel); 
    }
    else  if (dojo.hasClass("searchExPanel", "searchExPanelOpenState")) {
        dojo.removeClass("searchExPanel", "searchExPanelOpenState");
        dojo.addClass("searchExPanel", "searchExPanelCloseState");
        dojo.byId('searchExDownTriangleImage').style.display = 'none';
        dojo.byId('searchExRightTriangleImage').style.display = '';
        dojo.byId('searchTextbox').disabled = false;
    }    

    if (!_isSearchExPanelParse) {
        dojo.parser.parse(dojo.byId('searchExPanel'));
        initializeSearchComboboxes();
        _isSearchExPanelParse = true;
    }

    resizeResultList();
}

function subjectListButtonClick() {
    if (dojo.hasClass("subjectList", "subjectListCloseState")) {
        dojo.removeClass("subjectList", "subjectListCloseState");
        dojo.addClass("subjectList", "subjectListOpenState");
    }
    else if (dojo.hasClass("subjectList", "subjectListOpenState")) {
        dojo.removeClass("subjectList", "subjectListOpenState");
        dojo.addClass("subjectList", "subjectListCloseState");
    }
}

function basemapListClickHandler(event){
    var e = event||window.event;

    if(e.cancelBubble){
        e.cancelBubble = true;
    }else{
        e.stopPropagation();
    }
}

function documentMouseClickHideBasemap(event) {
    var target = 'target';

    if (!event) {
        target = 'srcElement';
        event = window.event;
    }

    var div = dojo.byId('basemapToolListDiv');
    if (event[target].parentNode.id != 'basemapTool' && div.style.display == '') {
        toolbarButtonMouseUp('basemapTool');
        toolButtonClick('basemapTool');
    }
}

function changeBasemapListVisible() {
    var basemapToolList = dojo.byId('basemapToolListDiv');
    if (basemapToolList.style.display == 'none') {
        basemapToolList.style.display = '';

        if (dojo.byId('linkToolTextboxDiv').style.display != 'none') {
            toolbarButtonMouseUp('linkTool');
            toolButtonClick('linkTool');
        }

        document.onclick = documentMouseClickHideBasemap;
    }
    else {
        basemapToolList.style.display = 'none';
    }	
}

function documentMouseClickHideThematicmap(event) {
    var target = 'target';

    if (!event) {
        target = 'srcElement';
        event = window.event;
    }

    var div = dojo.byId('thematicsMapToolDiv');
    if (event[target].parentNode.id != 'thematicsMapTool' &&
        event[target].id != 'thematicsMapToolDiv' &&
        event[target].parentNode.id != 'thematicsMapToolDiv' &&
        event[target].parentNode.parentNode.id != 'thematicsMapToolDiv' &&
        event[target].id != div.id && div.style.display == '') {

        toolbarButtonMouseUp('thematicsMapTool');
        toolButtonClick('thematicsMapTool');
    }
}

function legendCheckboxClick(s){
	dojo.byId('thematicMapLegend').style.display = (s.checked)?(''):('none');
	__eventGui(ACTIONS.LegendShowHide, '');
}

function documentMouseClickHideLink(event) {
    var target = 'target';

    if (!event) {
        target = 'srcElement';
        event = window.event;
    }

    var div = dojo.byId('linkToolTextboxDiv');
    if (event[target].parentNode.id != 'linkTool' &&
        event[target].id != 'linkToolTextboxDiv' &&
        event[target].parentNode.id != 'linkToolTextboxDiv' &&
        event[target].parentNode.parentNode.id != 'linkToolTextboxDiv' &&
        event[target].id != div.id && div.style.display == '') {

        toolbarButtonMouseUp('linkTool');
        toolButtonClick('linkTool');        
    }
}

function changeLinkTextboxVisible() {
    var linkToolTextboxContainer = dojo.byId('linkToolTextboxDiv');
    if (linkToolTextboxContainer.style.display == 'none') {
        linkToolTextboxContainer.style.display = '';

        if (dojo.byId('basemapToolListDiv').style.display != 'none') {
            toolbarButtonMouseUp('basemapTool');
            toolButtonClick('basemapTool');
        }		

        document.onclick = documentMouseClickHideLink;
    }
    else {
        linkToolTextboxContainer.style.display = 'none';
    }
}

/* Thematic map disabled (begin) */
function changeThematicsMapsDisabled(level){	
	for (var i = 0, l = TM_LEVELS.length; i < l; i++){
		var tm = dojo.byId(TM_LEVELS[i].id);

		if (tm != null){			
			tm.disabled = level < TM_LEVELS[i].startLevel || level > TM_LEVELS[i].endLevel;

			if (!tm.labels){
				tm.labels = dojo.query("label[for=\"" + tm.id + "\"]");
			}

            if (tm.disabled){
                dojo.addClass( tm.labels[0], 'disabledLabel');
            }
            else{
                dojo.removeClass( tm.labels[0],'disabledLabel');
            }
			//if (tm.checked && tm.disabled)
			//	dojo.byId('thematicMapNone').checked = true;
		}
	}	
}
/* Thematic map disabled (end) */

/* Ruler and ruler area tool (begin) */
function changeRulerTextboxVisible(visible) {
	dojo.byId('rulerToolTextboxDiv').style.display = (visible)?(''):('none');
}

function changeRulerAreaTextboxVisible(visible) {
	dojo.byId('rulerAreaToolTextboxDiv').style.display = (visible)?(''):('none');
}
/* Ruler and ruler area tool (end) */

/*Info tools (begin)*/
function changeInfoBufferTextboxVisible(visible) {
	dojo.byId('infoBufferTextboxDiv').style.display = (visible)?(''):('none');
}
/*Info tools (end)*/

function prepareForIOS(){
	var node = dojo.byId('zoomTool');
	if (node && node.parentNode) {
		node.parentNode.removeChild(node);
	}
}

function addLoadingHandler(){
	_map.isLoad = isLoad;
	dojo.connect(_map, "onLayerAdd", function(layer) {
		layer.__onVisibilityChangeLoading = dojo.connect(layer, "onVisibilityChange", function(visibility){ addVisibilityHandler(this, visibility); }, layer);	
		addVisibilityHandler(layer,layer.visible);
	});
	dojo.connect(_map, "onLayerRemove", function(layer) {
		if(layer.__onVisibilityChangeLoading){
			dojo.disconnect(layer,layer.__onVisibilityChangeLoading);
			layer.__onVisibilityChangeLoading = null;
		}
		_loadingLayers[layer.id] = false;
	});
}

function addVisibilityHandler(layer,visibility){
	if(visibility){
		if(!layer.__onUpdateEndLoading)
			layer.__onUpdateEndLoading = dojo.connect(layer, "onUpdateEnd", function(error){
				_map.isLoad(false, this);
			}, layer);
		if(!layer.__onUpdateStartLoading)
			layer.__onUpdateStartLoading = dojo.connect(layer, "onUpdateStart", function(){
				_map.isLoad(true, this);
			}, layer);
	} else {
		if(layer.__onUpdateEndLoading){
			dojo.disconnect(layer, layer.__onUpdateEndLoading);
			layer.__onUpdateEndLoading = null;
		}
		if(layer.__onUpdateStartLoading){
			dojo.disconnect(layer, layer.__onUpdateStartLoading);
			layer.__onUpdateStartLoading = null;
		}
		
		_loadingLayers[layer.id] = false;
	}
}

function isLoad(loading, layer){
	var mapLoading = false;
	
	if(layer){
		_loadingLayers[layer.id] = loading;
			
		for(var i in _loadingLayers){		
			if(mapLoading = _loadingLayers[i])
				break;
		}
	} else {
		mapLoading = true;
	}
	
	if(mapLoading)
		dojo.style('mapLoader',{ display:"" }); 
	else
		dojo.style('mapLoader',{ display:"none" });
}