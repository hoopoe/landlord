function buildZoneListContent(features) {
    var content = '';

    if (features) {
        var typesContent = ['', '', '', '', ''];
        for (var i = 0; i < features.length; i++) {
            var attributes = features[i].attributes;
            var address = attributes[FIELDS.postcode] + ', ' + attributes[FIELDS.settlement] + ', ' + attributes[FIELDS.street] + ', ' +
                            ((attributes[FIELDS.house]) ? (attributes[FIELDS.house]) : ('')) + ', ' + ((attributes[FIELDS.building]) ? (attributes[FIELDS.building]) : (''));
            var specName = 'Южное окружное управление геодезии и картографии';

            typesContent[(attributes[FIELDS.name] == specName) ? (4) : (attributes[FIELDS.organizationCode] - 1)] +=
                    dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.zoneListItem, [attributes[FIELDS.name], address + ((attributes[FIELDS.phone]) ? (', ' + attributes[FIELDS.phone]) : (''))]);
        }

        for (var j = 0; j < typesContent.length; j++) {
            if (typesContent[j]){
                content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.zoneHeaderListItem, [ZONE_TYPES[j]]);
                content += typesContent[j];
            }
        }
    }
    else {
        content += INFO_WINDOW_CONTENT_TEMPLATE.zoneEmptyListItem;
    }

    return content;
}

function insertZoneListContent(content) {
    var zoneList = dojo.byId('zoneList');
    if (content) {        
        if (zoneList) {
            zoneList.innerHTML = content;
        }
        else {
            setTimeout(function () {
                zoneList = dojo.byId('zoneList');
                if (zoneList) {
                    zoneList.innerHTML = content;
                }
                else {
                    zoneList.innerHTML = INFO_WINDOW_CONTENT_TEMPLATE.zoneErrorListItem;
                }
            }, 2000);
        }
    }
    else {
        zoneList.innerHTML = INFO_WINDOW_CONTENT_TEMPLATE.zoneEmptyListItem;
    }
}

function onZoneQueryError() {
    insertZoneListContent(INFO_WINDOW_CONTENT_TEMPLATE.zoneErrorListItem);
}

function searchZone(point) {
    var query = new esri.tasks.Query();
    query.geometry = point;
    query.returnGeometry = false;
    query.outFields = ["NAME", "PHONENUMBER", "ORG_CODE", "ORG_NAME", "POSTCODE", "SETTLEMENT", "STREET", "HOUSE", "BUILDING"];

    _queryTask.execute(PortalObjectTypes.zone, query, function (featureSet) {
        insertZoneListContent(
            buildZoneListContent(
                (featureSet.features) ? (featureSet.features) : (null)));
    }, onZoneQueryError);
}

function searchOkrugDate(okrugNumber) {
	var query = new esri.tasks.Query();
	query.where = FIELDS.cadastreOkrugId + " like '" + okrugNumber + "%'";
	query.returnGeometry = false;
	query.outFields = ["ONLINE_ACTUAL_DATE", "ACTUAL_DATE"];

	_queryTask.execute(PortalObjectTypes.cadastreOkrug, query, function (featureSet) {
        var attrDate = null;
        var borderDate = null;
		var attrContent;
		var borderContent;

        if (featureSet.features[0].attributes["ONLINE_ACTUAL_DATE"] != ' ' && featureSet.features[0].attributes["ONLINE_ACTUAL_DATE"] > 0){
            attrDate = new Date(featureSet.features[0].attributes["ONLINE_ACTUAL_DATE"]);
            attrContent = formatDate(attrDate.getDate(),attrDate.getMonth()+1,attrDate.getFullYear());
        }
        else{
            attrContent = NO_DATA;
        }

        if(featureSet.features[0].attributes["ACTUAL_DATE"] != ' ' && featureSet.features[0].attributes["ACTUAL_DATE"] > 0){
            borderDate =  new Date(featureSet.features[0].attributes["ACTUAL_DATE"]);
            borderContent = formatDate(borderDate.getDate(),borderDate.getMonth()+1,borderDate.getFullYear());
        }else{
            borderContent = NO_DATA;
        }



		setDateField("actual_date", attrContent);
        setDateField("border_actual_date", borderContent);
	});
}

function setDateField(elementId, content){
    var dateField = dojo.byId(elementId);

    if (dateField) {
        dateField.innerHTML = content;
    }
    else {
        setTimeout(function () {
            dateField = dojo.byId(elementId);
            if (dateField) {
                dateField.innerHTML = content;
            }
            else {
                dateField.innerHTML = NO_DATA;
            }
        }, 2000);
    }
}

