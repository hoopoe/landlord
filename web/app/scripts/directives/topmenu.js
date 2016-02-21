'use strict';

/**
 * @ngdoc directive
 * @name webApp.directive:topMenu
 * @description
 * # topMenu
 */
angular.module('webApp')
  .directive('topMenu', function () {
    return {
      templateUrl: 'views/topmenu.html',
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        // element.text('this is the topMenu directive');
        console.log("test");
      }
    };
  });
