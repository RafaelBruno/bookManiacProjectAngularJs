/**
* Router
* @namespace app.router
* @desc FIX
*/
(function() {
  'use strict';

  angular.module('app.router', [])
  .config(Routes);
  Routes.$inject = ['$stateProvider', '$urlRouterProvider'];

  function Routes($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/content");
    $stateProvider
    .state('content', {
      url: "/content",
      controller: 'controller',
      controllerAs: 'ctrl',
      templateUrl: "/app/src/view/content.html"
    })
    .state('chart', {
      url: "/chart",
      controller: 'controller',
      controllerAs: 'ctrl',
      templateUrl: "/app/src/view/chart.html"
    })
  }
})();