function formatDate(d,y,m){
	return dojo.string.pad(d,2,'0')+'.'+dojo.string.pad(y,2,'0')+'.'+dojo.string.pad(m,2,'0');
}

function getDateTooltipText(feature, type) {
    var text = "";

    switch (type){
        case PortalObjectTypes.cadastreOkrug:
            text = "по кадастровому округу";
            break;
        case PortalObjectTypes.cadastreRayon:
            text = "по кадастровому району";
            break;
        case PortalObjectTypes.cadastreKvartal:
            text = "по кадастровому кварталу";
            break;
        case PortalObjectTypes.parcel:
            text = "о земельном участке";
            break;
        case PortalObjectTypes.oks:
            var oksTypes = {
                " " : "о ОКС",
                building:"о здании",
                construction:"о сооружении",
                flat:"о помещении"
            };

            text = oksTypes[feature.attributes[FIELDS.oksType]];
            break;
    }

    return text;
}

function buildCadastreInfoWindowContent(feature, objectType) {
    var content = '';

    if (feature.clickedPoint || feature.point) {
        content += INFO_WINDOW_CONTENT_TEMPLATE.cadastreZoneTabPanel;
        content += INFO_WINDOW_CONTENT_TEMPLATE.activeTabHeader;
    }
    else {
        content += INFO_WINDOW_CONTENT_TEMPLATE.cadastreMapInfoTableContainerHeader;
    }

    //Start "CadastreMapInfo"
    content += INFO_WINDOW_CONTENT_TEMPLATE.cadastreMapInfoTableHeader;


    if (feature.attributes[FIELDS.cadastreParcelCount]) {
        content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.cadastreMapInfoParcelCountRow, [numberFormat(feature.attributes[FIELDS.cadastreParcelCount], { decimals: 0, thousands_sep: " " })]);
    }
    if (feature.attributes[FIELDS.cadastreOksCount] || feature.attributes[FIELDS.cadastreOksCount] == 0) {
        content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.cadastreMapInfoOksCountRow, [numberFormat(feature.attributes[FIELDS.cadastreOksCount], { decimals: 0, thousands_sep: " " })]);
    }
    if (feature.attributes[FIELDS.cadastreKvartalCount]) {
        content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.cadastreMapInfoKvartalCountRow, [numberFormat(feature.attributes[FIELDS.cadastreKvartalCount], { decimals: 0, thousands_sep: " " })]);
    }
    if (feature.attributes[FIELDS.cadastreRayonCount]) {
        content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.cadastreMapInfoRayonCountRow, [numberFormat(feature.attributes[FIELDS.cadastreRayonCount], { decimals: 0, thousands_sep: " " })]);
    }

    //Дата обновления
    content += INFO_WINDOW_CONTENT_TEMPLATE.cadastreMapInfoEmptyRow;
    content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.infoDateTooltipRow, [getDateTooltipText(feature, objectType)]);

	if (feature.attributes[FIELDS.cadastreKvartalNumber] || feature.attributes[FIELDS.cadastreRayonNumber]) {
		content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.infoAttrActualDateRow, [""]);
		content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.infoBorderActualDateRow, [""]);
		searchOkrugDate(feature.attributes[FIELDS.cadastreOkrugNumber]);
	}
	else {
		if (feature.attributes["ONLINE_ACTUAL_DATE"] != ' ' && feature.attributes["ONLINE_ACTUAL_DATE"] > 0){
			var d = new Date(feature.attributes["ONLINE_ACTUAL_DATE"]);
			content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.infoAttrActualDateRow, [formatDate(d.getDate(),d.getMonth()+1,d.getFullYear())]);
		}
		else{
			content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.infoAttrActualDateRow, [NO_DATA]);
		}
        if (feature.attributes["ACTUAL_DATE"] != ' ' && feature.attributes["ACTUAL_DATE"] > 0){
            var d = new Date(feature.attributes["ACTUAL_DATE"]);
            content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.infoBorderActualDateRow, [formatDate(d.getDate(),d.getMonth()+1,d.getFullYear())]);
        }
        else{
            content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.infoBorderActualDateRow, [NO_DATA]);
        }
	}

    if (feature.attributes[FIELDS.cadastreKvartalNumber] || feature.attributes[FIELDS.cadastreRayonNumber]) {
        content += INFO_WINDOW_CONTENT_TEMPLATE.cadastreMapInfoEmptyRow;
    }

    if (feature.attributes[FIELDS.cadastreKvartalNumber]) {
        content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.cadastreMapInfoRayonNumberRow, [feature.attributes[FIELDS.cadastreOkrugNumber] + ':' + feature.attributes[FIELDS.cadastreRayonNumber]]);
    }
    if (feature.attributes[FIELDS.cadastreRayonNumber]) {
        content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.cadastreMapInfoOkrugNumberRow, [feature.attributes[FIELDS.cadastreOkrugNumber]]);
    }
	
	if (feature.attributes[FIELDS.cadastreKvartalNumber]) {
		content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.cadastreMapInfoKvartalPlansRow, [feature.attributes[FIELDS.cadastreNumber]]);
    }
    content += INFO_WINDOW_CONTENT_TEMPLATE.cadastreMapInfoTableFooter;

    if (feature.clickedPoint || feature.point) {
        content += INFO_WINDOW_CONTENT_TEMPLATE.tabFooter;
        //End "CadastreMapInfoo"
        //Start "Zone"
        content += INFO_WINDOW_CONTENT_TEMPLATE.tabHeader;
        content += INFO_WINDOW_CONTENT_TEMPLATE.cadastreZoneListHeader;

        content += INFO_WINDOW_CONTENT_TEMPLATE.zoneWaitListItem;

        content += INFO_WINDOW_CONTENT_TEMPLATE.zoneListFooter;
        content += INFO_WINDOW_CONTENT_TEMPLATE.tabFooter;

        searchZone((feature.clickedPoint) ? (feature.clickedPoint) : (feature.point));
        //End "Zone"
    }
    else {
        content += INFO_WINDOW_CONTENT_TEMPLATE.cadastreMapInfoTableContainerFooter;
    }
    
    return content;
}

