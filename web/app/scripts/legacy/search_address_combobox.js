function buildAddressComboboxStore(objectType, features, isAllEnabled) {
    var array = [];

    if (features != null && features.length) {
        for (var i = 0; i < features.length; i++) {
            var obj = { id: null, name: null, value: null };

            switch (objectType) {
                case PortalObjectTypes.subject:
                    obj.id = features[i].attributes[FIELDS.subjectId];
                    obj.name = features[i].attributes[FIELDS.addressName];
                    break;
                case PortalObjectTypes.mo1Level:
                    obj.id = features[i].attributes[FIELDS.mo1LevelId];
                    obj.name = features[i].attributes[FIELDS.addressName];
                    break;
                case PortalObjectTypes.mo2Level:
                    obj.id = features[i].attributes[FIELDS.mo2LevelId];
                    obj.name = features[i].attributes[FIELDS.addressName];
                    break;
                case PortalObjectTypes.settlement:
                    obj.id = features[i].attributes[FIELDS.settlementId];
                    obj.name = features[i].attributes[FIELDS.addressName];
                    break;
            }

            obj.value = features[i].attributes[FIELDS.objectId] + '__' + features[i].attributes[FIELDS.addressId]
				  + ((features[i].attributes[FIELDS.hasMO2Level] != null) ? ('__' + features[i].attributes[FIELDS.hasMO2Level]) : (''));
			obj.isCenter = features[i].attributes[FIELDS.isCenter];
            array.push(obj);
        }

        array.push({ name: "-Не выбрано-", value: "-1", isCenter:0 });

    }
    else {
        array.push({ name: "-Нет данных-", value: "-1", isCenter:0 });		
    }

    if (isAllEnabled)
        array.push({ name: "-Все-", value: "-2", isCenter:0 });

	
	array.sort(sortByName);	
	//if(objectType == PortalObjectTypes.settlement)
	//	array = groupByCenter(array);
		
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

function groupByCenter(array){
	var matrix = [];
	for(var i in array){
		if(i){
			var status = getSettlementStatus(array[i].isCenter);
			if(!matrix[status])
				matrix[status] = [];
			matrix[status].push(array[i]);
		}
	}
	var newArray = [];
	for(var i in matrix){		
		for(var j in matrix[i]){
			newArray.push(matrix[i][j]);
		}
	}
	return newArray;
}

function sortByName(item1, item2) {
	if (!item1.name)
		item1.name = "";
	if (!item2.name)
		item2.name = "";

	var val1 = item1.name;
	var val2 = item2.name;

	if (val1 == val2)
		return 0;
	if (val1 > val2)
		return 1;
	if (val1 < val2)
		return -1;
}

function equalCenter(val1,val2){
	var a = getSettlementStatus(val1.isCenter);
	var b = getSettlementStatus(val2.isCenter);
	
	return a-b;
}

function getSettlementStatus(val){
	if(typeof(val) == 'undefined')
		return 0;
	if(val == 100)
		return 0;
	if((val / 8) | 0 == 1)
		return 1;
	if((val / 4) | 0 == 1)
		return 2;
	if((val / 2) | 0 == 1)
		return 3;
	return 4;
}

function onAddressComboboxFillError() {
    /////////////////////////
}

function fillAddressComobobox(objectType, whereClause, comboboxId) {
    var query = new esri.tasks.Query();
    query.returnGeometry = false;
    query.outFields = ['*'];
    query.where = whereClause;

    _queryTask.execute(objectType, query,
			function (featureSet) {
			    var store = buildAddressComboboxStore(objectType, featureSet.features,
					objectType != PortalObjectTypes.subject);

			    var comboBox = dijit.byId(comboboxId);
			    comboBox.queryExpr = "*${0}*";
			    comboBox.attr('store', store);
			    comboBox.setValue("-1");
			    comboBox.setDisabled(!featureSet.features.length);
			    comboBox.focus();
			}, onCadastreComboboxFillError);

}

function initializeAddressComboboxes() {
    store = buildAddressComboboxStore(null, null, false);

    comboBox = dijit.byId('addressSubjectCombobox');
    comboBox.attr('store', store);
    comboBox.setValue("-1");
    comboBox.setDisabled(true);

    comboBox = dijit.byId('addressMO1LevelCombobox');
    comboBox.attr('store', store);
    comboBox.setValue("-1");
    comboBox.setDisabled(true);

    comboBox = dijit.byId('addressMO2LevelCombobox');
    comboBox.attr('store', store);
    comboBox.setValue("-1");
    comboBox.setDisabled(true);

    comboBox = dijit.byId('addressSettlementCombobox');
    comboBox.attr('store', store);
    comboBox.setValue("-1");
    comboBox.setDisabled(true);
	
    fillAddressComobobox(PortalObjectTypes.subject, '1=1', getComboboxId(PortalObjectTypes.subject)[0]);
	fillAddressComobobox(PortalObjectTypes.settlement, 'IsCenter>=4', getComboboxId(PortalObjectTypes.settlement)[0]);
}

function getChildObjectType(objectType) {
    switch (objectType) {
        case PortalObjectTypes.cadastreOkrug:
            return PortalObjectTypes.cadastreRayon;
        case PortalObjectTypes.cadastreRayon:
            return PortalObjectTypes.cadastreKvartal;
        case PortalObjectTypes.cadastreKvartal:
            return PortalObjectTypes.parcel;
        case PortalObjectTypes.parcel:
            return null;
        case PortalObjectTypes.subject:
            return PortalObjectTypes.mo1Level;
        case PortalObjectTypes.mo1Level:
            return PortalObjectTypes.mo2Level;
        case PortalObjectTypes.mo2Level:
            return PortalObjectTypes.settlement;
		case PortalObjectTypes.settlement:
            return null;
    }
}

function getAddressIdPartCount(objectType) {
    switch (objectType) {
        case PortalObjectTypes.subject:
            return 1;
        case PortalObjectTypes.mo1Level:
            return 2;
        case PortalObjectTypes.mo2Level:
            return 3;
        case PortalObjectTypes.settlement:
            return 4;
    }
}

var _addressSearchId;

function addressComboboxChanged(childObjectType, value, center) {
    if (value == '-1') {
        disableComboboxes(getComboboxId(childObjectType));
    }
    else if (value == '-2') {
        var addressIdParts = _addressSearchId.split('|');
        var addressId = '';
        var addressIdPartCount = getAddressIdPartCount(childObjectType);

        for (var i = 0; i < addressIdPartCount - 2; i++) {
            addressId += addressIdParts[i] + '|';
        }
        _addressSearchId = addressId + '%';

        disableComboboxes(getComboboxId(childObjectType));
    }
    else {
        var valueParts = value.split('__');
        _addressSearchId = valueParts[1];
        var whereCenter = "";

        if (center)
            whereCenter = " AND " + FIELDS.isCenter + ">" + 0;

        fillAddressComobobox(childObjectType,
			FIELDS.addressId + " like '" + _addressSearchId + "|%'" + whereCenter,
			getComboboxId(childObjectType)[0]);
    }
}

function addressSubjectComboboxChanged(value) {
    addressComboboxChanged(PortalObjectTypes.mo1Level, value);
    if(value == '-1')
		fillAddressComobobox(PortalObjectTypes.settlement, 'IsCenter>=4', getComboboxId(PortalObjectTypes.settlement)[0]);
	else
		addressComboboxChanged(PortalObjectTypes.settlement, value, true);
}

function addressMO1LevelComboboxChanged(value) {
    var valueParts = value.split('__');
	//if hasn't mo2-level
	if(valueParts[2] == '0'){
		var store = buildAddressComboboxStore(null, null, false);
		var comboBox = dijit.byId('addressMO2LevelCombobox');		
		comboBox.attr('store', store);
		comboBox.setValue("-1");
		comboBox.setDisabled(true);		
	}		
	else 
		addressComboboxChanged(PortalObjectTypes.mo2Level, value);
	
	if(value == '-1'){
		value = dijit.byId(getComboboxId(PortalObjectTypes.subject)[0]).value;
		addressComboboxChanged(PortalObjectTypes.settlement, value, (value.split('__')[2] != '0'));	
	}else 	
		addressComboboxChanged(PortalObjectTypes.settlement, value, (valueParts[2] != '0'));
}

function addressMO2LevelComboboxChanged(value) {
    if(value == '-1'){
		value = dijit.byId(getComboboxId(PortalObjectTypes.mo1Level)[0]).value;
		addressComboboxChanged(PortalObjectTypes.settlement, value, (value.split('__')[2] != '0'));	
	}
	else 	
		addressComboboxChanged(PortalObjectTypes.settlement, value);
}

function addressSettlementComboboxChanged(value) {
    if (value == '-1') {    
	}
    else if (value == '-2') {
        _addressSearchId += ((_addressSearchId.split('|').length == 3) ? ('|%') : ('||%'));
       // disableComboboxes(getComboboxId(childObjectType));
    }
    else {
        var valueParts = value.split('__');
        _addressSearchId = valueParts[1];
    }
}