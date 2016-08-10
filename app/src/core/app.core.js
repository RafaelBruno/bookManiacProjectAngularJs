/**
* Core Modules
* @namespace app.core
* @desc FIX
*/
(function() {
  'use strict';

  angular.module('app.core', [
    /*
    * Angular modules
    */
    'ngSanitize',
    'ngCookies',
    'ngResource',
    'ui.router',
    /*
    * Core modules
    */
    'app.constants',
    'app.router'
  ])
})();