function buildParcelInfoWindowContent(feature) {
	var content = '';

    content += INFO_WINDOW_CONTENT_TEMPLATE.tabPanel;
    content += INFO_WINDOW_CONTENT_TEMPLATE.activeTabHeader;
    //Start "MapInfo" //( == ' ')?(NO_DATA):()
    content += INFO_WINDOW_CONTENT_TEMPLATE.mapInfoContainerHeader;

    if (feature.attributes[FIELDS.geometryError]) {
        content += INFO_WINDOW_CONTENT_TEMPLATE.mapInfoEmptyMessage;
    }

    content += INFO_WINDOW_CONTENT_TEMPLATE.mapInfoTableHeader;

	content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.infoStateRow, [(feature.attributes[FIELDS.stateCode] == ' ')?(NO_DATA):(PARCEL_STATES[feature.attributes[FIELDS.stateCode] - 1])]);

	content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.mapInfoAddressRow, [(feature.attributes[FIELDS.address] == ' ')?(NO_DATA):(feature.attributes[FIELDS.address])]);

	if (feature.attributes[FIELDS.area] && feature.attributes[FIELDS.area] != ' ') {
		content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.infoAreaRow, [AREA_TYPES[feature.attributes[FIELDS.areaType]],numberFormat(feature.attributes[FIELDS.area], { thousands_sep: " " }), (feature.attributes[FIELDS.areaUnit]) ? (UNITS[feature.attributes[FIELDS.areaUnit]]) : ('')]);
	} else{
		content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.infoAreaRow, ['Площадь',NO_DATA, '']);
	}

	if (feature.attributes[FIELDS.cadastrePrice] && feature.attributes[FIELDS.cadastrePrice] != ' ' && feature.attributes[FIELDS.cadastrePriceUnit] && feature.attributes[FIELDS.cadastrePriceUnit] != ' ') {
		content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.infoCadastrePriceRow, [numberFormat(feature.attributes[FIELDS.cadastrePrice], { thousands_sep: " " }), UNITS[feature.attributes[FIELDS.cadastrePriceUnit]]]);
	}
	else{
		content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.infoCadastrePriceRow, [NO_DATA, '']);
	}

    if (feature.attributes[FIELDS.formRights] && feature.attributes[FIELDS.formRights] != ' '){
        content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.infoOwnership, [FORM_RIGHTS[feature.attributes[FIELDS.formRights]]]);
    } else {
        content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.infoOwnership, [NO_DATA]);
    }

	if (feature.attributes["DATE_CREATE"] != ' ' && feature.attributes["DATE_CREATE"] > 0){
		var d = new Date(feature.attributes["DATE_CREATE"]);
		content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.infoDateRow, [formatDate(d.getDate(),d.getMonth()+1,d.getFullYear())]);
	}
	else{
		content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.infoDateRow, [NO_DATA]);
	}
	
	if (feature.attributes[FIELDS.cadastreEngineerSecondName] != ' '){
		content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.infoCadastreEngineerRow, [feature.attributes[FIELDS.cadastreEngineerSecondName],feature.attributes[FIELDS.cadastreEngineerFirstName],feature.attributes[FIELDS.cadastreEngineerThirdName]]);
	}
	else{
		content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.infoCadastreEngineerRow, [NO_DATA,'','']);
	}

    content += INFO_WINDOW_CONTENT_TEMPLATE.cadastreMapInfoEmptyRow;

    content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.mapInfoCadastreKvartalRow, [feature.attributes[FIELDS.cadastreOkrugNumber] +
    ':' + feature.attributes[FIELDS.cadastreRayonNumber] +
    ':' + feature.attributes[FIELDS.cadastreKvartalNumber]]);

    content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.mapInfoCadastreRayonRow, [feature.attributes[FIELDS.cadastreOkrugNumber] +
    ':' + feature.attributes[FIELDS.cadastreRayonNumber]]);

    content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.mapInfoCadastreOkrugRow, [feature.attributes[FIELDS.cadastreOkrugNumber]]);



    //Дата обновления
    content += INFO_WINDOW_CONTENT_TEMPLATE.cadastreMapInfoEmptyRow;
    content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.infoDateTooltipRow, [getDateTooltipText(feature, PortalObjectTypes.parcel)]);

    content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.infoAttrActualDateRow, [""]);
    content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.infoBorderActualDateRow, [""]);
    searchOkrugDate(feature.attributes[FIELDS.cadastreOkrugNumber]);
    /*
    if (feature.attributes["ONLINE_ACTUAL_DATE"] != ' ' && feature.attributes["ONLINE_ACTUAL_DATE"] > 0){
        var d = new Date(feature.attributes["ONLINE_ACTUAL_DATE"]);
        content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.infoAttrActualDateRow, [formatDate(d.getDate(),d.getMonth()+1,d.getFullYear())]);
    }
    else{
        content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.infoAttrActualDateRow, [NO_DATA]);
    }
    if (feature.attributes["ACTUAL_DATE"] != ' ' && feature.attributes["ACTUAL_DATE"] > 0){
        var d = new Date(feature.attributes["ACTUAL_DATE"]);
        content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.infoBorderActualDateRow, [formatDate(d.getDate(),d.getMonth()+1,d.getFullYear())]);
    }
    else{
        content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.infoBorderActualDateRow, [NO_DATA]);
    }*/

    if (!feature.attributes[FIELDS.geometryError]){
        content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.cadastreMapInfoPlansRow, [feature.attributes['PARCEL_CN']]);
    }

    if(feature.attributes[FIELDS.parcelId] == '52:18:70020:25'){
        content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.cadastreMapInfo3DRow, ['index_apartmentcomplex.html']);
    }
    else if(feature.attributes[FIELDS.parcelId] == '52:18:60085:21'){
        content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.cadastreMapInfo3DRow, ['index_gaspipeline.html']);
    }
    else if(feature.attributes[FIELDS.parcelId] == '52:18:70012:23'){
        content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.cadastreMapInfo3DRow, ['index_teledom.html']);
    }

	content += INFO_WINDOW_CONTENT_TEMPLATE.mapInfoTableFooter;
    content += INFO_WINDOW_CONTENT_TEMPLATE.mapInfoContainerFooter;
    content += INFO_WINDOW_CONTENT_TEMPLATE.tabFooter;
    //End "MapInfo"
    //Start "Info"
    content += INFO_WINDOW_CONTENT_TEMPLATE.tabHeader;
    content += INFO_WINDOW_CONTENT_TEMPLATE.infoTableHeader;
	
	content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.infoCategory, [(feature.attributes[FIELDS.category] == ' ')?(NO_DATA):(CATEGORY_TYPES[feature.attributes[FIELDS.category]])]);
	
    content += INFO_WINDOW_CONTENT_TEMPLATE.infoUtilizationRow;
	
	content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.infoUtilizationVRIZCodeRow, [(feature.attributes[FIELDS.utilizationCode] == ' ')?(NO_DATA):(feature.attributes[FIELDS.utilizationCode])]);
	
	//if(UTILIZATIONS[feature.attributes[FIELDS.utilizationCode]]) {
	content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.infoUtilizationVRIZRow, [(!feature.attributes[FIELDS.utilizationCode] || feature.attributes[FIELDS.utilizationCode] == ' ')?(NO_DATA):(UTILIZATIONS[feature.attributes[FIELDS.utilizationCode]])]);
	//}

	content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.infoUtilizationDocRow, [(!feature.attributes[FIELDS.utilizationDoc] || feature.attributes[FIELDS.utilizationDoc] == ' ')?(NO_DATA):(feature.attributes[FIELDS.utilizationDoc])]);

    content += INFO_WINDOW_CONTENT_TEMPLATE.infoTableFooter;
    content += INFO_WINDOW_CONTENT_TEMPLATE.tabFooter;
    //End "Info"
    //Start "Zone"
    content += INFO_WINDOW_CONTENT_TEMPLATE.tabHeader;
    content += INFO_WINDOW_CONTENT_TEMPLATE.zoneListHeader;

    content += INFO_WINDOW_CONTENT_TEMPLATE.zoneWaitListItem;

    content += INFO_WINDOW_CONTENT_TEMPLATE.zoneListFooter;
    content += INFO_WINDOW_CONTENT_TEMPLATE.tabFooter;
    //End "Zone"
    //Start "Link"
    content += INFO_WINDOW_CONTENT_TEMPLATE.tabHeader;

    content += INFO_WINDOW_CONTENT_TEMPLATE.linkListHeader;
    for(var linkItem in INFO_WINDOW_CONTENT_TEMPLATE.linkListItems) {
		content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.linkListItems[linkItem],[feature.attributes["PARCEL_CN"], KINDS[-1]]);
	}
    content += INFO_WINDOW_CONTENT_TEMPLATE.linkListFooter;

    content += INFO_WINDOW_CONTENT_TEMPLATE.tabFooter;
    //End "Link"


    searchZone((feature.clickedPoint) ? (feature.clickedPoint) : (feature.point));
    
    return content;
}

