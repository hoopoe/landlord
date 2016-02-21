dojo.declare("Portal.QueryTask", null, {
    constructor: function () {
        var cadastreOkrug = null;
        var cadastreRayon = null;
        var cadastreKvartal = null;
        var parcel = null;
        var oks = null;
        var zone = null;
        var subject = null;
        var mo1Level = null;
        var mo2Level = null;
        var settlement = null;
        var street = null;
        var building = null;
        var locator = null;
        var copyrights = null;

        var queryTask = function (objectType) {
            switch (objectType) {
                case PortalObjectTypes.cadastreOkrug:
                    if (cadastreOkrug == null)
                        cadastreOkrug = new esri.tasks.QueryTask(LAYERS_URL.cadastreOkrug);
                    return cadastreOkrug;

                case PortalObjectTypes.cadastreRayon:
                    if (cadastreRayon == null)
                        cadastreRayon = new esri.tasks.QueryTask(LAYERS_URL.cadastreRayon);
                    return cadastreRayon;

                case PortalObjectTypes.cadastreKvartal:
                    if (cadastreKvartal == null)
                        cadastreKvartal = new esri.tasks.QueryTask(LAYERS_URL.cadastreKvartal);
                    return cadastreKvartal;

                case PortalObjectTypes.parcel:
                    if (parcel == null)
                        parcel = new Portal.MixedQueryTask(LAYERS_URL.parcel);
                    return parcel;
                
                case PortalObjectTypes.oks:
                    if (oks == null)
                        oks = new esri.tasks.QueryTask(LAYERS_URL.oks);
                    return oks;
                
                
                case PortalObjectTypes.point:
                    return null;

                case PortalObjectTypes.zone:
                    if (zone == null)
                        zone = new esri.tasks.QueryTask(LAYERS_URL.zone);
                    return zone;

                case PortalObjectTypes.subject:
                    if (subject == null)
                        subject = new esri.tasks.QueryTask(LAYERS_URL.subject);
                    return subject;

                case PortalObjectTypes.mo1Level:
                    if (mo1Level == null)
                        mo1Level = new esri.tasks.QueryTask(LAYERS_URL.mo1Level);
                    return mo1Level;

                case PortalObjectTypes.mo2Level:
                    if (mo2Level == null)
                        mo2Level = new esri.tasks.QueryTask(LAYERS_URL.mo2Level);
                    return mo2Level;

                case PortalObjectTypes.settlement:
                    if (settlement == null)
                        settlement = new esri.tasks.QueryTask(LAYERS_URL.settlement);
                    return settlement;

                case PortalObjectTypes.addressLocator:
                    if (locator == null)
                        locator = new esri.tasks.Locator(LAYERS_URL.addressLocator);
                    return locator;                 
            }
        };

        this.getCopyrights = function(extent, mapType, level, queryResult) {
            var query = new esri.tasks.Query();
            query.geometry = extent;
            query.returnGeometry = false;
            query.outFields = ['*'];
            
            var where = 'MapType IN ('+ mapType+')';
            where = where + ' AND (MinScale IS NULL OR MinScale <= '+ level + ') AND (MaxScale IS NULL OR MaxScale >= '+ level + ')';
            query.where = where;
            
            
            if (copyrights == null)
                copyrights = new esri.tasks.QueryTask(LAYERS_URL.copyrights);                    
            return copyrights.execute(query, queryResult);
        }
        
        this.execute = function (objectType, query, queryResult, queryError) {            
            return queryTask(objectType).execute(query, queryResult, queryError);
        }
        this.addressToLocations = function (address, onCompleted, onError){
            return queryTask(PortalObjectTypes.addressLocator).addressToLocations(address,['*'],onCompleted,onError);
        }
    },
    execute: null,  
    addressToLocations: null    
});


var PortalObjectTypes = {
    cadastreOkrug: 15,
    cadastreRayon: 9,
    cadastreKvartal: 5,
    parcel: 2,
    oks: 0,
    point: 10000,
    zone:1000,
    subject:100,//+100
    mo1Level:101,
    mo2Level:102,
    settlement:103,
    street:104,
    building:105,

    frame: 206,
    terrZone: 207,
    zouit: 208,
    border: 209,
    
    addressLocator: 300
};

