'use strict';

/**
 * @ngdoc function
 * @name webApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the webApp
 */
angular.module('webApp')
  .controller('MainCtrl', function ($scope, $http, CONFIG) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    
    $scope.getGExcel = function(){
        $http({
            method: 'GET',
            url: CONFIG.ExcelAPI
        }).
        success(function(data, status) {
            var ids = data.map(function(item) {
                return "'" + item.id + "'";
            });
            
            var criteria = "PARCEL_ID IN (" + ids + ")";
            higlightCadastreObjects(PortalObjectTypes.parcel, criteria);
        })
        .error(function(data, status) {
            console.log(data);
        });
    }
  });
