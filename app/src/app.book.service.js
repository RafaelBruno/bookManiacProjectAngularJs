/**
* app.book.service
* @namespace bookService
*/

(function() {
  'use strict';

  angular.module('app.book.service', [])
  .factory('bookService', bookService);
  bookService.$inject = ['toastr', '$http', '$log', '$q', 'queryStorage'];

  function bookService(toastr, $http, $log, $q, queryStorage) {
    var service = {
      openLibrarySearch : openLibrarySearch,
      save : save,
      update : update,
      deleteBook : deleteBook,
      getAll : getAll,
      getChartData : getChartData,
    };

    return service;

    ///////////////////////

    /**
    * @namespace openLibrarySearch
    */
    function openLibrarySearch(title){
      var searchTitle = title.replace(/ /g, '+');
      return $http.get("http://openlibrary.org/search.json?title="+searchTitle)
      .then(function (res) {
        return res.data;
      }, function (res) {
        toastr.error("data.service|ERRO: openLibrarySearch");
        $log.error(res);
        return res;
      });
    }

    /**
    * @namespace save
    */
    function save(book){
      var def = $q.defer();
      def.resolve(queryStorage.save(book));
      return def.promise;
    }

    /**
    * @namespace update
    */
    function update(book){
      var def = $q.defer();
      def.resolve(queryStorage.update(book));
      return def.promise;
    }

    /**
    * @namespace deleteBook
    */
    function deleteBook(book){
      var def = $q.defer();
      def.resolve(queryStorage.del(book));
      return def.promise;
    }

    /**
    * @namespace getAll
    */
    function getAll(){
      var def = $q.defer();
      def.resolve(queryStorage.getAll());
      return def.promise;
    }

    /**
    * @namespace getChartData
    */
    function getChartData(allBooks){
      var def = $q.defer();

      var groupByYear = _.chain(allBooks)
      .reject(function(book){return !book.read})
      .groupBy(function(book) {
        if(book.read){
          return book.read.readDate.split("/")[2];
        }
      })
      .map(function(books, key){
        return [key, books.length]
      })
      .value();


      groupByYear.unshift(['Years', 'Books']);

      def.resolve(groupByYear);
      return def.promise;
    }

  }
})();