var _queryTask = new Portal.QueryTask();

var _searchResultObjects;
var _searchResultObjectsType;
var _onSearchCompleted;
var _selectedObject;
var _searchPagination;
var _identifyParcelsCadnums = "";

function getObjectTypeName(objectType){
    switch (objectType) {
        case PortalObjectTypes.cadastreOkrug:
            return OBJECT_TYPE_NAMES[0];
        case PortalObjectTypes.cadastreRayon:
            return OBJECT_TYPE_NAMES[1];
        case PortalObjectTypes.cadastreKvartal:
            return OBJECT_TYPE_NAMES[2];
        case PortalObjectTypes.parcel:
            return OBJECT_TYPE_NAMES[5];
        case PortalObjectTypes.oks:
            return OBJECT_TYPE_NAMES[5];
        case PortalObjectTypes.subject:
            return OBJECT_TYPE_NAMES[4];
        case PortalObjectTypes.mo1Level:
            return OBJECT_TYPE_NAMES[5];
        case PortalObjectTypes.mo2Level:
            return OBJECT_TYPE_NAMES[6];
        case PortalObjectTypes.settlement:
            return OBJECT_TYPE_NAMES[7];
        case PortalObjectTypes.addressLocator:
            return OBJECT_TYPE_NAMES[8];
        case PortalObjectTypes.frame:
        case PortalObjectTypes.terrZone:
        case PortalObjectTypes.zouit:
        case PortalObjectTypes.border:
            return OBJECT_TYPE_NAMES[10];
    }
}

function calulateObjectName(objectType, objectCount) {
    var k;

    //if (objectType == PortalObjectTypes.parcel)
    //    k = (objectCount % 10 == 1 && objectCount % 100 != 11) ? ("ок")
    //    : ((objectCount % 10 >= 2 && objectCount % 10 <= 4 && (objectCount % 100 < 10 || objectCount % 100 >= 20)) ? ("ка") : ("ков"));
    //else
        k = (objectCount % 10 == 1 && objectCount % 100 != 11) ? ("")
        : ((objectCount % 10 >= 2 && objectCount % 10 <= 4 && (objectCount % 100 < 10 || objectCount % 100 >= 20)) ? ("а") : ("ов"));

    return getObjectTypeName(objectType) + k;
}

function getResultItemhtmlTemplate(objectType){
    switch (objectType) {
        case PortalObjectTypes.cadastreOkrug:
            return RESULT_ITEM_HTML_TEMPLATE.cadastreOkrug;
        case PortalObjectTypes.cadastreRayon:
            return RESULT_ITEM_HTML_TEMPLATE.cadastreRayon;
        case PortalObjectTypes.cadastreKvartal:
            return RESULT_ITEM_HTML_TEMPLATE.cadastreKvartal;
        case PortalObjectTypes.parcel:
            return RESULT_ITEM_HTML_TEMPLATE.parcel;
        case PortalObjectTypes.oks:
            return RESULT_ITEM_HTML_TEMPLATE.oks;
        case PortalObjectTypes.subject:
            return RESULT_ITEM_HTML_TEMPLATE.subject;
        case PortalObjectTypes.mo1Level:
            return RESULT_ITEM_HTML_TEMPLATE.mo1Level;
        case PortalObjectTypes.mo2Level:
            return RESULT_ITEM_HTML_TEMPLATE.mo2Level;
        case PortalObjectTypes.settlement:
            return RESULT_ITEM_HTML_TEMPLATE.settlement;
        case PortalObjectTypes.addressLocator:
            return RESULT_ITEM_HTML_TEMPLATE.address;
        case PortalObjectTypes.frame:
            return RESULT_ITEM_HTML_TEMPLATE.frame;
        case PortalObjectTypes.terrZone:
            return RESULT_ITEM_HTML_TEMPLATE.terrZone;
        case PortalObjectTypes.zouit:
            return RESULT_ITEM_HTML_TEMPLATE.zouit;
        case PortalObjectTypes.border:
            return RESULT_ITEM_HTML_TEMPLATE.border;
    }
}


