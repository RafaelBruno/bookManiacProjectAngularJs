/**
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
