document.addEventListener('DOMContentLoaded', function() {
  var generate, deleteAll, showAll, addBook, editBook, deleteBook;
  var bookstore;

  grabDomElements();
  addEventListeners();

  function fetchData(call, cb) {
    var xhttp = new XMLHttpRequest();

    xhttp.addEventListener('load', cb);
    xhttp.addEventListener('error', onError);
    xhttp.open("GET", call, true);
    xhttp.send();
  }

  function grabDomElements() {
    showAll = document.getElementById('showAll');
    deleteAll = document.getElementById('deleteAll')
    addBook = document.getElementById('addBook');
    editBook = document.getElementById('editBook');
    deleteBook = document.getElementById('deleteBook');
    bookstore = document.getElementById('bookstore');
    generate = document.getElementById('generate');
  }
  function addEventListeners() {
    showAll.onclick = loadShowAll;
    addBook.onclick = loadAddBooks;
    editBook.onclick = loadEditBooks;
    deleteBook.onclick = loadDeleteBooks;
    generate.onclick = generateBooks;
    deleteAll.onclick = deleteAllBooks;
  }

  function generateBooks() {
    console.log("generating books");
    fetchData('/api/generate', onLoad);
  }
  function deleteAllBooks() {
    console.log("deleting all books");
    fetchData('/api/deleteAll', onLoad);
  }
  function loadShowAll() {
    console.log("loading add books");
    fetchData('/api/getAllBooks', bookLoad);
  }
  function loadAddBooks() {
    console.log("loading add books");
    fetchData('/api/addBook', onLoad);
  }
  function loadEditBooks() {
    console.log("loading edit books");
    fetchData('/api/editBook', onLoad);
    fetchData('/api/getAllBooks', appendAll);
  }
  function loadDeleteBooks() {
    console.log("loading delete books");
    fetchData('/api/deleteBook', onLoad);
    fetchData('/api/getAllBooks', appendAll);
  }

  function onLoad(response) {
    console.log("recieved response! editing bookstore");
    bookstore.innerHTML = response.currentTarget.responseText;
  }

  function bookLoad(response) {
    bookstore.innerHTML = "";
    appendAll(response);
  }

  function appendAll(response) {
    let books = JSON.parse(response.currentTarget.responseText);
    //bookstore.innerHTML = "";
    let ul = document.createElement("ul");
    ul.className = "books";
    books.forEach( (book) => {
      let li = document.createElement("li")
      li.innerHTML = book.title + ', ' + book.genre;
      ul.appendChild(li);
    });
    bookstore.appendChild(ul);
  }

  function onError(error){
    space.innerHTML = error;
  }

});