function getFullCadastreNumber(number) {
    var numberParts = number.split(":");
   
    number = '';
	
	var cadNumber = {};
	
	if(numberParts.length >= 1)
		cadNumber.okrugNumber = numberParts[0];
	if(numberParts.length >= 2)
		cadNumber.rayonNumber = cadNumber.okrugNumber + ":" + numberParts[1];
	if(numberParts.length >= 3)
		cadNumber.kvartalNumber = cadNumber.rayonNumber + ":" + numberParts[2];

    return cadNumber;
}
function buildOksInfoWindowContent(feature) {
    var content = '';

    content += INFO_WINDOW_CONTENT_TEMPLATE.tabPanel;
    content += INFO_WINDOW_CONTENT_TEMPLATE.activeTabHeader;
    //Start "MapInfo" 
    content += INFO_WINDOW_CONTENT_TEMPLATE.mapInfoContainerHeader;

    if (feature.attributes[FIELDS.geometryError]) {
        content += INFO_WINDOW_CONTENT_TEMPLATE.mapInfoEmptyMessage;
    }

    content += INFO_WINDOW_CONTENT_TEMPLATE.mapInfoTableHeader;

	content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.infoStateRow, [(feature.attributes[FIELDS.stateCode] == ' ')?(NO_DATA):(PARCEL_STATES[feature.attributes[FIELDS.stateCode] - 1])]);

	if (feature.attributes["DATE_CREATE"] != ' ' && feature.attributes["DATE_CREATE"] > 0){
		var d = new Date(feature.attributes["DATE_CREATE"]);
		content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.infoDateRow, [formatDate(d.getDate(),d.getMonth()+1,d.getFullYear())]);
	}
	else{
		content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.infoDateRow, [NO_DATA]);
	}

	content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.mapInfoAddressRow, [(feature.attributes[FIELDS.address] == ' ')?(NO_DATA):(feature.attributes[FIELDS.address])]);

	if (feature.attributes[FIELDS.area] && feature.attributes[FIELDS.area] != ' ') {
        content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.infoAreaRow, [AREA_TYPES[feature.attributes[FIELDS.areaType]],numberFormat(feature.attributes[FIELDS.area], { thousands_sep: " " }), (feature.attributes[FIELDS.areaUnit]) ? (UNITS[feature.attributes[FIELDS.areaUnit]]) : ('')]);

        //content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.infoAreaRow, [AREA_TYPES[feature.attributes[FIELDS.areaType]] ? (UNITS[feature.attributes[FIELDS.areaType]]) : (''),numberFormat(feature.attributes[FIELDS.area], { thousands_sep: " " }), (feature.attributes[FIELDS.areaUnit]) ? (UNITS[feature.attributes[FIELDS.areaUnit]]) : ('')]);
	} else{
		content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.infoAreaRow, ['Площадь',NO_DATA, '']);
	}

    if (feature.attributes[FIELDS.formRights] && feature.attributes[FIELDS.formRights] != ' '){
        content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.infoOwnership, [FORM_RIGHTS[feature.attributes[FIELDS.formRights]]]);
    } else {
        content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.infoOwnership, [NO_DATA]);
    }
	
	if (feature.attributes[FIELDS.cadastrePrice] && feature.attributes[FIELDS.cadastrePriceUnit]) {
        content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.infoCadastrePriceRow, [numberFormat(feature.attributes[FIELDS.cadastrePrice], { thousands_sep: " " }), UNITS[feature.attributes[FIELDS.cadastrePriceUnit]]]);
    }
	else{
		content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.infoCadastrePriceRow, [NO_DATA,'']);
	}



    content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.mapInfoCadastreKvartalRow, [feature.attributes[FIELDS.cadastreOkrugNumber] +
                                                                                               ':' + feature.attributes[FIELDS.cadastreRayonNumber] +
                                                                                               ':' + feature.attributes[FIELDS.cadastreKvartalNumber]]);
																							   
    content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.mapInfoCadastreRayonRow, [feature.attributes[FIELDS.cadastreOkrugNumber] + 
                                                                                             ':' + feature.attributes[FIELDS.cadastreRayonNumber]]);
																							 
    content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.mapInfoCadastreOkrugRow, [feature.attributes[FIELDS.cadastreOkrugNumber]]);

    //Дата обновления
    content += INFO_WINDOW_CONTENT_TEMPLATE.cadastreMapInfoEmptyRow;
    content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.infoDateTooltipRow, [getDateTooltipText(feature, PortalObjectTypes.oks)]);

    content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.infoAttrActualDateRow, [""]);
    content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.infoBorderActualDateRow, [""]);
    searchOkrugDate(feature.attributes[FIELDS.cadastreOkrugNumber]);
    /*if (feature.attributes["ONLINE_ACTUAL_DATE"] != ' ' && feature.attributes["ONLINE_ACTUAL_DATE"] > 0){
        var d = new Date(feature.attributes["ONLINE_ACTUAL_DATE"]);
        content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.infoAttrActualDateRow, [formatDate(d.getDate(),d.getMonth()+1,d.getFullYear())]);
    }
    else{
        content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.infoAttrActualDateRow, [NO_DATA]);
    }
    if (feature.attributes["ACTUAL_DATE"] != ' ' && feature.attributes["ACTUAL_DATE"] > 0){
        var d = new Date(feature.attributes["ACTUAL_DATE"]);
        content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.infoBorderActualDateRow, [formatDate(d.getDate(),d.getMonth()+1,d.getFullYear())]);
    }
    else{
        content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.infoBorderActualDateRow, [NO_DATA]);
    }*/
	content += INFO_WINDOW_CONTENT_TEMPLATE.mapInfoTableFooter;
    content += INFO_WINDOW_CONTENT_TEMPLATE.mapInfoContainerFooter;
    content += INFO_WINDOW_CONTENT_TEMPLATE.tabFooter;
    //End "MapInfo"
    //Start "Info"
    content += INFO_WINDOW_CONTENT_TEMPLATE.tabHeader;
    content += INFO_WINDOW_CONTENT_TEMPLATE.infoTableHeader;
    	
    //content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.infoLetterRow,
	//	[(feature.attributes[FIELDS.letter] == ' ')?(NO_DATA):(feature.attributes[FIELDS.letter])]);
	
	content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.infoStoreyCountRow,
		[(feature.attributes[FIELDS.storeyCount] == ' ')?(NO_DATA):(feature.attributes[FIELDS.storeyCount])]);

	content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.infoUndergroundStoreyCountRow,
		[(feature.attributes[FIELDS.undergroundStoreyCount] == ' ')?(NO_DATA):(feature.attributes[FIELDS.undergroundStoreyCount])]);

	content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.infoWallMaterialRow,
		[(feature.attributes[FIELDS.wallMaterial] == ' ')?(NO_DATA):(WALL_MATERIALS[feature.attributes[FIELDS.wallMaterial]])]);

	content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.infoStartOperationYearRow,
		[(feature.attributes[FIELDS.startOperationYear] == ' ')?(NO_DATA):(feature.attributes[FIELDS.startOperationYear] + ' г.')]);

	content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.infoEndBuildingYearRow,
		[(feature.attributes[FIELDS.endBuildingYear]  == ' ')?(NO_DATA):(feature.attributes[FIELDS.endBuildingYear] + ' г.')]);

	content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.infoInventoryCostRow,
		[(feature.attributes[FIELDS.inventoryCost] == ' ' || feature.attributes[FIELDS.inventoryCost] == -1)?(NO_DATA):(numberFormat(feature.attributes[FIELDS.inventoryCost], { thousands_sep: " ", decimals: 0 }) + ' р.')]);

	if (feature.attributes[FIELDS.inventoryCostDate] != ' ') {
		var d = new Date(feature.attributes[FIELDS.inventoryCostDate]);
		content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.infoInventoryCostDateRow, [formatDate(d.getDate(),d.getMonth()+1,d.getFullYear())]);
	}
	else{
		content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.infoInventoryCostDateRow, [NO_DATA]);
	}

	content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.infoBuilderNameRow,
		[(feature.attributes[FIELDS.builderName] == ' ')?(NO_DATA):(feature.attributes[FIELDS.builderName])]);

	content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.infoBuilderInnRow,
		[(feature.attributes[FIELDS.builderInn] == ' ')?(NO_DATA):(feature.attributes[FIELDS.builderInn])]);
    
    content += INFO_WINDOW_CONTENT_TEMPLATE.infoTableFooter;
    content += INFO_WINDOW_CONTENT_TEMPLATE.tabFooter;
    //End "Info"
    //Start "Zone"
    content += INFO_WINDOW_CONTENT_TEMPLATE.tabHeader;
    content += INFO_WINDOW_CONTENT_TEMPLATE.zoneListHeader;

    content += INFO_WINDOW_CONTENT_TEMPLATE.zoneWaitListItem;

    content += INFO_WINDOW_CONTENT_TEMPLATE.zoneListFooter;
    content += INFO_WINDOW_CONTENT_TEMPLATE.tabFooter;
    //End "Zone"
	//Start "Link"
	content += INFO_WINDOW_CONTENT_TEMPLATE.tabHeader;

	content += INFO_WINDOW_CONTENT_TEMPLATE.linkListHeader;
	for(var linkItem in INFO_WINDOW_CONTENT_TEMPLATE.linkListItems) {
		content += dojo.string.substitute(INFO_WINDOW_CONTENT_TEMPLATE.linkListItems[linkItem],[feature.attributes['PARCEL_CN'], KINDS[feature.attributes[FIELDS.oksType]]]);
	}
	content += INFO_WINDOW_CONTENT_TEMPLATE.linkListFooter;

	content += INFO_WINDOW_CONTENT_TEMPLATE.tabFooter;
	//End "Link"

    searchZone((feature.clickedPoint) ? (feature.clickedPoint) : (feature.point));
    
    return content;
}

