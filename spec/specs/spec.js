describe("BooksApp", function(){

  var scope,
  book,
  controller;
  beforeEach(function () {
    module('app');
  });

  describe('appCtrl', function () {
    beforeEach(inject(function ($rootScope, $controller) {
      scope = $rootScope.$new();
      book = {
        "id":"9780516250892",
        "title":"Ninjas",
        "author":[
          "Joanne Mattern"
        ],
        "createDate":"10/08/2016 10:33",
        "read":{
          "readDate":"10/08/2016"
        },
        "idBooks":[
          "9780516250892",
          "1417649879",
          "9780606335041",
          "0516251201",
          "0606335048",
          "9781417649877",
          "0516250892",
          "9780516251202"
        ],
        "cover":"http://covers.openlibrary.org/b/isbn/9780516250892-M.jpg"
      };
      controller = $controller('controller', {
        '$scope': scope
      });
    }));

    it('Select a book to see', function () {
      var bookSelect = scope.lookBookTest(book);
      expect(bookSelect.id).toBe('9780516250892');
    });

    it('Cover of book', function () {
      var bookSelect = scope.lookBookTest(book);
      expect(bookSelect.cover.indexOf('9780516250892-M') !== -1).toBe(true);
    });

    it('Book have all isbn IDs', function () {
      var bookSelect = scope.lookBookTest(book);
      expect(bookSelect.idBooks.length !== 0).toBe(true);
    });

    it('Book is readed', function () {
      var bookSelect = scope.lookBookTest(book);
      expect(bookSelect.read.readDate).toBe('10/08/2016');
    });

    it('Book contains title', function () {
      var bookSelect = scope.lookBookTest(book);
      expect(bookSelect.title).toBe('Ninjas');
    });

    it('Book contains author', function () {
      var bookSelect = scope.lookBookTest(book);
      expect(bookSelect.author.length !== 0).toBe(true);
    });
  });

});
