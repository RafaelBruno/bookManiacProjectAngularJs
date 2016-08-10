function Book(title, author, idBooks){
  this.id = idBooks[0];
  this.title = title;
  this.author = author;
  this.createDate = moment().format("DD/MM/YYYY HH:mm");
  this.read = false;
  this.idBooks = idBooks;
  this.cover = "http://covers.openlibrary.org/b/isbn/"+ idBooks[0] +'-M.jpg';
}