function showResultList(objectType, features, forPrint, featuresCount) {
    if (objectType == PortalObjectTypes.cadastreOkrug ||
        objectType == PortalObjectTypes.cadastreRayon ||
        objectType == PortalObjectTypes.cadastreKvartal ||
        objectType == PortalObjectTypes.parcel ||
        objectType == PortalObjectTypes.oks) {
        features.sort(function (item1, item2) {
            if (!item1.attributes[FIELDS.cadastreNumber])
                item1.attributes[FIELDS.cadastreNumber] = "";
            if (!item2.attributes[FIELDS.cadastreNumber])
                item2.attributes[FIELDS.cadastreNumber] = "";

            var val1 = item1.attributes[FIELDS.cadastreNumber].split(":");
            var val2 = item2.attributes[FIELDS.cadastreNumber].split(":");

            for(var i = 0, l = val1.length; i < l; i++){
                var n1 = parseInt(val1[i],10);
                var n2 = parseInt(val2[i],10);

                if (n1 > n2){
                    return 1;
                }
                else if (n1 < n2){
                    return -1;
                }
            }

            return 0;
            //if (val1 == val2)
            //    return 0;
            //if (val1 > val2)
            //    return 1;
            //if (val1 < val2)
            //    return -1;
        });
    }
    else if (objectType == PortalObjectTypes.subject ||
        objectType == PortalObjectTypes.mo1Level ||
        objectType == PortalObjectTypes.mo2Level ||
        objectType == PortalObjectTypes.settlement) {
        features.sort(function (item1, item2) {
            if (!item1.attributes[FIELDS.name])
                item1.attributes[FIELDS.name] = "";
            if (!item2.attributes[FIELDS.name])
                item2.attributes[FIELDS.name] = "";

            var val1 = item1.attributes[FIELDS.name];
            var val2 = item2.attributes[FIELDS.name];

            if (val1 == val2)
                return 0;
            if (val1 > val2)
                return 1;
            if (val1 < val2)
                return -1;
        });
    } else if (objectType == PortalObjectTypes.frame){
        features.sort(function (item1, item2) {
            if (!item1.attributes["SCALE"])
                item1.attributes["SCALE"] = "";
            if (!item2.attributes["SCALE"])
                item2.attributes["SCALE"] = "";

            var val1 = item1.attributes["SCALE"];
            var val2 = item2.attributes["SCALE"];

            if (val1 == val2)
                return 0;
            if (val1 > val2)
                return 1;
            if (val1 < val2)
                return -1;
        });
    } else if (objectType == PortalObjectTypes.terrZone || objectType == PortalObjectTypes.zouit) {
        features.sort(function (item1, item2) {
            if (!item1.attributes["TZ_ID"])
                item1.attributes["TZ_ID"] = "";
            if (!item2.attributes["TZ_ID"])
                item2.attributes["TZ_ID"] = "";

            var val1 = item1.attributes["TZ_ID"];
            var val2 = item2.attributes["TZ_ID"];

            if (val1 == val2)
                return 0;
            if (val1 > val2)
                return 1;
            if (val1 < val2)
                return -1;
        });
    } else if (objectType == PortalObjectTypes.border){
        features.sort(function (item1, item2) {
            if (!item1.attributes["BRD_ID"])
                item1.attributes["BRD_ID"] = "";
            if (!item2.attributes["BRD_ID"])
                item2.attributes["BRD_ID"] = "";

            var val1 = item1.attributes["BRD_ID"];
            var val2 = item2.attributes["BRD_ID"];

            if (val1 == val2)
                return 0;
            if (val1 > val2)
                return 1;
            if (val1 < val2)
                return -1;
        });
    }

    var totalResults = featuresCount == null ? features.length : featuresCount;

    if(!forPrint){
        if (features.length == 1000)
            dojo.byId('resultItemLabel').innerHTML = 'Найдено <strong>более 1000 ' + calulateObjectName(objectType, features.length) + '.</strong>';
        else {
            var l = (features.length % 10 == 1 && features.length % 100 != 11) ? ("") : ("о");
            dojo.byId('resultItemLabel').innerHTML = "Найден" + l + " <strong>" + totalResults + " " + calulateObjectName(objectType, features.length) + "</strong>";
        }
    }

    _searchPagination = _searchPagination || initSearchPagination();

    //console.debug("--Data before--");
    //console.debug(_searchPagination.data);

    _searchPagination.setData(features);
    _searchPagination.setTotalItems(totalResults);
    _searchPagination.render();
    _searchResultObjects = features;

    renderSearchList(_searchPagination.getCurrentItems(), objectType);


    //console.debug("--Data after--");
    //console.debug(_searchPagination.data);
}

