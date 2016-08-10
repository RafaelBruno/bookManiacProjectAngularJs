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
;/**
* Main Controller
* @namespace Controller
* @listens index.html
*/

(function() {
  'use strict';

  angular
  .module('app.controller', [])
  .controller('controller', controller);

  controller.$inject = ['$scope', 'bookService', 'toastr'];

  /**
  * @namespace controller
  */
  function controller($scope, bookService, toastr){

    var ctrl = this;

    ctrl.titleSearch = "";
    ctrl.selectBook = {};
    ctrl.myBooks = [];
    ctrl.booksFound = [];
    ctrl.hideSave = false;

    ctrl.goToModal = goToModal;
    ctrl.addBookSelected = addBookSelected;
    ctrl.lookBook = lookBook;
    ctrl.addBook = addBook;

    ctrl.searchBooksInOpenLibrary = searchBooksInOpenLibrary;
    ctrl.getAll = bookService.getAll;
    ctrl.save = save;
    ctrl.update = update;
    ctrl.checkBook = checkBook;
    ctrl.saveReadBook = saveReadBook;
    ctrl.deleteBook = deleteBook;

    $scope.lookBookTest = lookBook;

    /////////////////////

    init();

    /**
    * @namespace Init Function
    */
    function init(){
      getMyBooks();
    }

    /**
    * @namespace getMyBooks
    */
    function getMyBooks(){
      bookService.getAll().then(function(books){
        ctrl.myBooks = books;
      })
    }

    /**
    * @namespace addBook
    */
    function addBook(){
      goToModal('addBookModal');
      setTimeout(function () {
        $("#inputTitle").focus();
      }, 100);
    }

    /**
    * @namespace searchBooksInOpenLibrary
    */
    function searchBooksInOpenLibrary(title){
      bookService.openLibrarySearch(title).then(function(res) {
        ctrl.booksFound = res.docs;
        ctrl.titleSearch = "";
        goToModal('listOfBooksOpenLibrary');
      });
    }


    /**
    * @namespace bookSelected
    */
    function addBookSelected(book){
      ctrl.selectBook = new Book(book.title, book.author_name, book.isbn);
      ctrl.hideSave = false;
      goToModal("selectBookModal");
    }


    /**
    * @namespace lookBook
    */
    function lookBook(book){
      ctrl.selectBook = book;
      ctrl.hideSave = true;
      goToModal("selectBookModal");

      return ctrl.selectBook;
    }

    /**
    * @namespace save
    */
    function save(book){
      bookService.save(book).then(function(res){
        $(".modal").modal("hide");
        toastr.success(book.title + " Saved");
        getMyBooks();
      })
    }

    /**
    * @namespace checkBook
    */
    function checkBook(book){
      if(!book.read){
        ctrl.selectBook = angular.copy(book);
        goToModal('checkBookModal');
      }else{
        book.read = false;
        update(book);
      }
    }

    /**
    * @namespace saveReadBook
    */
    function saveReadBook(book){
      if(typeof book.read.readDate === "undefined"){
        book.read = {
          readDate : moment().format("DD/MM/YYYY")
        }
      }
      update(book);
    }

    /**
    * @namespace update
    */
    function update(book){
      bookService.update(book).then(function(res){
        $(".modal").modal("hide");
        toastr.success(book.title + " Updated");
        getMyBooks();
      })
    }

    /**
    * @namespace deleteBook
    */
    function deleteBook(book){
      bookService.deleteBook(book).then(function(res){
        $(".modal").modal("hide");
        toastr.success(book.title + " Deleted");
        getMyBooks();
      })
    }

    /**
    * @namespace goToModal
    */
    function goToModal(idModal){
      $(".modal").modal("hide");
      setTimeout(function () {
        $("#"+idModal).modal("show");
      }, 500);
    }

  }

})();
;/**
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
;/**
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
;function Book(title, author, idBooks){
  this.id = idBooks[0];
  this.title = title;
  this.author = author;
  this.createDate = moment().format("DD/MM/YYYY HH:mm");
  this.read = false;
  this.idBooks = idBooks;
  this.cover = "http://covers.openlibrary.org/b/isbn/"+ idBooks[0] +'-M.jpg';
}
;/**
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
;/**
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
;/**
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
;/**
* Constants
* @namespace app.constants
* @desc FIX
*/
(function() {
    'use strict';
    angular
        .module('app.constants', [])
        .constant('toastr', toastr)
        .constant('moment', moment);
})();
;(function() {
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
;(function() {
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
