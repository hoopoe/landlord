var _bookmarksList = [];

function getBookmarksItemTemplate(objectType){
	switch (objectType) {
		case PortalObjectTypes.cadastreOkrug:
			return RESULT_ITEM_HTML_TEMPLATE.okrugBookmark;
		case PortalObjectTypes.cadastreRayon:
			return RESULT_ITEM_HTML_TEMPLATE.rayonBookmark;
		case PortalObjectTypes.cadastreKvartal:
			return RESULT_ITEM_HTML_TEMPLATE.kvartalBookmark;
		case PortalObjectTypes.parcel:
			return RESULT_ITEM_HTML_TEMPLATE.parcelBookmark;
		case PortalObjectTypes.oks:
			return RESULT_ITEM_HTML_TEMPLATE.oksBookmark;
	}
}

function refreshBookmarksList(){
	var innerHtml = "";

    for (var i = 0; i < _bookmarksList.length; i++){
		if (!_bookmarksList[i].attributes.BookmarksItemNumber){
			for(var attr in _bookmarksList[i].attributes){
				if(_bookmarksList[i].attributes[attr] == "Null" ||
					typeof(_bookmarksList[i].attributes[attr]) === 'undefined' ||
					_bookmarksList[i].attributes[attr] == null){
					
					_bookmarksList[i].attributes[attr] = " ";				
				}
			}
        }
			_bookmarksList[i].attributes.BookmarksItemNumber = i + 1;

		innerHtml += dojo.string.substitute(getBookmarksItemTemplate(_bookmarksList[i].objectType), _bookmarksList[i].attributes);

	}

	dojo.byId("bookmarksList").innerHTML = innerHtml;

    if (_bookmarksList.length > 0){
        dojo.removeClass("bookmarksRemoveButton","bookmarks_removeButton_disabled");
        dojo.addClass("bookmarksRemoveButton","bookmarks_removeButton");

        dojo.removeClass("bookmarksExportCSV","bookmarks_exportCSVButton_disabled");
        dojo.addClass("bookmarksExportCSV","bookmarks_exportCSVButton");
    }
    else{
        dojo.removeClass("bookmarksRemoveButton","bookmarks_removeButton");
        dojo.addClass("bookmarksRemoveButton","bookmarks_removeButton_disabled");

        dojo.removeClass("bookmarksExportCSV","bookmarks_exportCSVButton");
        dojo.addClass("bookmarksExportCSV","bookmarks_exportCSVButton_disabled");
    }
}

function addToBookmarks(type, itemNumber){
	var item = _searchResultObjects[itemNumber - 1];
	item.objectType = type;
	
	if (dojo.indexOf(_bookmarksList, item) < 0){
		_bookmarksList.push(item);
	}
	
	refreshBookmarksList();
}

function addAllToBookamrks(){
	dojo.forEach(_searchResultObjects, function(item){
		item.objectType = _searchResultObjectsType;
		
		if (dojo.indexOf(_bookmarksList, item) < 0){
			_bookmarksList.push(item);
		}
	});
	
	refreshBookmarksList();
}

function bookmarksItemClicked(objectType, itemNumber){
		_map.infoWindow.hide();
		
		var item = _bookmarksList[itemNumber - 1];
		selectPoint([item.point], PIN_SYMBOL.load, true);
		
		var objectIdField = getObjectIdField(objectType);
		highlightObject(objectType, item);
		
		_isSearch = true;
		var link = dojo.connect(_cadastreLayers["cadastre"], "onUpdate", item, function(){
			if (_isSearch) {
				showInfoWindow(objectType, this, _map.toScreen(this.point));
				_isSearch = false;
			}
			dojo.disconnect(link);
		});
		
		zoomToObject(_bookmarksList[itemNumber - 1]);

	_selectedObject = { objectType: objectType, object: _bookmarksList[itemNumber - 1] };
}

function removeFromBookmars(itemNumber){
	_bookmarksList.splice(itemNumber-1,1);

	refreshBookmarksList();
}

function clearBookmars(){
	_bookmarksList = [];
	refreshBookmarksList();
}