function renderSearchList(features, objectType, forPrint){
    var resultListInnerHtml = '';
    var errorSymbol = '';
    var hesGeometryError = false;
    var tempObjectType = objectType;

    for (var i = 0; i < features.length; i++) {
        features[i].attributes.ItemNumber = _searchPagination.indexOf(features[i]) + 1;

        if (tempObjectType == PortalObjectTypes.oks || tempObjectType == PortalObjectTypes.parcel){ 
            if (features[i].attributes["OKS_FLAG"] === 1) {
                tempObjectType = PortalObjectTypes.oks;
            }           
            if (!!(features[i].attributes[FIELDS.geometryError] && features[i].attributes[FIELDS.geometryError] !== " ")) {
                hesGeometryError = true;
                errorSymbol = ' *';
            }
            else {
                errorSymbol = '';
            //  addSearchedObject(features[i], PIN_SYMBOL.searched);
            }
        }
        
        for(var attr in features[i].attributes){
            if(features[i].attributes[attr] == "Null" || typeof(features[i].attributes[attr]) === 'undefined' || features[i].attributes[attr] == null)
                features[i].attributes[attr] = " ";
        }

        features[i].attributes.ErrorSymbol = errorSymbol;
       

        if (!features[i].attributes["CODE_ZONE_VALUE"] && features[i].attributes["CODE_ZONE"]){
            features[i].attributes["CODE_ZONE_VALUE"] = features[i].attributes["CODE_ZONE"];
        }

        if (objectType === PortalObjectTypes.border){
            var borderType = getBorderType(features[i]);

            features[i].attributes.BRD_TYPE_STR = BORDER_TYPES[borderType];

            if (borderType > 1){
                features[i].attributes.BRD_NAME_STR = features[i].attributes[FIELDS.borderName];
            } else {
                features[i].attributes.BRD_NAME_STR = features[i].attributes[FIELDS.borderSub1] + '-' + features[i].attributes[FIELDS.borderSub2];
            }
        }

        if(!forPrint){
            if(!features[i].attributes[FIELDS.address])
                features[i].attributes[FIELDS.address] = "";
            if(tempObjectType == PortalObjectTypes.addressLocator){
                resultListInnerHtml += locatorResultItemBuilder(features[i].attributes);
            }
            else
                resultListInnerHtml += dojo.string.substitute(getResultItemhtmlTemplate(tempObjectType), features[i].attributes);
        }

        tempObjectType = objectType;
    }

    if(!forPrint){
        if (hesGeometryError) {
            dojo.byId('resultItemLabelError').innerHTML = '<br/><small>*Объекты без описания границ</small>';
            dojo.byId('resultItemLabelWraper').style.marginTop = '0px';
        }
        else {
            dojo.byId('resultItemLabelError').innerHTML = '';
            dojo.byId('resultItemLabelWraper').style.marginTop = '8px';
        }
    }

    _searchResultObjectsType = objectType;


    if(!forPrint){
        if (dojo.hasClass("searchExPanel", "searchExPanelOpenState")) {
            searchExClick();
        }
        dojo.byId('resultList').innerHTML = resultListInnerHtml;
        dojo.byId('emptyResultPanel').style.display = 'none';
        dojo.byId('resultListPanel').style.display = '';
        dojo.byId('bookmarksAllButton').style.display = '';

        setTimeout(function () {
            resizeResultList();
        }, 0);
    }
}