function buildInfoWindowContent(objectType, feature) {
    switch (objectType) {
        case PortalObjectTypes.cadastreOkrug:
            return buildCadastreInfoWindowContent(feature, objectType);
            break;
        case PortalObjectTypes.cadastreRayon:
            return buildCadastreInfoWindowContent(feature, objectType);
            break;
        case PortalObjectTypes.cadastreKvartal:
            return buildCadastreInfoWindowContent(feature, objectType);
            break;
        case PortalObjectTypes.parcel:
            return buildParcelInfoWindowContent(feature);
            break;
		case PortalObjectTypes.oks:
            return buildOksInfoWindowContent(feature);
            break;
    }
}

function buildInfoWindowTitle(objectType, feature) {
    switch (objectType) {
        case PortalObjectTypes.cadastreOkrug:
            return OBJECT_TYPE_FULL_NAMES[0] + ': ' + feature.attributes[FIELDS.cadastreNumber] + ' - ' + feature.attributes[FIELDS.name];
            break;
        case PortalObjectTypes.cadastreRayon:
            return OBJECT_TYPE_FULL_NAMES[1] + ': ' + feature.attributes[FIELDS.cadastreNumber] + ' - ' + feature.attributes[FIELDS.name];
            break;
        case PortalObjectTypes.cadastreKvartal:
            return OBJECT_TYPE_FULL_NAMES[2] + ': ' + feature.attributes[FIELDS.cadastreNumber];
            break;
        case PortalObjectTypes.parcel:
            return OBJECT_TYPE_FULL_NAMES[3] + ': ' + feature.attributes["PARCEL_CN"];
            break;
		case PortalObjectTypes.oks:
            var oksType = OKS_TYPES[feature.attributes[FIELDS.oksType]] ? ' (' + OKS_TYPES[feature.attributes[FIELDS.oksType]] + ')' :'';

            return OBJECT_TYPE_FULL_NAMES[4] + oksType + ': ' + feature.attributes["PARCEL_CN"];
            break;
    }
}

