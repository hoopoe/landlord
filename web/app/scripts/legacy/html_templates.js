var RESULT_ITEM_HTML_TEMPLATE = {
    cadastreOkrug: "<li class='resultItem'><table cellspacing='0' cellpadding='0'><tbody><tr><td class='resultItemNumber'>${ItemNumber}.</td><td><a class='pseudoLink' onclick='searchResultItemClicked(PortalObjectTypes.cadastreOkrug,${ItemNumber}); return false;'>${CAD_NUM}</a><a class='bookmarks_button bookmarks_listButton bookmarks_addButton' title='Добавить в избранное' onclick='addToBookmarks(PortalObjectTypes.cadastreOkrug, ${ItemNumber}); return false;'></a></td></tr><tr><td></td><td>${NAME}</td></tr></tbody></table></li>",
    cadastreRayon: "<li class='resultItem'><table cellspacing='0' cellpadding='0'><tbody><tr><td class='resultItemNumber'>${ItemNumber}.</td><td><a class='pseudoLink' onclick='searchResultItemClicked(PortalObjectTypes.cadastreRayon,${ItemNumber}); return false;'>${CAD_NUM}</a><a class='bookmarks_button bookmarks_listButton bookmarks_addButton' title='Добавить в избранное' onclick='addToBookmarks(PortalObjectTypes.cadastreRayon, ${ItemNumber}); return false;'></a></td></tr><tr><td></td><td>${NAME}</td></tr></tbody></table></li>",
    cadastreKvartal: "<li class='resultItem'><table cellspacing='0' cellpadding='0'><tbody><tr><td class='resultItemNumber'>${ItemNumber}.</td><td><a class='pseudoLink' onclick='searchResultItemClicked(PortalObjectTypes.cadastreKvartal,${ItemNumber}); return false;'>${CAD_NUM}</a><a class='bookmarks_button bookmarks_listButton bookmarks_addButton' title='Добавить в избранное' onclick='addToBookmarks(PortalObjectTypes.cadastreKvartal, ${ItemNumber}); return false;'></a></td></tr><tr><td></td><td></td></tr></tbody></table></li>",
    parcel: "<li class='resultItem'><table cellspacing='0' cellpadding='0'><tbody><tr><td class='resultItemNumber'>${ItemNumber}.</td><td><a class='pseudoLink' onclick='searchResultItemClicked(PortalObjectTypes.parcel,${ItemNumber}); return false;'>${PARCEL_CN}</a>${ErrorSymbol}<a class='bookmarks_button bookmarks_listButton bookmarks_addButton' title='Добавить в избранное' onclick='addToBookmarks(PortalObjectTypes.parcel, ${ItemNumber}); return false;'></a></td></tr><tr><td></td><td>${OBJECT_ADDRESS}</td></tr></tbody></table></li>",
	oks: "<li class='resultItem'><table cellspacing='0' cellpadding='0'><tbody><tr><td class='resultItemNumber'>${ItemNumber}.</td><td><a class='pseudoLink' onclick='searchResultItemClicked(PortalObjectTypes.oks,${ItemNumber}); return false;'>${PARCEL_CN}</a>${ErrorSymbol}<a class='bookmarks_button bookmarks_listButton bookmarks_addButton' title='Добавить в избранное' onclick='addToBookmarks(PortalObjectTypes.oks, ${ItemNumber}); return false;'></a></td></tr><tr><td></td><td>${OBJECT_ADDRESS}</td></tr></tbody></table></li>",
    
	zouit: "<li class='resultItem'><table cellspacing='0' cellpadding='0'><tbody><tr><td class='resultItemNumber'>${ItemNumber}.</td><td><a class='pseudoLink' onclick='searchResultZouitItemClicked(${ItemNumber}); return false;'>${CODE_ZONE_VALUE}</a>${ErrorSymbol}</td></tr><tr><td></td><td>${DESCRIPTION}</td></tr></tbody></table></li>",
	
	terrZone: "<li class='resultItem'><table cellspacing='0' cellpadding='0'><tbody><tr><td class='resultItemNumber'>${ItemNumber}.</td><td><a class='pseudoLink' onclick='searchResultTerrZoneItemClicked(${ItemNumber}); return false;'>${CODE_ZONE_VALUE}</a>${ErrorSymbol}</td></tr><tr><td></td><td>${DESCRIPTION}</td></tr></tbody></table></li>",
	
	border: "<li class='resultItem'><table cellspacing='0' cellpadding='0'><tbody><tr><td class='resultItemNumber'>${ItemNumber}.</td><td><a class='pseudoLink' onclick='searchResultBorderItemClicked(${ItemNumber}); return false;'>${BRD_TYPE_STR}</a>${ErrorSymbol}</td></tr><tr><td></td><td>${BRD_NAME_STR}</td></tr></tbody></table></li>",

    atd: "<li class='resultItem'><table cellspacing='0' cellpadding='0'><tbody><tr><td class='resultItemNumber'>${ItemNumber}.</td><td><a class='pseudoLink' onclick='searchResultAtdItemClicked(${ItemNumber}); return false;'>${BS_NAME}</a>${ErrorSymbol}</td></tr><tr><td></td><td></td></tr></tbody></table></li>",

	coordinate: "<li class='resultItem'><table cellspacing='0' cellpadding='0'><tbody><tr><td class='resultItemNumber'>${ItemNumber}.</td><td><a class='pseudoLink' onclick='searchResultCoordinateItemClicked(); return false;'>${x}, ${y}</a></td></tr><tr><td></td><td></td></tr></tbody></table></li>",

    frame: "<li class='resultItem'><table cellspacing='0' cellpadding='0'><tbody><tr><td class='resultItemNumber'>${ItemNumber}.</td><td><a class='pseudoLink' onclick='searchResultFrameItemClicked(${ItemNumber}); return false;'>${_name}</a></td></tr><tr><td></td><td>${_scale}</td></tr><tr><td></td><td>${_holder}</td></tr></tbody></table></li>",
    //frame1: "<li class='resultItem'><table cellspacing='0' cellpadding='0'><tbody><tr><td class='resultItemNumber'>${ItemNumber}.</td><td><a class='pseudoLink' onclick='searchResultFrameItemClicked(${ItemNumber}); return false;'>${NAME}</a></td></tr><tr><td></td><td>${holder}</td></tr></tbody></table></li>",
    //frame2: "<li class='resultItem'><table cellspacing='0' cellpadding='0'><tbody><tr><td class='resultItemNumber'>${ItemNumber}.</td><td><a class='pseudoLink' onclick='searchResultFrameItemClicked(${ItemNumber}); return false;'>${NAME}</a></td></tr><tr><td></td><td>${holder}</td></tr></tbody></table></li>",
    //frame3: "<li class='resultItem'><table cellspacing='0' cellpadding='0'><tbody><tr><td class='resultItemNumber'>${ItemNumber}.</td><td><a class='pseudoLink' onclick='searchResultFrameItemClicked(${ItemNumber}); return false;'>${Name}</a></td></tr><tr><td></td><td></td></tr></tbody></table></li>",
    //frame4: "<li class='resultItem'><table cellspacing='0' cellpadding='0'><tbody><tr><td class='resultItemNumber'>${ItemNumber}.</td><td><a class='pseudoLink' onclick='searchResultFrameItemClicked(${ItemNumber}); return false;'>${Name}</a></td></tr><tr><td></td><td>${SOURCE}</td></tr></tbody></table></li>",

    //subject: "<li class='resultItem'><table><tbody><tr><td class='resultItemNumber'>${ItemNumber}.</td><td><a class='pseudoLink' onclick='searchResultItemClicked(PortalObjectTypes.subject,${ItemNumber}); return false;'>${NAME}</a></td></tr><tr><td></td><td></td></tr></tbody></table></li>",
    //mo1Level: "<li class='resultItem'><table><tbody><tr><td class='resultItemNumber'>${ItemNumber}.</td><td><a class='pseudoLink' onclick='searchResultItemClicked(PortalObjectTypes.mo1Level,${ItemNumber}); return false;'>${NAME}</a></td></tr><tr><td></td><td></td></tr></tbody></table></li>",
    //mo2Level: "<li class='resultItem'><table><tbody><tr><td class='resultItemNumber'>${ItemNumber}.</td><td><a class='pseudoLink' onclick='searchResultItemClicked(PortalObjectTypes.mo2Level,${ItemNumber}); return false;'>${NAME}</a></td></tr><tr><td></td><td></td></tr></tbody></table></li>",
    //settlement: "<li class='resultItem'><table><tbody><tr><td class='resultItemNumber'>${ItemNumber}.</td><td><a class='pseudoLink' onclick='searchResultItemClicked(PortalObjectTypes.settlement,${ItemNumber}); return false;'>${NAME}</a></td></tr><tr><td></td><td></td></tr></tbody></table></li>",
    //street: "<li class='resultItem'><table><tbody><tr><td class='resultItemNumber'>${ItemNumber}.</td><td><a class='pseudoLink' onclick='searchResultItemClicked(PortalObjectTypes.street,${ItemNumber}); return false;'>${NAME}</a></td></tr><tr><td></td><td></td></tr></tbody></table></li>",
    //building: "<li class='resultItem'><table><tbody><tr><td class='resultItemNumber'>${ItemNumber}.</td><td><a class='pseudoLink' onclick='searchResultItemClicked(PortalObjectTypes.building,${ItemNumber}); return false;'>${CAD_NUM}</a></td></tr><tr><td></td><td></td></tr></tbody></table></li>",
	//address: "<li class='resultItem'><table><tbody><tr><td class='resultItemNumber'>${ItemNumber}.</td><td><a class='pseudoLink' onclick='searchResultItemClicked(PortalObjectTypes.addressLocator,${ItemNumber}); return false;'>${Match_addr}</a></td></tr></tbody></table></li>",
	//addressEx: "<li class='resultItem'><table><tbody><tr><td class='resultItemNumber'>${ItemNumber}.</td><td><a class='pseudoLink' onclick='searchResultItemClicked(PortalObjectTypes.addressLocator,${ItemNumber}); return false;'>${Match_addr}</a></td></tr><tr><td>&nbsp;</td><td>${LocatorName}</td></tr></tbody></table></li>",
	subject: "<li class='resultItem'><table><tbody><tr><td class='resultItemNumber'>${ItemNumber}.</td><td><a class='pseudoLink' onclick='searchResultItemClicked(PortalObjectTypes.subject,${ItemNumber}); return false;'>${NAME}</a></td></tr><tr><td></td><td></td></tr></tbody></table></li>",
	mo1Level: "<li class='resultItem'><table><tbody><tr><td class='resultItemNumber'>${ItemNumber}.</td><td><a class='pseudoLink' onclick='searchResultItemClicked(PortalObjectTypes.mo1Level,${ItemNumber}); return false;'>${NAME}</a></td></tr><tr><td></td><td></td></tr></tbody></table></li>",
	mo2Level: "<li class='resultItem'><table><tbody><tr><td class='resultItemNumber'>${ItemNumber}.</td><td><a class='pseudoLink' onclick='searchResultItemClicked(PortalObjectTypes.mo2Level,${ItemNumber}); return false;'>${NAME}</a></td></tr><tr><td></td><td></td></tr></tbody></table></li>",
	settlement: "<li class='resultItem'><table><tbody><tr><td class='resultItemNumber'>${ItemNumber}.</td><td><a class='pseudoLink' onclick='searchResultItemClicked(PortalObjectTypes.settlement,${ItemNumber}); return false;'>${NAME}</a></td></tr><tr><td></td><td></td></tr></tbody></table></li>",
	street: "<li class='resultItem'><table><tbody><tr><td class='resultItemNumber'>${ItemNumber}.</td><td><a class='pseudoLink' onclick='searchResultItemClicked(PortalObjectTypes.street,${ItemNumber}); return false;'>${NAME}</a></td></tr><tr><td></td><td></td></tr></tbody></table></li>",
	building: "<li class='resultItem'><table><tbody><tr><td class='resultItemNumber'>${ItemNumber}.</td><td><a class='pseudoLink' onclick='searchResultItemClicked(PortalObjectTypes.building,${ItemNumber}); return false;'>${FULLNUMBER}</a></td></tr><tr><td></td><td></td></tr></tbody></table></li>",
	address: "<li class='resultItem'><table><tbody><tr><td class='resultItemNumber'>${ItemNumber}.</td><td><a class='pseudoLink' onclick='searchResultItemClicked(PortalObjectTypes.addressLocator,${ItemNumber}); return false;'>${Match_addr}</a></td></tr></tbody></table></li>",
	addressEx: "<li class='resultItem'><table><tbody><tr><td class='resultItemNumber'>${ItemNumber}.</td><td><a class='pseudoLink' onclick='searchResultItemClicked(PortalObjectTypes.addressLocator,${ItemNumber}); return false;'>${Match_addr}</a></td></tr><tr><td>&nbsp;</td><td>${LocatorName}</td></tr></tbody></table></li>",


	okrugBookmark: "<li class='resultItem'><table cellspacing='0' cellpadding='0'><tbody><tr><td class='resultItemNumber'>${BookmarksItemNumber}.</td><td><a class='pseudoLink' onclick='bookmarksItemClicked(PortalObjectTypes.cadastreOkrug,${BookmarksItemNumber}); return false;'>${CAD_NUM}</a><a class='bookmarks_button bookmarks_listButton bookmarks_removeButton' title='Удалить из избранного' onclick='removeFromBookmars(${BookmarksItemNumber}); return false;'></a></td></tr><tr><td></td><td>${NAME}</td></tr></tbody></table></li>",
	rayonBookmark: "<li class='resultItem'><table cellspacing='0' cellpadding='0'><tbody><tr><td class='resultItemNumber'>${BookmarksItemNumber}.</td><td><a class='pseudoLink' onclick='bookmarksItemClicked(PortalObjectTypes.cadastreRayon,${BookmarksItemNumber}); return false;'>${CAD_NUM}</a><a class='bookmarks_button bookmarks_listButton bookmarks_removeButton' title='Удалить из избранного' onclick='removeFromBookmars(${BookmarksItemNumber}); return false;'></a></td></tr><tr><td></td><td>${NAME}</td></tr></tbody></table></li>",
    kvartalBookmark: "<li class='resultItem'><table cellspacing='0' cellpadding='0'><tbody><tr><td class='resultItemNumber'>${BookmarksItemNumber}.</td><td><a class='pseudoLink' onclick='bookmarksItemClicked(PortalObjectTypes.cadastreKvartal,${BookmarksItemNumber}); return false;'>${CAD_NUM}</a><a class='bookmarks_button bookmarks_listButton bookmarks_removeButton' title='Удалить из избранного' onclick='removeFromBookmars(${BookmarksItemNumber}); return false;'></a></td></tr><tr><td></td><td></td></tr></tbody></table></li>",
    parcelBookmark: "<li class='resultItem'><table cellspacing='0' cellpadding='0'><tbody><tr><td class='resultItemNumber'>${BookmarksItemNumber}.</td><td><a class='pseudoLink' onclick='bookmarksItemClicked(PortalObjectTypes.parcel,${BookmarksItemNumber}); return false;'>${CAD_NUM}</a><a class='bookmarks_button bookmarks_listButton bookmarks_removeButton' title='Удалить из избранного' onclick='removeFromBookmars(${BookmarksItemNumber}); return false;'></a></td></tr><tr><td></td><td>${OBJECT_ADDRESS}</td></tr></tbody></table></li>",
	oksBookmark: "<li class='resultItem'><table cellspacing='0' cellpadding='0'><tbody><tr><td class='resultItemNumber'>${BookmarksItemNumber}.</td><td><a class='pseudoLink' onclick='bookmarksItemClicked(PortalObjectTypes.oks,${BookmarksItemNumber}); return false;'>${CAD_NUM}</a><a class='bookmarks_button bookmarks_listButton bookmarks_removeButton' title='Удалить из избранного' onclick='removeFromBookmars(${BookmarksItemNumber}); return false;'></a></td></tr><tr><td></td><td>${OBJECT_ADDRESS}</td></tr></tbody></table></li>"
};