function addCadastreNumbers(attributes, objectType){
    var isOksOrParcel = dojo.indexOf([PortalObjectTypes.oks, PortalObjectTypes.parcel], objectType) !== -1;
    var cadastreNumbersFromCadNum = function (attributes, parentIdField) {
        var cadParts = attributes[parentIdField].split(":");

        if(cadParts.length >= 1 && !attributes[FIELDS.cadastreOkrugNumber])
            attributes[FIELDS.cadastreOkrugNumber] = cadParts[0];

        if(cadParts.length >= 2 && !attributes[FIELDS.cadastreRayonNumber])
            attributes[FIELDS.cadastreRayonNumber] = cadParts[1];

        if(cadParts.length >= 3 && !attributes[FIELDS.cadastreKvartalNumber])
            attributes[FIELDS.cadastreKvartalNumber] = cadParts[2];
    };

    if (isOksOrParcel){
        var parentId = attributes[FIELDS.parentId];

        if (parentId && parentId !== " "){
            //parentId может быть в формате 00:00:0000000
            if (parentId.split(":").length > 1){
                cadastreNumbersFromCadNum(attributes, FIELDS.parentId);
            } else {
                attributes[FIELDS.cadastreOkrugNumber] = parentId.slice(0, 2);
                attributes[FIELDS.cadastreRayonNumber] = parentId.slice(2, 2+2);
                attributes[FIELDS.cadastreKvartalNumber] = parentId.slice(4, 4+7);
            }
        } else {
            cadastreNumbersFromCadNum(attributes, FIELDS.cadastreNumber);
        }
    } else {
        cadastreNumbersFromCadNum(attributes, FIELDS.cadastreNumber);
    }

    
}

function locatorResultItemBuilder(attributes){
    var builder = LOCATOR_RESULTITEM_BUILDER.headerRow;
    
    builder +=dojo.string.substitute(LOCATOR_RESULTITEM_BUILDER.itemRow, [attributes.ItemNumber,attributes.Match_addr]);

    if(attributes[FIELDS.locatorField] == "Settlement_Locator" || attributes[FIELDS.locatorField] == "Municipality2_Locator"){
        if(attributes[FIELDS.parentName])
        builder += dojo.string.substitute(LOCATOR_RESULTITEM_BUILDER.descriptionRow, [attributes[FIELDS.parentName]]);
    }
    else if(attributes[FIELDS.locatorField] == "Municipality1_Locator"){
        if(attributes[FIELDS.parentName])
            builder += dojo.string.substitute(LOCATOR_RESULTITEM_BUILDER.descriptionRow, [attributes[FIELDS.parentName]]);
        if(attributes[FIELDS.usrField])
            builder += dojo.string.substitute(LOCATOR_RESULTITEM_BUILDER.descriptionRow, [MUNIC_TYPES[attributes[FIELDS.usrField]]]);       
    }
    else builder += dojo.string.substitute(LOCATOR_RESULTITEM_BUILDER.descriptionRow, ['Субъект РФ']);
    
    return builder + LOCATOR_RESULTITEM_BUILDER.footerRow;
}

function showEmptyResultMessage() {
    dojo.byId('resultListPanel').style.display = 'none';
    dojo.byId('emptyResultPanel').style.display = '';
}

function showResultPanel() {
    dojo.byId('searchResultPanel').style.display = '';
}

function onQueryError(err){
    var error = err;
    clearAllSelectionPoint();
    /////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////
}

