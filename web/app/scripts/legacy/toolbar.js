var _toolbarButtons;
var _basemapItems;
var _selectionToolId;
var _selectionBasemapId;
var _brokenToolbarEvent;
var _toggleButtonMouseUp;

function toolbarConstructor() {
    var toolbarButtonContainer = document.getElementById("toolbarButtonContainer");
    _toolbarButtons = new Array();

    for (var i = 0; i < toolbarButtonContainer.childNodes.length; i++) {
        if (toolbarButtonContainer.childNodes[i].nodeName != null
        && toolbarButtonContainer.childNodes[i].nodeName == "LI"
        && toolbarButtonContainer.childNodes[i].id != "") {

            for (var j = 0; j < toolbarButtonContainer.childNodes[i].childNodes.length; j++) {
                if (toolbarButtonContainer.childNodes[i].childNodes[j].className != null
                    && toolbarButtonContainer.childNodes[i].childNodes[j].className == "toolbarButton") {
                    var toolbarButton = toolbarButtonContainer.childNodes[i].childNodes[j];
                    break;
                }

            }

            attachEvent(toolbarButton, "mousedown",
                eventHandlerContainer(toolbarButtonMouseDown, toolbarButtonContainer.childNodes[i].id));

            if ((!toolbarButtonContainer.childNodes[i].getAttribute("checked") ||
                toolbarButtonContainer.childNodes[i].getAttribute("checked") == "false") &&
                toolbarButtonContainer.childNodes[i].getAttribute("toggled") != "true") {
                attachEvent(toolbarButton, "mouseup", 
                    eventHandlerContainer(toolbarButtonMouseUp,toolbarButtonContainer.childNodes[i].id));
            }

            _toolbarButtons[toolbarButtonContainer.childNodes[i].id] = toolbarButtonContainer.childNodes[i];
            _toolbarButtons[toolbarButtonContainer.childNodes[i].id].childButton = toolbarButton;
            
            if (toolbarButtonContainer.childNodes[i].getAttribute("selected") == "true"
				&& toolbarButtonContainer.childNodes[i].getAttribute("groupname") == "selectionTool"){
                _selectionToolId = toolbarButtonContainer.childNodes[i].id;
            }

            if (!toolbarButtonContainer.childNodes[i].getAttribute("enabled") ||
                toolbarButtonContainer.childNodes[i].getAttribute("enabled") == "false"){
                brokeOnclickHandler(toolbarButtonContainer.childNodes[i]);
            }
        }
    }

    //var basemapItemContainer = document.getElementById("basemapList");
    //_basemapItems = new Array();
    //
    //for (var i = 0; i < basemapItemContainer.childNodes.length; i++) {
    //    if (basemapItemContainer.childNodes[i].nodeName != null
    //    && basemapItemContainer.childNodes[i].nodeName == "LI"
    //    && basemapItemContainer.childNodes[i].id != "") {
    //
    //        for (var j = 0; j < basemapItemContainer.childNodes[i].childNodes.length; j++) {
    //            if (basemapItemContainer.childNodes[i].childNodes[j].className != null
    //                && basemapItemContainer.childNodes[i].childNodes[j].className == "thumbnailContainer") {
    //                var thumbnail = basemapItemContainer.childNodes[i].childNodes[j];
    //                break;
    //            }
    //        }
    //
    //        attachEvent(thumbnail, "mousedown",
    //            eventHandlerContainer(basemapItemMouseDown, basemapItemContainer.childNodes[i].id));
    //
    //        _basemapItems[basemapItemContainer.childNodes[i].id] = basemapItemContainer.childNodes[i];
    //        _basemapItems[basemapItemContainer.childNodes[i].id].childButton = thumbnail;
    //        if (basemapItemContainer.childNodes[i].getAttribute("selected") == "true") {
    //            _selectionBasemapId = basemapItemContainer.childNodes[i].id;
    //        }
    //    }
    //}
}

function toolbarButtonMouseDown(toolId) {
    var tool = _toolbarButtons[toolId];
	
	__eventGui(ACTIONS.Toolbar, toolId);

    if (tool.getAttribute("enabled") == null || tool.getAttribute("enabled") == "true") {
        if (!tool.getAttribute("selected") || tool.getAttribute("selected") == "false") {
            if (tool.getAttribute("checked") == "true") {
                if (_selectionToolId != null) {
                    _toolbarButtons[_selectionToolId].setAttribute("selected", "false");
                    _toolbarButtons[_selectionToolId].childButton.className = _toolbarButtons[_selectionToolId].childButton.className; //����� ��������� ������
                    _selectionToolId = toolId;
                    
                }
            }
            tool.setAttribute("selected", "true");
        }
        else if (tool.getAttribute("toggled") == "true") {
            _toggleButtonMouseUp = eventHandlerContainer(toolbarButtonMouseUp, toolId);
            attachEvent(tool.childButton, "mouseup", _toggleButtonMouseUp);
        }
		
        tool.childButton.className = tool.childButton.className; //����� ��������� �����
    }
}

function basemapItemMouseDown(itemId) {
    var item = _basemapItems[itemId];
	__eventGui(ACTIONS.ChangeBasemap, itemId);
	
    if (!item.getAttribute("selected") || item.getAttribute("selected") == "false") {
        if (_selectionBasemapId != null) {
            _basemapItems[_selectionBasemapId].setAttribute("selected", "false");
            _basemapItems[_selectionBasemapId].childButton.className = _basemapItems[_selectionBasemapId].childButton.className; //����� ��������� ������
            _selectionBasemapId = itemId;
            item.childButton.className = item.childButton.className; //����� ��������� �����
        }
        item.setAttribute("selected", "true");
    }
}

