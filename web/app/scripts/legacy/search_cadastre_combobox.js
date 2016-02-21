var _noDataStore;

function buildCadastreComboboxStore(objectType,features, isAllEnabled) {
    var array = [];

    if (features != null) {
        for (var i = 0; i < features.length; i++) {
            if (features[i].attributes[FIELDS.cadastreNumber] || features[i].attributes[FIELDS.oksCadastreNumber]) {
                var obj = { objectNumber: null, name: null, value: null };
				var cadNumber = features[i].attributes[FIELDS.cadastreNumber].split(':');
                switch (objectType) {
                    case PortalObjectTypes.cadastreOkrug:
                        obj.objectNumber = cadNumber[0];
                        obj.name = cadNumber[0] + " - " + features[i].attributes[FIELDS.name];
                        break;
                    case PortalObjectTypes.cadastreRayon:
                        obj.objectNumber = cadNumber[1];
                        obj.name = cadNumber[1] + " - " + features[i].attributes[FIELDS.name];
                        break;
                    case PortalObjectTypes.cadastreKvartal:
                        obj.objectNumber = cadNumber[2];
                        obj.name = cadNumber[2];
                        break;
                    case PortalObjectTypes.parcel:
                        obj.objectNumber = cadNumber[3];
                        obj.name = cadNumber[3];
                        break;
					//case PortalObjectTypes.oks:
                    //    obj.objectNumber = features[i].attributes[FIELDS.oksNumber];
                    //    obj.name = features[i].attributes[FIELDS.oksNumber];
					//	obj.value = features[i].attributes[FIELDS.objectId] + '__' + features[i].attributes[FIELDS.oksCadastreNumber];
                    //    break;
                }
				
				if (obj.value == null){
					obj.value = features[i].attributes[FIELDS.objectId] + '__' + features[i].attributes[FIELDS.cadastreNumber];
				}

                array.push(obj);
            }
        }

        array.push({ name: "-Не выбрано-", value: "-1", objectNumber: -1 });

    }
    else {
        array.push({ name: "-Нет данных-", value: "-1" });
    }

    if (isAllEnabled)
        array.push({ name: "-Все-", value: "-2", objectNumber: -2});

    array.sort(function (item1, item2) {
        if (!item1.objectNumber)
            item1.objectNumber = "";
        if (!item2.objectNumber)
            item2.objectNumber = "";

        var val1 = item1.objectNumber;
        var val2 = item2.objectNumber;

        if (val1 == val2)
            return 0;
        if (val1 > val2)
            return 1;
        if (val1 < val2)
            return -1;
    });



    var store = new dojo.data.ItemFileReadStore({
        data: { 
            identifier: 'value',
            label: 'name',
            items: array
        }
    });

    store.close();
    return store;
}

function onCadastreComboboxFillError() {
    /////////////////////////
}

function fillCadastreComobobox(objectType, whereClause, comboboxId) {
    var query;
	if(objectType == PortalObjectTypes.parcel){
		query = whereClause;
	} else {
		query = new esri.tasks.Query();
		query.returnGeometry = false;
		query.outFields = ['*'/*FIELDS.cadastreOkrugNumber,
							FIELDS.cadastreRayonNumber,
							FIELDS.cadastreKvartalNumber,
							FIELDS.parcelNumber,
							FIELDS.oksNumber,
							FIELDS.name,
							FIELDS.objectId,
							FIELDS.cadastreNumber,
							FIELDS.oksCadastreNumber*/];
		query.where = whereClause;
	}
	
	_queryTask.execute(objectType, query, function (featureSet) {
		var store = buildCadastreComboboxStore(objectType, featureSet.features,
			objectType != PortalObjectTypes.cadastreOkrug);
		
		var comboBox = dijit.byId(comboboxId);
		comboBox.queryExpr = "*${0}*";
		comboBox.attr('store', store);
		comboBox.setValue("-1");
		comboBox.setDisabled(false);				
	}, onCadastreComboboxFillError);
	
}



function getComboboxId(objectType) {
    switch (objectType) {
        case PortalObjectTypes.cadastreOkrug:
            return ['cadastreOkrugCombobox', 'cadastreRayonCombobox', 'cadastreKvartalCombobox', 'parcelCombobox'];//, 'oksCombobox'];
        case PortalObjectTypes.cadastreRayon:
            return ['cadastreRayonCombobox', 'cadastreKvartalCombobox', 'parcelCombobox'];//, 'oksCombobox'];
        case PortalObjectTypes.cadastreKvartal:
            return ['cadastreKvartalCombobox', 'parcelCombobox'];//, 'oksCombobox'];
        case PortalObjectTypes.parcel:
            return ['parcelCombobox'];//, 'oksCombobox'];
		//case PortalObjectTypes.oks:
        //    return ['oksCombobox'];
        case PortalObjectTypes.subject:
            return ['addressSubjectCombobox', 'addressMO1LevelCombobox', 'addressMO2LevelCombobox', 'addressSettlementCombobox'];
        case PortalObjectTypes.mo1Level:
            return ['addressMO1LevelCombobox', 'addressMO2LevelCombobox', 'addressSettlementCombobox'];
        case PortalObjectTypes.mo2Level:
            return ['addressMO2LevelCombobox', 'addressSettlementCombobox'];
        case PortalObjectTypes.settlement:
            return ['addressSettlementCombobox'];
        case PortalObjectTypes.street:
            return null;
        case PortalObjectTypes.building:
            return null;
    }
}