var LOCATOR_RESULTITEM_BUILDER = {
	headerRow:"<li class='resultItem'><table><tbody>",
	itemRow:"<tr><td class='resultItemNumber'>${0}.</td><td><a class='pseudoLink' onclick='searchResultItemClicked(PortalObjectTypes.addressLocator,${0}); return false;'>${1}</a></td></tr>",
	descriptionRow:"<tr><td>&nbsp;</td><td>${0}</td></tr>",
	footerRow:"</tbody></table></li>"
};


var INFO_WINDOW_CONTENT_TEMPLATE = {
    tabPanel: "<div class='portlet-nav-toolbar'><div class='portlet-nav-toolbar-box'><ul class='portlet-nav-tabs portlet-nav-tabs-content g-layout'><li class='tabs-item2-active'><a class='tabs-item2'><span><span><span class='tab_header'>Информация</span></span></span></a></li><li><a class='tabs-item2'><span><span><span class='tab_header'>Характеристики</span></span></span></a></li><li><a class='tabs-item2'><span><span><span class='tab_header'>Кто обслуживает?</span></span></span></a></li><li><a class='tabs-item2'><span><span><span class='tab_header'>Услуги</span></span></span></a></li></ul></div></div>",
	liteTabPanel: "<div class='portlet-nav-toolbar'><div class='portlet-nav-toolbar-box'><ul class='portlet-nav-tabs portlet-nav-tabs-content g-layout'><li class='tabs-item2-active'><a class='tabs-item2'><span><span><span class='tab_header'>Информация</span></span></span></a></li><li><a class='tabs-item2'><span><span><span class='tab_header'>Характеристики</span></span></span></a></li><li><a class='tabs-item2'><span><span><span class='tab_header'>Кто обслуживает?</span></span></span></a></li></ul></div></div>",
    cadastreDiv: "<div class='portlet-nav-toolbar'><div class='portlet-nav-toolbar-box'><ul class='portlet-nav-tabs portlet-nav-tabs-content g-layout'><li class='tabs-item2-active'><a class='tabs-item2'><span><span><span class='tab_header'>На карте</span></span></span></a></li></ul></div></div>",
    cadastreZoneTabPanel: "<div class='portlet-nav-toolbar'><div class='portlet-nav-toolbar-box'><ul class='portlet-nav-tabs portlet-nav-tabs-content g-layout'><li class='tabs-item2-active'><a class='tabs-item2'><span><span><span class='tab_header'>На карте</span></span></span></a></li><li><a class='tabs-item2'><span><span><span class='tab_header'>Кто обслуживает?</span></span></span></a></li></ul></div></div>",

    tabHeader: "<div class='portlet-content-wrap2'>",
    activeTabHeader: "<div class='portlet-content-wrap2 portlet-content-wrap2-active'>",
    tabFooter: "</div>",
    divHeader: "<div>",
    divFooter: "</div>",

    mapInfoContainerHeader:"<div class='mapInfoContainer'>",
    mapInfoContainerFooter:"</div>",
    mapInfoEmptyMessage:"<div class='emptyGeometry'><p><strong class='red'>Внимание!</strong> Сведения о границах объекта отсутствуют. Местоположение указано ориентировочно.</p></div>",
    mapInfoTableHeader:"<table class='mapInfo'><tbody>",
    mapInfoTableFooter:"</tbody></table>",
    mapInfoAddressRow:"<tr><td class='leftColumn'>Адрес:</td><td><strong>${0}</strong></td></tr><tr class='emptyRow'></tr>",
	mapInfoParcelRow:"<tr><td>Земельный участок:</td><td><a class='pseudoLink' onclick='parentCadastreNumberClick(\"${0}\");'><strong>${0}</strong></a></td></tr><tr class='emptyRow'></tr>",
    mapInfoCadastreKvartalRow:"<tr><td>Квартал:</td><td><a class='pseudoLink' onclick='parentCadastreNumberClick(\"${0}\");'><strong>${0}</strong></a></td></tr><tr class='emptyRow'></tr>",
    mapInfoCadastreRayonRow:"<tr><td>Район:</td><td><a class='pseudoLink' onclick='parentCadastreNumberClick(\"${0}\");'><strong>${0}</strong></a></td></tr><tr class='emptyRow'></tr>",
    mapInfoCadastreOkrugRow:"<tr><td>Округ:</td><td><a class='pseudoLink' onclick='parentCadastreNumberClick(\"${0}\");'><strong>${0}</strong></a></td></tr><tr class='emptyRow'></tr>",

    infoTableHeader:"<div class='infoContainer'><table class='info'><tbody>",
    infoTableFooter:"</tbody></table></div>",
    infoStateRow:"<tr><td class='leftColumn'>Статус:</td><td><strong>${0}</strong></td></tr><tr class='emptyRow'></tr>",
    infoCategory: "<tr><td class='leftColumn'>Категория:</td><td><strong>${0}</strong></td></tr><tr class='emptyRow'></tr><tr class='emptyRow'></tr>",
    
	infoDateRow: "<tr><td class='leftColumn'>Дата постановки на учет:</td><td><strong>${0}</strong></td></tr><tr class='emptyRow'></tr><tr class='emptyRow'></tr>",
	infoDateTooltipRow: "<tr>" +
        "<td><strong>Даты обновления:</strong> <i id='dateupdatetooltip' class='icon-tooltip' onmouseover='dijit.Tooltip.defaultPosition=[\"after\",\"before\"];'></i>" +
        "<div class='dijitHidden'><span data-dojo-type='dijit.Tooltip' data-dojo-props='connectId:\"dateupdatetooltip\"'>" +
        "Дата последнего обновления сведений </br> ${0} на ПКК" +
        "</span></div>" +
        "</td>" +
        "</tr>",
    infoAttrActualDateRow: "<tr>" +
    "<td class='leftColumn'>Атрибуты:</td>" +
    "<td><strong id='actual_date'>${0}</strong></td>" +
    "</tr></tr>",
	infoBorderActualDateRow: "<tr>" +
    "<td class='leftColumn'>Границы:</td>" +
    "<td><strong id='border_actual_date'>${0}</strong></td>" +
    "</tr></tr>",

	infoParcelAttrActualDateRow: "<tr><td class='leftColumn'>Дата обновления атрибутов участка на ПКК:</td><td><strong id='actual_date'>${0}</strong></td></tr></tr>",
	infoParcelBorderActualDateRow: "<tr><td class='leftColumn'>Дата обновления границ участка на ПКК:</td><td><strong id='border_actual_date'>${0}</strong></td></tr></tr>",

	infoOksAttrActualDateRow: "<tr><td class='leftColumn'>Дата обновления атрибутов ОКС на ПКК:</td><td><strong>${0}</strong></td></tr></tr>",
	infoOksBorderActualDateRow: "<tr><td class='leftColumn'>Дата обновления границ ОКС на ПКК:</td><td><strong>${0}</strong></td></tr></tr>",


	infoKLADRRow: "<tr><td class='leftColumn'>Кладр:</td><td><strong>${0}</strong></td></tr><tr class='emptyRow'></tr><tr class='emptyRow'></tr>",

	infoLetterRow: "<tr><td class='leftColumn'>Литера:</td><td><strong>${0}</strong></td></tr><tr class='emptyRow'></tr><tr class='emptyRow'></tr>",
	infoWallMaterialRow: "<tr><td class='leftColumn'>Материал стен:</td><td><strong>${0}</strong></td></tr><tr class='emptyRow'></tr><tr class='emptyRow'></tr>",
	infoStartOperationYearRow: "<tr><td class='leftColumn'>Ввод в эксплуатацию:</td><td><strong>${0}</strong></td></tr><tr class='emptyRow'></tr><tr class='emptyRow'></tr>",
	infoEndBuildingYearRow: "<tr><td class='leftColumn'>Завершение строительства:</td><td><strong>${0}</strong></td></tr><tr class='emptyRow'></tr><tr class='emptyRow'></tr>",
	infoInventoryCostRow: "<tr><td class='leftColumn'>Инвентаризационная стоимость:</td><td><strong>${0}</strong></td></tr><tr class='emptyRow'></tr><tr class='emptyRow'></tr>",
	infoInventoryCostDateRow: "<tr><td class='leftColumn'>Дата определения ИС:</td><td><strong>${0}</strong></td></tr><tr class='emptyRow'></tr><tr class='emptyRow'></tr>",
	infoBuilderNameRow: "<tr><td class='leftColumn'>Исполнитель:</td><td><strong>${0}</strong></td></tr><tr class='emptyRow'></tr><tr class='emptyRow'></tr>",
	infoBuilderInnRow: "<tr><td class='leftColumn'>ИНН исполнителя:</td><td><strong>${0}</strong></td></tr><tr class='emptyRow'></tr><tr class='emptyRow'></tr>",
	infoStoreyCountRow: "<tr><td class='leftColumn'>Общая этажность:</td><td><strong>${0}</strong></td></tr><tr class='emptyRow'></tr><tr class='emptyRow'></tr>",
	infoUndergroundStoreyCountRow: "<tr><td class='leftColumn'>Подземная этажность:</td><td><strong>${0}</strong></td></tr><tr class='emptyRow'></tr><tr class='emptyRow'></tr>",
	
	infoUtilizationRow: "<tr><td class='leftColumn' colspan='2'>Разрешенное использование</td></tr><tr class='emptyRow'></tr>",
    infoUtilizationVRIZCodeRow:"<tr><td class='leftColumn'>&nbsp&nbsp&nbsp&nbspПо классификатору (код):</td><td><strong>${0}</strong></td></tr><tr class='emptyRow'></tr>",
	infoUtilizationVRIZRow: "<tr><td class='leftColumn'>&nbsp&nbsp&nbsp&nbspПо классификатору (описание):</td><td><strong>${0}</strong></td></tr><tr class='emptyRow'></tr>",
	//infoUtilizationFactRow: "<tr><td class='leftColumn'>&nbsp&nbsp&nbsp&nbspФактическое:</td><td><strong>${0}</strong></td></tr><tr class='emptyRow'></tr>",
	infoUtilizationDocRow: "<tr><td class='leftColumn'>&nbsp&nbsp&nbsp&nbspПо документу:</td><td><strong>${0}</strong></td></tr><tr class='emptyRow'></tr><tr class='emptyRow'></tr>",
	
	//infoUtilizationRefRow: "<tr><td class='leftColumn'>Разрешенное использование:</td><td><strong>${0}</strong></td></tr><tr class='emptyRow'></tr>",
    //infoUtilizationFactRow: "<tr><td class='leftColumn'>Фактическое использование:</td><td><strong>${0}</strong></td></tr><tr class='emptyRow'></tr>",
    //infoUtilizationDocRow: "<tr><td class='leftColumn'>Использование<br/>по документу:</td><td><strong>${0}</strong></td></tr><tr class='emptyRow'></tr>",
    
	infoOwnership: "<tr><td class='leftColumn'>Форма собственности:</td><td><strong>${0}</strong></td></tr><tr class='emptyRow'></tr><tr class='emptyRow'></tr>",
	
	infoAreaRow: "<tr><td class='leftColumn'>${0}:</td><td><strong>${1} ${2}</strong></td></tr><tr class='emptyRow'></tr>",
	infoAreaDocRow: "<tr><td class='leftColumn'>Площадь по документу:</td><td><strong>${0} ${1}</strong></td></tr><tr class='emptyRow'></tr>",
    infoAreaFactRow: "<tr><td class='leftColumn'>Фактическая площадь:</td><td><strong>${0} ${1}</strong></td></tr><tr class='emptyRow'></tr>",
    infoAreaRefRow: "<tr><td class='leftColumn'>Уточненная площадь:</td><td><strong>${0} ${1}</strong></td></tr><tr class='emptyRow'></tr>",
    infoCadastrePriceRow: "<tr><td class='leftColumn'>Кадастровая стоимость:</td><td><strong>${0} ${1}</strong></td></tr><tr class='emptyRow'></tr>",
	infoCadastreEngineerRow: "<tr><td class='leftColumn'>Кадастровый инженер:</td><td><strong>${0} ${1} ${2}</strong></td></tr><tr class='emptyRow'></tr>",
	infoOksTestRow: "<tr><td class='leftColumn'>${0}</td><td><strong>${1}</strong></td></tr><tr class='emptyRow'></tr>",

    zoneListHeader: "<ul id='zoneList' class='zoneList'>",
    zoneListFooter: "</ul>",
    zoneWaitListItem: "<li class='waitZoneItem'><img alt='loading' src='/portalonline/i/pin_load.gif'/><span>Загрузка данных...</span></li>",
    zoneErrorListItem: "<li class='errorZoneItem'><div class='errorZoneItemImg'></div><span>Превышен интвервал ожидания.<br/>Повторите запрос позже.</span></li>",
    zoneEmptyListItem: "<li class='emptyZoneItem'><div class='emptyZoneItemImg'></div><span>Данные отсутствуют.</span></li>",
    zoneHeaderListItem: "<li class='headerZoneItem'><strong>${0}</strong></li>",
    zoneListItem: "<li class='zoneItem'><div class='zoneItemMarker'></div><div class='zoneItemContent'><strong class='zoneItemTitle'>${0}</strong><br/>${1}</div></li>",

    linkListHeader: "<ul class='linkList'>",
    linkListFooter: "</ul>",
    linkListItems: [
					"<li class='linkItem'><div class='linkIcon'></div><a target='_blank' href='http://rosreestr.ru/wps/portal/cc_information_online?KN=${0}' onclick='__event(\"${0}\",ACTIONS.Service,\"Информация онлайн\")' class='link'>Справочная информация об объекте недвижимости в режиме онлайн</a></li>",
					"<li class='linkItem'><div class='linkIcon'></div><a target='_blank' href='http://rosreestr.ru/wps/portal/cc_gkn_form_new?KN=${0}&objKind=${1}' onclick='__event(\"${0}\",ACTIONS.Service,\"Сведения ГКН (new)\")' class='link'>Запрос о предоставлении сведений ГКН</a></li>",
					"<li class='linkItem'><div class='linkIcon'></div><a target='_blank' href='http://rosreestr.ru/wps/portal/cc_egrp_form_new?KN=${0}&objKind=${1}' onclick='__event(\"${0}\",ACTIONS.Service,\"Сведения ЕГРП\")' class='link'>Запрос о предоставлении сведений ЕГРП</a></li>"
					],
    cadastreMapInfoTableContainerHeader: "<div class='cadastreMapInfoContainerContainer' >",
    cadastreMapInfoTableContainerFooter: "</div>",
    cadastreMapInfoTableHeader: "<div class='cadastreMapInfoContainer'><table class='cadastreMapInfo'><tbody>",
    cadastreMapInfoTableFooter: "</tbody></table></div>",
    cadastreMapInfoEmptyRow: "<tr class='emptyRow'><td colspan='2'><div class='cadastreMapInfoSplitter'></div><td></tr>",
    cadastreMapInfoParcelCountRow: "<tr><td class='leftColumn'>Участков:</td><td><strong>${0}</strong></td></tr>",
    cadastreMapInfoKvartalCountRow: "<tr><td class='leftColumn'>Кварталов:</td><td><strong>${0}</strong></td></tr>",
    cadastreMapInfoRayonCountRow: "<tr><td class='leftColumn'>Районов:</td><td><strong>${0}</strong></td></tr>",
    cadastreMapInfoOkrugNumberRow: "<tr><td class='leftColumn'>Округ:</td><td><a class='pseudoLink' onclick='parentCadastreNumberClick(\"${0}\"); return false;'><strong>${0}</strong></a></td></tr>",
    cadastreMapInfoRayonNumberRow: "<tr><td class='leftColumn'>Район:</td><td><a class='pseudoLink' onclick='parentCadastreNumberClick(\"${0}\"); return false;'><strong>${0}</strong></a></td></tr>",
	cadastreMapInfoPlansRow: "<tr class='emptyRow'><td colspan='2'><div class='cadastreMapInfoSplitter'></div><td></tr><tr><td colspan='2'><a class='pseudoLink' id='parcelPlan' target='_blank' href='image.html?id=${0}'><strong>План ЗУ</strong></a><a class='pseudoLink' id='kvartalPlan' target='_blank' href='image.html?id=${0}&neighbour=true'><strong>План КК</strong></a></td></tr>",
	cadastreMapInfoKvartalPlansRow: "<tr class='emptyRow'><td colspan='2'><div class='cadastreMapInfoSplitter'></div><td></tr><tr><td colspan='2'><a class='pseudoLink' id='parcelPlan' target='_blank' href='image.html?id=${0}'><strong>План КК</strong></a></td></tr>",
    cadastreMapInfo3DRow: "<tr class='emptyRow'><td colspan='2'><div class='cadastreMapInfoSplitter'></div><td></tr><tr><td colspan='2'><a class='pseudoLink' id='parcelPlan' target='_blank' href='http://maps.rosreestr.ru/portalonline/Cadastre3d/${0}'><strong>3D кадастр</strong></a></td></tr>",
    cadastreMapInfoOksCountRow: "<tr><td class='leftColumn'>ОКС:</td><td><strong>${0}</strong></td></tr>",

    cadastreZoneListHeader: "<ul id='zoneList' class='zoneList' style='height:155px;'>", //64


	zouitMapInfoTableHeader: "<div class='cadastreMapInfoContainer' style='height: 122px;'><table class='cadastreMapInfo'><tbody>",
    zouitMapInfoTableFooter: "</tbody></table></div>",
	zouitTypeMapInfoRow: "<tr><td class='leftColumnZone'>Тип:</td><td><strong>${0}</strong></td></tr>",
	zouitDescriptionMapInfoRow: "<tr><td class='leftColumnZone'>Описание:</td><td><strong>${0}</strong></td></tr>",
	zouitDocMapInfoRow: "<tr><td class='leftColumnZone'>Документ:</td><td><strong><p id='zouitDocs'></p></strong></td></tr>",

	terrZoneMapInfoTableHeader: "<div class='cadastreMapInfoContainer' style='height: 122px;'><table class='cadastreMapInfo'><tbody>",
    terrZoneMapInfoTableFooter: "</tbody></table></div>",
	terrZoneTypeMapInfoRow: "<tr><td class='leftColumnZone'>Тип:</td><td><strong>${0}</strong></td></tr>",
	terrZoneDescriptionMapInfoRow: "<tr><td class='leftColumnZone'>Описание:</td><td><strong>${0}</strong></td></tr>",
	terrZoneDocMapInfoRow: "<tr><td class='leftColumnZone'>Документ:</td><td><strong><p id='terrzoneDocs'></p></strong></td></tr>",

	borderMapInfoTableHeader: "<div class='cadastreMapInfoContainer' style='height: 122px'><table class='cadastreMapInfo'><tbody>",
    borderMapInfoTableFooter: "</tbody></table></div>",
	borderDescriptionMapInfoRow: "<tr><td class='leftColumn'>Описание:</td><td><strong>${0}</strong></td></tr>",
    borderSubjectsMapInfoRow: "<tr><td>Граница:</td><td><strong>${0}</strong></td></tr>",
	borderDocsMapInfoRow: "<tr><td class='leftColumn'>Документы:</td><td><strong><p id='borderDocs'></p></strong></td></tr>",

    atdNameInfoRow: "<tr><td >Наименование:</td><td><strong>${0}</strong></td></tr>",

    atdMapInfoTableHeader: "<div class='cadastreMapInfoContainer' style='height: 122px'><table class='cadastreMapInfo'><tbody>",
    atdMapInfoTableFooter: "</tbody></table></div>",
    atdMapOkatoInfoRow: "<tr><td class='leftColumn'>ОКАТО:</td><td><strong>${0}</strong></td></tr>",
    atdMapOktmoInfoRow: "<tr><td class='leftColumn'>ОКТМО:</td><td><strong>${0}</strong></td></tr>",
    atdMapCapitalInfoRow: "<tr><td class='leftColumn'>Столица:</td><td><strong>${0}</strong></td></tr>",
    atdMapCenterInfoRow: "<tr><td class='leftColumn'>Центр:</td><td><strong>${0}</strong></td></tr>",

    atdMapParentInfoRow: "<tr class='emptyRow'></tr><tr><td class='leftColumn' colspan='2'>В составе</td></tr>",
    atdMapSettlementInfoRow: "<tr><td class='leftColumn'>&nbsp&nbsp&nbsp&nbspПоселение:</td><td><strong>${0}</strong></td></tr>",
    atdMapRayon1InfoRow: "<tr><td class='leftColumn'>&nbsp&nbsp&nbsp&nbspРайон:</td><td><strong>${0}</strong></td></tr>",
	atdMapRayon2InfoRow: "<tr><td class='leftColumn'>&nbsp&nbsp&nbsp&nbspОкруг:</td><td><strong>${0}</strong></td></tr>",
    atdMapSubjectInfoRow: "<tr><td class='leftColumn'>&nbsp&nbsp&nbsp&nbspСубъект РФ:</td><td><strong>${0}</strong></td></tr><tr class='emptyRow'></tr>",

    atdMapMOInfoRow: "<tr><td class='leftColumn'>Количество МО:</td><td><strong>${0}</strong></td></tr>",
    atdMapNPInfoRow: "<tr><td class='leftColumn'>Количество НП:</td><td><strong>${0}</strong></td></tr>",
    atdMapRosreestrInfoRow: "<tr><td class='leftColumn'>Количество офисов Росреестра:</td><td><strong>${0}</strong></td></tr>",
    atdMapMO2InfoRow: "<tr><td class='leftColumn'>Количество поселений:</td><td><strong>${0}</strong></td></tr>",

    frameNameMapInfoRow: "<tr><td class='leftColumn'>Название:</td><td><strong>${0}</strong></td></tr>",
    frameHolderMapInfoRow: "<tr><td class='leftColumn'>Источник:</td><td><strong>${0}</strong></td></tr>",
    frameScaleMapInfoRow: "<tr><td class='leftColumn'>Масштаб:</td><td><strong>${0}</strong></td></tr>",
    frameDateMapInfoRow: "<tr><td class='leftColumn'>Актуальность:</td><td><strong>${0}</strong></td></tr>",
    frameLinkMapInfoRow: "<tr><td class='leftColumn' colspan='2'><img id='frameInfoLinkLoadingIndicator' alt='loading' src='/portalonline/i/pin_load.gif'/><a id='frameInfoLink' style='display:none;' target='_blank' href='javascript: void 0'>Подробная информация</a></td></tr>"

};