function saveBookmarksToCsv(){
	if (_bookmarksList.length > 0){
		var csv = dojo.map(_bookmarksList, function(item){
			return item.attributes[FIELDS.cadastreNumber];
		});

		//if(_bookmarksList.length > 256){
		//	alert("Количество записей в сохраняемом файле: " + _bookmarksList.length + ". Максимальное количество записей для последующей загрузки: 256");
		//}

		dojo.byId("bookmarksDownloadCsvInput").value = csv.join(";");
		dojo.byId("bookmarksDownloadForm").submit();
		//open(DOWNLOAD_SERVICE + param.join(";"),"_self");
	}
}

function checkCSV(data){
	if (data.length > 256)  {
		return -1;
	}

	return 1;
}

function alertErrorMessage(e){
	switch(e){
		case 0:
			alert("Файл имеет неверный формат");
			break;
		case -1:
			alert("Вы пытаетесь загрузить слишком большой файл. Максимальное количество записей 256.");
			break;
	}

}

function loadBookmarsFromCsv(e){
	if (window.File && window.FileReader && window.FileList && window.Blob) {
		dojo.byId("bookmarksLoader").style.display = "";

		_bookmarksList = [];
		
		var file =  e.target.files[0];
		
		if (file.name.indexOf(".csv") !== -1) {
			var reader = new FileReader();
			reader.onload = function() {
				var e = checkCSV(reader.result);

				if (e > 0){
					var csvArray = dojo.map(reader.result.replace(/\s+/g, "").split(";"), function(item){
						return "'" + item + "'";
					});

					query = new esri.tasks.Query();
					query.returnGeometry = true;
					query.outFields = ["*"];
					query.where = FIELDS.cadastreNumber + " IN (" + csvArray.toString() + ")";

					_queryTask.execute(PortalObjectTypes.parcel, {cadNumbers: "[" + csvArray + "]", onlyAttributes: false}, function (featureSet) {
						addPointAttribute(featureSet.features);
									
						dojo.forEach(featureSet.features, function (item){
							item.objectType = PortalObjectTypes.parcel;
							_bookmarksList.push(item);
						});
								
						if (_bookmarksList.length == csvArray.length){								
							refreshBookmarksList();
						}
						else{
							_queryTask.execute(PortalObjectTypes.oks, query, function (featureSet) {
								addPointAttribute(featureSet.features);
									
								dojo.forEach(featureSet.features, function (item){
									item.objectType = PortalObjectTypes.oks;
									_bookmarksList.push(item);
								});
								
								if (_bookmarksList.length == csvArray.length){								
									refreshBookmarksList();
								}
								else{
									_queryTask.execute(PortalObjectTypes.cadastreKvartal, query, function (featureSet) {
										addPointAttribute(featureSet.features);
									
										dojo.forEach(featureSet.features, function (item){
											item.objectType = PortalObjectTypes.cadastreKvartal;
											_bookmarksList.push(item);
										});
										
										if (_bookmarksList.length == csvArray.length){								
											refreshBookmarksList();
										}
										else{
											_queryTask.execute(PortalObjectTypes.cadastreRayon, query, function (featureSet) {
												addPointAttribute(featureSet.features);
											
												dojo.forEach(featureSet.features, function (item){
													item.objectType = PortalObjectTypes.cadastreRayon;
													_bookmarksList.push(item);
												});
												
												if (_bookmarksList.length == csvArray.length){								
													refreshBookmarksList();
												}
												else{
													_queryTask.execute(PortalObjectTypes.cadastreOkrug, query, function (featureSet) {
														addPointAttribute(featureSet.features);
											
														dojo.forEach(featureSet.features, function (item){
															item.objectType = PortalObjectTypes.cadastreOkrug;
															_bookmarksList.push(item);
															
															refreshBookmarksList();
														});
													});
												}
											});
										}
									});
								}
							});
						}
					}, function(){
                        alertErrorMessage(e);
                    });

				}
                else{
                    alertErrorMessage(e);
                }

				dojo.byId("bookmarksLoader").style.display = "none";
			};
        
			reader.readAsText(file);
		}
        else{
            alertErrorMessage();
        }
	}
	else {
		alert('Работа с файлами не поддерживается вашим браузером. Поддерживаемые браузеры: IE 10.0 , Firefox 6.0, Chrome 13.0, Safari 5.1 и выше.');
	}

	dojo.byId("bookmarksFileButton").value = null;
}

function showFileDialog(){
	var fileButton = dojo.byId("bookmarksFileButton");
	
	dojo.connect(fileButton, "change", loadBookmarsFromCsv);
	fileButton.click();
}

