/**
* app.query.storage
* @namespace queryStorage
*/

(function() {
  'use strict';

  angular.module('app.query.storage', [])
  .factory('queryStorage', queryStorage);
  queryStorage.$inject = ['toastr', '$log'];

  function queryStorage(toastr, $log) {

    var query = {
      save : save,
      del : del,
      update : update,
      saveAll : saveAll,
      getAll : getAll,
      getById : getById
    };

    return query;

    /**
    * @namespace save
    */
    function save(bookSelect){
      var allBooks = getAll();

      allBooks.push(bookSelect);
      saveAll(allBooks);

      return allBooks;
    }

    /**
    * @namespace del
    */
    function del(bookSelect){
      var allBooks = getAll();
      allBooks = allBooks.filter(function(book){ return book.id !== bookSelect.id });
      saveAll(allBooks);
      return allBooks;
    }

    /**
    * @namespace update
    */
    function update(bookSelect){
      var allBooks = getAll();
      allBooks = allBooks.map(function(book){
        if(book.id === bookSelect.id ){
          return bookSelect;
        }
        return book;
      });
      saveAll(allBooks);

      return allBooks;
    }

    /**
    * @namespace saveAll
    */
    function saveAll(books){
      accessLocalStorage().setItem('books', angular.toJson(books));
    }

    /**
    * @namespace getAll
    */
    function getAll(){
      var allBooks = angular.fromJson(accessLocalStorage().getItem('books'));

      if(typeof allBooks === "undefined" || !allBooks){
        return [];
      }

      return allBooks;
    }

    /**
    * @namespace getById
    */
    function getById(idBook){
      var allBooks = getAll();
      return allBooks.filter(function(book){ return book.id === idBook })[0];
    }

    /**
    * @namespace accessLocalStorage
    */
    function accessLocalStorage(){
      if (typeof(Storage) !== "undefined") {
        return localStorage;
      } else {
        $log.warn('Sorry! No Web Storage support..');
      }
    }

  }

})();
