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

    $scope.placeTitle = "Place A";
    $scope.excelId = CONFIG.Excel_PlaceA;

    $rootScope.$on('selectLand', function(event, data) {
      var newExtent = null;
      if (data == 'beta') {
        $scope.placeTitle = "Place B";
        $scope.excelId = CONFIG.Excel_PlaceB;
        newExtent = new esri.geometry.Extent(3318432.6374165327, 8341772.985917651, 3322951.9767140127, 8343683.911624831,
          new esri.SpatialReference({
            "wkid": 102113
          }));
      } else {
        $scope.placeTitle = "Place A";
        $scope.excelId = CONFIG.Excel_PlaceA;
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
      // var criteria = "PARCEL_ID IN ('47:14:1261001:17', '47:14:1261001:29')";
      // higlightCadastreObjects(PortalObjectTypes.parcel, criteria);
      $http({
        method: 'GET',
        url: CONFIG.ExcelAPI.format($scope.excelId)
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
        url: CONFIG.ExcelAPI.format($scope.excelId)
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