function addPointAttribute(features){
    for (var i in features) {
        if (features[i].attributes[FIELDS.addressId]) {
            features[i].point = new esri.geometry.Point(features[i].attributes[FIELDS.xCoord], features[i].attributes[FIELDS.yCoord], _map.spatialReference);
        }
        else {
            /*if (features[i].geometry) {
                features[i].point = new esri.geometry.Point(features[i].geometry.x, features[i].geometry.y, features[i].geometry.spatialReference);
            }
            else*/
            if (features[i].location) {
                features[i].point = new esri.geometry.Point(features[i].location.x, features[i].location.y, features[i].location.spatialReference);
                var value = LOCATOR_VALUES[features[i].attributes[FIELDS.locatorField]];
                features[i].attributes[FIELDS.locatorIntField] = value;
                //features[i].attributes[FIELDS.sortField] = 10 * value + getSettlementStatus(features[i].attributes[FIELDS.usrField]);
                
                //features[i].attributes[FIELDS.sortField] = dojo.string.pad(features[i].attributes[FIELDS.sortField],5,'0');
                //features[i].attributes[FIELDS.sortField]+=('_'+features[i].attributes[FIELDS.parentName]);
                //features[i].attributes[FIELDS.sortField]+=('_'+features[i].attributes[FIELDS.address]);
                //features[i].attributes[FIELDS.locatorNameField] = LOCATOR_NAMES[value];                   
            } else if(features[i].attributes.XC && features[i].attributes.YC){
                features[i].point = new esri.geometry.Point(features[i].attributes.XC, features[i].attributes.YC, _map.spatialReference);
            } else if(features[i].attributes.XMIN && features[i].attributes.YMIN){
                features[i].point = new esri.geometry.Point((features[i].attributes.XMAX+features[i].attributes.XMIN)/2, (features[i].attributes.YMAX+features[i].attributes.YMIN)/2, _map.spatialReference);
            }
        }
    }
}

function addAddressCandidates(addressCandidates){
    var candidate;  
    var symbol = new esri.symbol.SimpleMarkerSymbol();
      symbol.setStyle(esri.symbol.SimpleMarkerSymbol.STYLE_DIAMOND);
        symbol.setColor(new dojo.Color([255,0,0,0.75]));
        
    for (var i = 0, il = addressCandidates.length; i < il; i++) {
        candidate = addressCandidates[i];
        if (candidate.score > 70) {
            var attributes = [];
            attributes[FIELDS.xCoord] = candidate.location.x;
            attributes[FIELDS.yCoord] = candidate.location.y;
            attributes[FIELDS.score] = candidate.score;
            attributes[FIELDS.address] = candidate.address;
            candidate.location.spatialReference = _map.spatialReference;
            
            var graphic = new esri.Graphic(candidate.location, symbol, attributes);
            _map.graphics.add(graphic);
        }
    }
}

function searchParcelObject(objectType, query, forPrint) {
    _queryTask.execute(PortalObjectTypes.parcel, query, function (featureSet) {
        if (featureSet.features.length > 0) {

            addPointAttribute(featureSet.features);

            if (query.page > 1){
                _searchPagination.setDataForPage(featureSet.features, query.page);

                renderSearchList(_searchPagination.getCurrentItems(), objectType);
            } else{
                showResultList(objectType, featureSet.features, forPrint, featureSet.featuresCount);
            }

            if (_onSearchCompleted) {//Сработает только при идентификации
                if (_isSpatialSearch){
                    zoomToObjects(_searchResultObjects);
                    higlightCadastreObjects(objectType, getObjectIdField(objectType) + " IN " + query.cadNumbers.replace("[","(").replace("]",")"));
                }
                else {
                    _onSearchCompleted();
                    if (_searchResultObjects.length > 2){
                        zoomToObject(_searchResultObjects[0]);
                    }
                }
            }
            else if (featureSet.features.length == 1) {
                if (featureSet.features[0].attributes["OKS_FLAG"] === 1) {
                    searchResultItemClicked(PortalObjectTypes.oks, 1);
                }
                else {
                    searchResultItemClicked(objectType, 1);
                }

            }
        }
        else {
            showEmptyResultMessage();
            clearAllSelectionPoint();
        }
        showResultPanel();
    }, onQueryError);
}

var _isSpatialSearch = false;

