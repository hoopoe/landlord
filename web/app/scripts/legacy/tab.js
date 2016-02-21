function tabInit(baseClass) {
    var tabs = dojo.query("." + baseClass + " .tabs-item");
    var contents = dojo.query("." + baseClass + " .portlet-content-wrap");
    for(var i in tabs){
        tabs[i].onclick = function (target, content, baseClass) {
            return function () {
                return tabClick(target, content, baseClass);
            };
        } (tabs[i], contents[i],baseClass);
    }
}

function tabClick(target, content, baseClass) {
    dojo.query("." + baseClass + " .tabs-item-active").removeClass("tabs-item-active");
    dojo.addClass(target.parentNode, "tabs-item-active");
    dojo.query("." + baseClass + " .portlet-content-wrap-active").removeClass("portlet-content-wrap-active");
    dojo.addClass(content, "portlet-content-wrap-active");
    resizeResultList();
	
    return false;
}

function tabInit2(baseClass, eventHandler) {
    var tabs = dojo.query("." + baseClass + " .tabs-item2");
    var contents = dojo.query("." + baseClass + " .portlet-content-wrap2");
    for (var i in tabs) {
        tabs[i].onclick = function (target, content, baseClass) {
            return function () {
				eventHandler(target.children[0].children[0].children[0].innerHTML);
                return tabClick2(target, content, baseClass);
            };
        } (tabs[i], contents[i], baseClass);
    }
}

function tabClick2(target, content, baseClass) {
    dojo.query("." + baseClass + " .tabs-item2-active").removeClass("tabs-item2-active");
    dojo.addClass(target.parentNode, "tabs-item2-active");
    dojo.query("." + baseClass + " .portlet-content-wrap2-active").removeClass("portlet-content-wrap2-active");
    dojo.addClass(content, "portlet-content-wrap2-active");

    return false;   
}