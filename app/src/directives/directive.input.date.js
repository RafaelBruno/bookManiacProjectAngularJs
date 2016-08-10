(function() {
  'use strict';

  /**
  * @name input-date
  * @example <input input-date />
  */
  angular.module('directive.input.date', [])
  .directive('inputDate', inputDate);

  function inputDate() {
    return directive;

    function directive(scope, element, attrs) {
      $(element).mask('00/00/0000');
    }
  }

})();
