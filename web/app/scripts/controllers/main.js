'use strict';

/**
 * @ngdoc function
 * @name webApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the webApp
 */
angular.module('webApp')
  .controller('MainCtrl', function($rootScope, $scope, $http, CONFIG) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $rootScope.$on('selectLand', function(event, data) {
      var newExtent = null;
      if (data == 'beta') {
        newExtent = new esri.geometry.Extent(3318432.6374165327, 8341772.985917651, 3322951.9767140127, 8343683.911624831,
          new esri.SpatialReference({
            "wkid": 102113
          }));
      } else {
        newExtent = new esri.geometry.Extent(3320427.1661233706, 8343996.825709338, 3322686.835772111, 8344952.288562928,
          new esri.SpatialReference({
            "wkid": 102113
          }));
      }
      _map.setExtent(newExtent);
    });
    
    $scope.clear = function() {
        clearHighlightObject();
    }
        
    function isSold(t) {
      return t.desc == 's';
    }

    function isReserved(t) {
      return t.desc == 'r';
    }

    $scope.sold = function() {
      clearHighlightObject();
      $http({
        method: 'GET',
        url: CONFIG.ExcelAPI
      }).
      success(function(data, status) {
		var filtered = data.filter(isSold);
		if (filtered.length > 0) {
            var ids = filtered.map(function(item) {
              return "'" + item.id + "'";
            });
            var criteria = "PARCEL_ID IN (" + ids + ")";
            higlightCadastreObjects(PortalObjectTypes.parcel, criteria);
		}
      })
        .error(function(data, status) {
          console.log(data);
        });
    }

    $scope.reserved = function() {
      clearHighlightObject();
      $http({
        method: 'GET',
        url: CONFIG.ExcelAPI
      }).
      success(function(data, status) {
		var filtered = data.filter(isReserved);
		if (filtered.length > 0) {
            var ids = filtered.map(function(item) {
              return "'" + item.id + "'";
            });
            var criteria = "PARCEL_ID IN (" + ids + ")";
            higlightCadastreObjects(PortalObjectTypes.parcel, criteria);
		}
      })
        .error(function(data, status) {
          console.log(data);
        });
    }
  });