function calculateInfoWindowSize(objectType,isIdentify) {
    var size = {};
    switch (objectType) {
        case PortalObjectTypes.cadastreOkrug:
            size.width = (isIdentify) ? (380) : (320);
            size.height = (isIdentify) ? (207) : (171); // 163 127
            break;
        case PortalObjectTypes.cadastreRayon:
            size.width = 360;
            size.height = (isIdentify) ? (217) : (179); //173 135
            break;
        case PortalObjectTypes.cadastreKvartal:
            size.width = 360;
            size.height = (isIdentify)?(233):(203);//(189):(159)
            break;
        case PortalObjectTypes.parcel:
            size.width = 430;
            size.height = 199;
            break;
		case PortalObjectTypes.oks:
            size.width = 430;
            size.height = 199;
            break;
    }
    return size;
}

function resizeCadastreInfoWindowTabWrapper(h) {
    var tabWrappers = dojo.query('.portlet-content-wrap2');
    for (var i = 0; i < tabWrappers.length; i++) {
        tabWrappers[i].style.height = h;
    }
}

function resizeInfoWindowTabWrapper(objectType) {
    switch (objectType) {
        case PortalObjectTypes.cadastreOkrug:
            resizeCadastreInfoWindowTabWrapper('134px'); //90
            break;
        case PortalObjectTypes.cadastreRayon:
            resizeCadastreInfoWindowTabWrapper('144px'); //100
            break;
        case PortalObjectTypes.cadastreKvartal:
            resizeCadastreInfoWindowTabWrapper('160px'); //116
            break;
    }
}