function searchObject(objectType, whereClause, forPrint) {
    var query = new esri.tasks.Query();
    query.returnGeometry = true;
    query.outFields = ["*"];
    query.where = whereClause;

    _queryTask.execute(objectType, query, function (featureSet) {
        if (featureSet.features.length > 0) {
            _cadastreLayers["cadastre"].show();
            dojo.byId("cadastreCheckbox").checked = true;

            addPointAttribute(featureSet.features);
            showResultList(objectType, featureSet.features, forPrint);

            if (_onSearchCompleted) {//Сработает только при идентификации
                if (_isSpatialSearch){
                    higlightCadastreObjects(objectType, whereClause);
                    zoomToObjects(_searchResultObjects);
                }
                else{
                    _onSearchCompleted();
                    if (_searchResultObjects.length > 2){
                        zoomToObject(_searchResultObjects[0]);
                    }
                }
            }
            else if (featureSet.features.length == 1) {
                searchResultItemClicked(objectType, 1);
            }
        }
        else {
            showEmptyResultMessage();
        }
        showResultPanel();
    }, onQueryError);
}

function checkCadastreNumber(number) {
    var cadParts = number.split(":");
    if(cadParts[0].length <= 2 && isNumber(cadParts[0]))
        return true;
    else
        return false;
}

function isNumber(x)
{
    return !isNaN(dojo.number.parse(x));
}

function normalizeCadastreNumber(number) {
    var numberParts = number.split(":");
   
    number = '';

    for (var i = 0; i < numberParts.length; i++) {
        if (numberParts[i] != '*') {
            numberParts[i] = dojo.string.pad(numberParts[i], CADASTRE_NUMBER_PARTS_LENGTH[i], "0", false);
            number += ':' + numberParts[i];
        }
    }

    return number.substring(1);
}

function normalizeSearchCadastreNumber(number) {
    var numberParts = number.split(":");
   
    number = '';

    for (var i = 0; i < numberParts.length; i++) {
        if (numberParts[i] != '*') {
            numberParts[i] = dojo.string.pad(numberParts[i], CADASTRE_NUMBER_PARTS_LENGTH[i], "0", false);
            number += numberParts[i];
        }
    }

    return number;
}

function getIdField(cadastreType) {
    switch (cadastreType) {
        case PortalObjectTypes.cadastreOkrug:
            return FIELDS.cadastreOkrugId;
        case PortalObjectTypes.cadastreRayon:
            return FIELDS.cadastreRayonId;
        case PortalObjectTypes.cadastreKvartal:
            return FIELDS.cadastreKvartalId;
        case PortalObjectTypes.parcel:
            return FIELDS.parcelId;
        case PortalObjectTypes.oks:
            return FIELDS.oksId;
    }
}    
     
function getCadastreObjectType(cadastreNumber) {
    var cadParts = cadastreNumber.split(":");
        
    switch (cadParts.length) {
        case 1:
            return PortalObjectTypes.cadastreOkrug;
        case 2:
            if(cadParts[1].length > 2)
                return PortalObjectTypes.cadastreKvartal;
            else 
                return PortalObjectTypes.cadastreRayon;
        case 3:
            if(cadParts[1].length > 2)
                return PortalObjectTypes.parcel;
            else
                return PortalObjectTypes.cadastreKvartal;
        case 4:
            return PortalObjectTypes.parcel;
        case 5:
            return PortalObjectTypes.oks;
    }
}

function getAddressObjectType(addressId) {
    switch (addressId.split("|").length) {
        case 1:
            return PortalObjectTypes.subject;
        case 2:
            return PortalObjectTypes.mo1Level;
        case 3:
            return PortalObjectTypes.mo2Level;
        case 4:
            return PortalObjectTypes.settlement;
        case 5:
            return PortalObjectTypes.street;
        case 6:
            return PortalObjectTypes.building;
    }
}

