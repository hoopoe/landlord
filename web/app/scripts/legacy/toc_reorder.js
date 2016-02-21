var _tocItemIndex = -1;
var _tocItemCount = 0;
var _upButton;
var _downButton;

function moveTocItem(sender, direction) {
	var item = sender.parentNode;
	
	if (_tocItemIndex = -1){
		while(item.parentNode.children[_tocItemIndex] !== item){
			_tocItemIndex++;
		}
		
		_tocItemCount = item.parentNode.children.length-1;
		
		_upButton = dojo.byId("tocItemUpButton");
		_downButton = dojo.byId("tocItemDownButton");
	}
	
	if (direction == 1){
		var prev = item.previousSibling;
		
		while( prev && prev.nodeType != 1 && (prev = prev.previousSibling));
		
		if (_tocItemIndex != 0){
			item.parentNode.insertBefore(item, prev);
			_map.reorderLayer(_zouitLayers["zouit"],_map.layerIds.indexOf("layer10") + 3);
			_map.reorderLayer(_zouitLayers["select"],_map.layerIds.indexOf("layer11") + 3);
			_tocItemIndex--;
		}
	}
	else if (direction == -1){	
		var prev = item;		
		item = item.nextSibling;
		
		while(item && item.nodeType != 1 && (item = item.nextSibling));
		
		if (_tocItemIndex != _tocItemCount){		
			item.parentNode.insertBefore(item, prev);
			_map.reorderLayer(_zouitLayers["zouit"],_map.layerIds.indexOf("layer10") - 2);
			_map.reorderLayer(_zouitLayers["select"],_map.layerIds.indexOf("layer11") - 2);
			_tocItemIndex++;
		}		
	}
	
	if (_tocItemIndex == 0){
		dojo.addClass(sender, "upButtonDisabled");
		dojo.removeClass(sender, "upButton");
	}
	else if (_tocItemIndex == _tocItemCount){
		dojo.addClass(sender, "downButtonDisabled");
		dojo.removeClass(sender, "downButton");
	}
	else{
		dojo.removeClass(_upButton, "upButtonDisabled");
		dojo.removeClass(_downButton, "downButtonDisabled");
		dojo.addClass(_upButton, "upButton");
		dojo.addClass(_downButton, "downButton");
	}
}