function initializeSearchComboboxes() {
    initializeCadastreComboboxes();
    initializeAddressComboboxes();
}

function initializeCadastreComboboxes() {
    _noDataStore = buildCadastreComboboxStore(null, null, false);

    comboBox = dijit.byId('cadastreOkrugCombobox');
    comboBox.attr('store', _noDataStore);
    comboBox.setValue("-1");
    comboBox.setDisabled(true);

    comboBox = dijit.byId('cadastreRayonCombobox');
    comboBox.attr('store', _noDataStore);
    comboBox.setValue("-1");
    comboBox.setDisabled(true);

    comboBox = dijit.byId('cadastreKvartalCombobox');
    comboBox.attr('store', _noDataStore);
    comboBox.setValue("-1");
    comboBox.setDisabled(true);

    comboBox = dijit.byId('parcelCombobox');
    comboBox.attr('store', _noDataStore);
    comboBox.setValue("-1");
    comboBox.setDisabled(true);
	
	//comboBox = dijit.byId('oksCombobox');
    //comboBox.attr('store', _noDataStore);
    //comboBox.setValue("-1");
    //comboBox.setDisabled(true);

    fillCadastreComobobox(PortalObjectTypes.cadastreOkrug, '1=1', getComboboxId(PortalObjectTypes.cadastreOkrug)[0]);
}

function getCadastreNumberPartCount(objectType) {
    switch (objectType) {
        case PortalObjectTypes.cadastreOkrug:
            return 1;
        case PortalObjectTypes.cadastreRayon:
            return 2;
        case PortalObjectTypes.cadastreKvartal:
            return 3;
        case PortalObjectTypes.parcel:
            return 4;
		case PortalObjectTypes.oks:
            return 5;			
    }
}

function disableComboboxes(comboboxesId) {
    for (var i = 0; i < comboboxesId.length; i++) {
        var comboBox = dijit.byId(comboboxesId[i]);  
		comboBox.attr('store', _noDataStore);
		comboBox.setValue("-1");
		comboBox.setDisabled(true);
    }
}

function cadastreComboboxChanged(childObjectType, value) {
    disableComboboxes(getComboboxId(childObjectType));        
	
    if (value != '-1' && value != '-2') {
        var cadastreNumber = value.substring(value.indexOf("__") + 2);
		//cadastreNumber = normalizeSearchCadastreNumber(cadastreNumber);
		 if(childObjectType == PortalObjectTypes.parcel){
			fillCadastreComobobox(childObjectType, { cadNumber: cadastreNumber + ":%", onlyAttributes: true, onlyIds: true}, getComboboxId(childObjectType)[0]);
		} else { 
			fillCadastreComobobox(childObjectType,  FIELDS.cadastreNumber + " like '" + cadastreNumber + ":%'", getComboboxId(childObjectType)[0]);
		}
   }
}

function cadastreOkrugComboboxChanged(value) {
    cadastreComboboxChanged(PortalObjectTypes.cadastreRayon, value); 
	setSearchTextbox();
}

function cadastreRayonComboboxChanged(value) {
    cadastreComboboxChanged(PortalObjectTypes.cadastreKvartal, value);
	setSearchTextbox();
}

function cadastreKvartalComboboxChanged(value) {
    cadastreComboboxChanged(PortalObjectTypes.parcel, value);
	setSearchTextbox();
}

function parcelComboboxChanged(value) {
	//cadastreComboboxChanged(PortalObjectTypes.oks, value);
    setSearchTextbox();
}

//function oksComboboxChanged(value) {
//    setSearchTextbox();
//}

function setSearchTextbox(){
	var ids = getComboboxId(PortalObjectTypes.cadastreOkrug);	
	var value = null, i;
	for(i = 0; i < ids.length; i++){
		value = dijit.byId(ids[i]).value;
		if(value == '-1' || value == '-2'){
			i--;
			break;
		}		
	}
	if(i == ids.length)
		i--;		
	var numb;	
	if(i == -1)
		numb = '';
	else {
		numb =  dijit.byId(ids[i]).value;
		numb = numb.substring(numb.indexOf("__") + 2);
		if(value == '-2')
			numb += ':*';
	}
	dojo.byId('searchTextbox').value = numb;
}
