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
    
    $scope.getInfo = function(){
        console.log("get info");
        $http({
            method: 'GET',
            url: CONFIG.GetGKN.format('47:14:1261001:17')
        }).
        success(function(data, status) {
            console.log(data);   
        })
        .error(function(data, status) {
            console.log(data);
        });
    }
  });
