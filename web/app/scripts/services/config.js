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
    'GetGKN': "http://maps.rosreestr.ru/arcgis/rest/services/Cadastre/CadastreSelected/MapServer/exts/GKNServiceExtension/online/parcel/find?cadNums=['{0}']&onlyAttributes=false&returnGeometry=true&f=json"
  });