function searchButtonClick(){
    _searchPagination = _searchPagination || initSearchPagination();
    _identifyParcelsCadnums = "";

    _searchPagination.setCurrentPage(1, {silent: true});

    if (dojo.hasClass('addressTabContent', 'portlet-content-wrap-active') && dojo.hasClass("searchExPanel", "searchExPanelOpenState")) {        
        __search(_addressSearchId, ACTIONS.SearchAddress);
        searchObject(getAddressObjectType(_addressSearchId), FIELDS.addressId + " like '" + _addressSearchId + "'");
    }
    else {
        var searchedText = dojo.byId("searchTextbox").value.replace(/^\s+|\s+$/g, '');
        
        if (checkCadastreNumber(searchedText)) {
            var cadastreType = getCadastreObjectType(searchedText);
            var cadastreNumber = normalizeCadastreNumber(searchedText);
            if(searchedText == '61:6:10104:12')
                __search(cadastreNumber, ACTIONS.SearchCadastreExample);
            else 
                __search(cadastreNumber, (cadastreType == PortalObjectTypes.parcel)?(ACTIONS.SearchParcel):(ACTIONS.SearchCadastre));
            
            
            if(cadastreType == PortalObjectTypes.parcel){
                searchParcelObject(cadastreType, {cadNumber: searchedText, onlyAttributes: false});
            }
            else {
                cadastreNumber = normalizeSearchCadastreNumber(searchedText);
                searchObject(cadastreType, getIdField(cadastreType) + " like '" + cadastreNumber + "%'");
            }
            
        }
        else if (checkCoordinate(searchedText)){
            searchCoordinate(searchedText);
        }
        else{
            _queryTask.addressToLocations({
                'SingleLine': searchedText
            }, function(addressCandidates){
                if (addressCandidates.length > 0) { 
                    if(searchedText === 'Москва, ул. Тверская 28')              
                        __search(searchedText, ACTIONS.GeocodingAddressExample);
                    else
                        __search(searchedText, ACTIONS.GeocodingAddress);
                    addPointAttribute(addressCandidates);
                    showResultList(PortalObjectTypes.addressLocator, addressCandidates);
                    
                }
                else {
                    showEmptyResultMessage();
                }
                showResultPanel();
            }, onQueryError);
        }
    }
}

var _isSearch;

function searchResultItemClicked(objectType, itemNumber){
    var selectedItem = _searchPagination.getItemByItemNumber(itemNumber);

    if (objectType == PortalObjectTypes.cadastreOkrug ||
    objectType == PortalObjectTypes.cadastreRayon ||
    objectType == PortalObjectTypes.cadastreKvartal ||
    objectType == PortalObjectTypes.parcel ||
    objectType == PortalObjectTypes.oks) {
        _map.infoWindow.hide();
        
        
        selectPoint([selectedItem.point], PIN_SYMBOL.load, true);
        
        var objectIdField = getObjectIdField(_searchResultObjectsType);

        //if (!_identifyEx){
            highlightObject(_searchResultObjectsType, selectedItem);
        //}
        
        _isSearch = true;
        var link = dojo.connect(_cadastreLayers["cadastre"], "onUpdate", selectedItem, function(){
            if (_isSearch) {
                showInfoWindow(objectType, this, _map.toScreen(this.point));
                _isSearch = false;
            }
            dojo.disconnect(link);
        });
        
        zoomToObject(selectedItem);
    }
    else 
        if (objectType == PortalObjectTypes.subject ||
        objectType == PortalObjectTypes.mo1Level ||
        objectType == PortalObjectTypes.mo2Level ||
        objectType == PortalObjectTypes.settlement ||
        objectType == PortalObjectTypes.street ||
        objectType == PortalObjectTypes.building) {
        
            selectPoint([selectedItem.point], PIN_SYMBOL.normal, true);
            
            var objectIdField = getObjectIdField(_searchResultObjectsType);
            highlightObject(_searchResultObjectsType, selectedItem);
            
            zoomToObject(selectedItem);
        }
        else 
            if (objectType == PortalObjectTypes.addressLocator) {
                selectPoint([selectedItem.point], PIN_SYMBOL.normal, true);
                zoomToObject(selectedItem);
            }
    _selectedObject = { objectType: objectType, object: selectedItem };
}
