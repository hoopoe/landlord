var _ga,_yam;

function __eventGui(eventAction, eventLabel){
	__event(null, eventAction, eventLabel);
}

function __event(cadastreNumber, eventAction, eventLabel){
	if(eventAction == ACTIONS.Service)
		__reachGoal(REACHES.Service, cadastreNumber);

	if(!eventLabel)
		eventLabel = '';
	
	var categoryName=(cadastreNumber)?("Кадастровый округ-"+cadastreNumber.split(':')[0]):(getCategoryName(eventAction));
	
	var index = window.location.href.indexOf('?');
	var href;
	if (index != -1)
		href = window.location.href.substring(0, index);
	else
		href = window.location.href;
		
	if(_gaq)		
		 _gaq.push(['_trackEvent',categoryName, getActionName(eventAction), eventLabel]);
	
	if(_yam)
		_yam.hit(href+'/'+categoryName+'/'+getActionName(eventAction)+'/'+eventLabel);
	
}

function getActionName(eventAction){	
	switch(eventAction){
		case ACTIONS.ShowInfoWindow:
			return 'Отображение окна информации';		
		case ACTIONS.TabClick:
			return 'Переключение вкладок';
		case ACTIONS.Service:
			return 'Переход на госуслуги';
		case ACTIONS.ShowExPanel:
			return 'Открытие панели поиска';
		case ACTIONS.ShowOverviewMap:
			return 'Открытие обзорной карты';	
		case ACTIONS.Toolbar:
			return 'Панель инструментов';	
		case ACTIONS.ChangeBasemap:
			return 'Смена базовой карты';	
		case ACTIONS.ChangeThematicMap:
			return 'Смена тематической карты';	
		case ACTIONS.SidebarShow:
			return 'Левая панель открыта';	
		case ACTIONS.SidebarHide:
			return 'Левая панель скрыта';	
		case ACTIONS.SearchCadastre:
			return 'Поиск по КД';	
		case ACTIONS.GeocodingAddress:
			return 'Геокодирование адреса';	
		case ACTIONS.SearchAddress:
			return 'Поиск адреса';
		case ACTIONS.SearchParcel:
			return 'Поиск ЗУ';
		case ACTIONS.LegendShowHide:
			return 'Легенда тем.карты';
		case ACTIONS.ZoomSlider:
			return 'Zoom slider';
		case ACTIONS.SearchCadastreExample:
			return 'Поиск ЗУ (пример)';
		case ACTIONS.GeocodingAddressExample:
			return 'Геокодирование адреса (пример)';
		case ACTIONS.Search:
			return 'Поиск';
	}
	return '---';
}

function getCategoryName(eventAction){	
	switch(eventAction){
		case ACTIONS.ShowInfoWindow:
		case ACTIONS.TabClick:
		case ACTIONS.Service:
			return 'Окно информации';
		
		case ACTIONS.ShowExPanel:
		case ACTIONS.ShowOverviewMap:
		case ACTIONS.Toolbar:
		case ACTIONS.ChangeBasemap:
		case ACTIONS.ChangeThematicMap:
		case ACTIONS.SidebarShow:
		case ACTIONS.SidebarHide:
		case ACTIONS.LegendShowHide:
		case ACTIONS.ZoomSlider:
			return 'Панель инструментов';
		
		case ACTIONS.SearchCadastre:
		case ACTIONS.GeocodingAddress:
		case ACTIONS.SearchAddress:
		case ACTIONS.SearchParcel:
		case ACTIONS.SearchCadastreExample:
		case ACTIONS.GeocodingAddressExample:
			return 'Поиск';
	}
	return 'Прочее';
}


function __hit(eventName, cadastreNumber){

}

function __reachGoal(reach, cadastreNumber){
	if(_gaq)
		_gaq.push(['_trackPageview', 'service?cadNumber='+cadastreNumber ]);
	if(_yam)
		_yam.reachGoal('service', cadastreNumber);
	//console.log('Цель:' + reach + '_' + cadastreNumber.split(':')[0]);
}

function __search(query, searchType){	
	
	__event((searchType == ACTIONS.SearchCadastre || searchType == ACTIONS.SearchCadastreExample || searchType == ACTIONS.SearchParcel)?(query):(null), ACTIONS.Search, getActionName(searchType));
	//console.log('Поиск: '+ getActionName(searchType));
}

var LABELS = { Identify: 'Идентификация', Search: 'Поиск'};
var REACHES = { Service: 'Service' };
var ACTIONS = { ShowExPanel: 1, ShowInfoWindow: 2, TabClick: 3, Service: 4, ShowOverviewMap: 5, Toolbar: 6, ChangeBasemap: 7, ChangeThematicMap: 8, SidebarShow: 9, SidebarHide: 10, SearchCadastre: 11, GeocodingAddress: 12, SearchAddress: 13, LegendShowHide: 14, ZoomSlider: 15, SearchCadastreExample: 16, GeocodingAddressExample: 17, SearchParcel: 18, Search: 100 };


