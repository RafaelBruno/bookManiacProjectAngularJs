(function() {
  'use strict';

  /**
  * @name input-date
  * @example <input books-chart />
  */
  angular.module('directive.books.chart', [])
  .directive('booksChart', booksChart);

  booksChart.$inject = ['bookService', 'queryStorage'];

  function booksChart(bookService, queryStorage) {

    return directive;

    function directive(scope, element, attrs){

      var allBooks = queryStorage.getAll();

      bookService.getChartData(allBooks).then(function(chartData){
        google.charts.setOnLoadCallback(drawChart);
        function drawChart() {
          var data = google.visualization.arrayToDataTable(chartData);

          var options = {
            chart: {
              title: 'Books Read',
              subtitle: 'Books Read by Year',
            }
          };


          var chart = new google.charts.Bar(element.get(0));

          chart.draw(data, options);
        }

      });
    }
  }

})();
