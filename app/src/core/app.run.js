/**
* Run Module
* @namespace app.run
*/

(function() {
  'use strict';

  angular.module('app')
  .run(Run);

  Run.$inject = ['$rootScope'];

  function Run ($rootScope) {
    /*START GOOGLE CHART*/
    google.charts.load('current', {'packages':['bar']});

    $rootScope.goTo = goTo;

    /**
    * @namespace goTo
    */
    function goTo(url){
      $('.modal').modal('hide');
      setTimeout(function () {
        window.location.replace("#/"+url);
      }, 300);
    };

  }
})();