function showInfoWindow(objectType, feature, screenPoint) {
    addCadastreNumbers(feature.attributes, objectType);
	
	var size = calculateInfoWindowSize(objectType, feature.clickedPoint != null || feature.point != null);
    _map.infoWindow.resize(size.width, size.height);

    _map.infoWindow.setTitle(buildInfoWindowTitle(objectType, feature));
    _map.infoWindow.setContent(buildInfoWindowContent(objectType,feature));

    dojo.parser.parse();

    tabInit2("infowindow", function(tabTitle){
		__event(feature.attributes[FIELDS.cadastreNumber], ACTIONS.TabClick, tabTitle);
	});
	
    _map.infoWindow.feature = feature;

    _map.infoWindow.fixedAnchor = null;
    _map.infoWindow.show(screenPoint, _map.getInfoWindowAnchor(screenPoint));
	
	if(typeof(feature.clickedPoint) !== 'undefined' && feature.clickedPoint != null) 
		__event(feature.attributes[FIELDS.cadastreNumber], ACTIONS.ShowInfoWindow, LABELS.Identify); 
	else 
		__event(feature.attributes[FIELDS.cadastreNumber], ACTIONS.ShowInfoWindow, LABELS.Search);

    resizeInfoWindowTabWrapper(objectType);

    if (feature.clickedPoint) {
        selectPoint([feature.clickedPoint], PIN_SYMBOL.normal, true);
        feature.clickedPoint = null;
    }
    else {
        selectPoint([feature.point], PIN_SYMBOL.normal, true);
    }    
}

function infoWindowHide() {//eventHadler
    clearAllSelectionPoint();
	clearHighlightObject();
	_selectedObject = null;
}

function parentCadastreNumberClick(number) {
    hideInfoWindow();
	
	var cadastreType = getCadastreObjectType(number);
	number = normalizeSearchCadastreNumber(number);
    _onSearchCompleted = null;
	searchObject(cadastreType, getIdField(cadastreType) + " like '" + number + "%'");
}
