'use strict';

/**
 * @ngdoc service
 * @name webApp.CONFIG
 * @description
 * # CONFIG
 * Service in the webApp.
 */
angular.module('webApp')
  .constant('CONFIG', {
    // AngularJS will instantiate a singleton by calling "new" on this function
    'GetGKN': "http://maps.rosreestr.ru/arcgis/rest/services/Cadastre/CadastreSelected/MapServer/exts/GKNServiceExtension/online/parcel/find?cadNums=['{0}']&onlyAttributes=false&returnGeometry=true&f=json",
    'ExcelAPI': "http://169.55.85.43:3000/excel/{0}", //todo: fix hardcoded ip
    'Excel_PlaceA': "1FQLeGffcQq9ipQdRx7VA_ZeaW4l7FnHic384dhxcw2M",
    'Excel_PlaceB': "1wwP1qVpfAHNuB9OTNKdEkxJtORdKPmlVcRtV3cVNI6I"
  });
