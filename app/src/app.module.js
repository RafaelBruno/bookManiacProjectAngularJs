/**
* DevGrid Project Module
* @namespace app.module
* @desc FIX
*/


(function() {
  'use strict';

  angular.module('app',
  [
    'app.core',
    /*
    * Components
    */
    'app.controller',
    'app.book.service',
    'app.query.storage',
    'directive.input.date',
    'directive.books.chart',
    /*
    * Directives
    */
  ]);

})();