function thematicMapChecked(thematicMap){	
	var layerIds = [];	
	__eventGui(ACTIONS.ChangeThematicMap, thematicMap);

    var legend = dojo.byId("thematicMapCadAmountLegend");
    if(dojo.byId("thematicMapCadAmount").checked)
	{	
		layerIds.push(1);
		layerIds.push(7);
		legend.style.display = '';
	} else {
		legend.style.display = 'none';
    }
	
	legend = dojo.byId("thematicMapCadAmountMeterLegend");	
	if(dojo.byId("thematicMapCadAmountMeter").checked){	
		layerIds.push(0);
		layerIds.push(6);
		legend.style.display = '';
    }
	else {
		legend.style.display = 'none';
    }
	
	legend = dojo.byId("thematicMapUsesTypeLegend");
	if(dojo.byId("thematicMapUsesType").checked)
	{	
		layerIds.push(2);
		layerIds.push(4);		
		legend.style.display = '';
	} else {
		legend.style.display = 'none';
    }
	
	legend = dojo.byId("thematicMapCategoryLegend");
	if(dojo.byId("thematicMapCategory").checked)					
	{	
		layerIds.push(3);	
		layerIds.push(5);	
		legend.style.display = '';
	} else {
		legend.style.display = 'none';
    }
	//
	legend = dojo.byId("thematicMapUpdateLegend");
	if(dojo.byId("thematicMapUpdate").checked)
	{
		layerIds.push(8);
		legend.style.display = '';
	} else {
		legend.style.display = 'none';
	}

	legend = dojo.byId("thematicMapVisitorsLegend");
	if(dojo.byId("thematicMapVisitors").checked)
	{
		layerIds.push(9);
		legend.style.display = '';
	} else {
		legend.style.display = 'none';
	}

	legend = dojo.byId("thematicMapUpdateAttrLegend");
	if(dojo.byId("thematicMapUpdateAttr").checked)
	{
		layerIds.push(10);
		legend.style.display = '';
	} else {
		legend.style.display = 'none';
	}

    var legendCheckbox = dojo.byId('legendCheckbox');
	
	if(layerIds.length > 0){
		_cadastreLayers["thematicsMap"].show();
        legendCheckbox.disabled = false;
        dojo.removeClass(legendCheckbox.labels[0], 'disabledLabel');
    }
	else{
		_cadastreLayers["thematicsMap"].hide();
       // legendCheckbox.disabled = true;
       // dojo.addClass(legendCheckbox.labels[0], 'disabledLabel');
    }
		
	_cadastreLayers["thematicsMap"].setVisibleLayers(layerIds);
}

function toolbarButtonMouseUp(toolId) {
    var tool = _toolbarButtons[toolId];

    if (tool.getAttribute("toggled") == "true" && tool.getAttribute("selected") == "true" && _toggleButtonMouseUp) {
        removeEvent(tool.childButton, "mouseup", _toggleButtonMouseUp);
    }

    tool.setAttribute("selected", "false");
    _toolbarButtons[_selectionToolId].childButton.className = _toolbarButtons[_selectionToolId].childButton.className; //����� ��������� ������
    tool.childButton.className = tool.childButton.className; //����� ��������� �����
}

function stopEventPropagation(event) {
    event = event || window.event;
    event.stopPropagation ? event.stopPropagation() : (event.cancelBubble = true);
}

function setToolEnabled(toolId, state) {
    _toolbarButtons[toolId].setAttribute("enabled", state.toString());
    _toolbarButtons[toolId].childButton.className = _toolbarButtons[toolId].childButton.className; //����� ���������
    if (state)
        repairOnclickHandler(_toolbarButtons[toolId]);
    else
        brokeOnclickHandler(_toolbarButtons[toolId]);
}

function brokeOnclickHandler(tool) {
    if (!_brokenToolbarEvent)
        _brokenToolbarEvent = new Array();
    if (!_brokenToolbarEvent[tool.id])
        _brokenToolbarEvent[tool.id] = new Array();

    var onclickFunctionName = tool.getAttribute("onclick");
    if (onclickFunctionName != "" || _brokenToolbarEvent[tool.id]["onclick"] == null) {
        _brokenToolbarEvent[tool.id]["onclick"] = onclickFunctionName;
        tool.setAttribute("onclick", "");
    }
}

function repairOnclickHandler(tool){
    var onclickFunctionName = tool.getAttribute("onclick");
    tool.setAttribute("onclick", _brokenToolbarEvent[tool.id]["onclick"]);
}

function eventHandlerContainer(eventHandler, param) {
    return function () {
        eventHandler(param);
    }
}

function attachEvent(target, eventName, handler) {
    if (target.addEventListener)
        target.addEventListener(eventName, handler, false);
    else if (target.attachEvent)
        target.attachEvent("on" + eventName, handler);
    else
        target.setAttribute("on" + eventName, handler);
}

function removeEvent(target, eventName, handler) {
    if (target.removeEventListener)
        target.removeEventListener(eventName, handler, false);
    else if (target.attachEvent)
        target.detachEvent("on" + eventName, handler);
    else
        target.setAttribute("on" + eventName, "");
}