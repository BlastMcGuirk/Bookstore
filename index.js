const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const path = require('path');
var app = express();

const mongoURL = 'mongodb://bren:bren@ds161446.mlab.com:61446/bookstore'

var db;
var books;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'client')));

app.get('/', (req, res) => {
  console.log(req.url);
  res.sendFile(path.join(__dirname, 'client/index.html'));
});

app.get('/api/generate', (req, res) => {
  console.log('generating books');
  generateAll();
  res.end('Books generated!');
});

app.get('/api/deleteAll', (req, res) => {
  console.log('Deleting all books');
  books.drop();
  db.createCollection('books', (err, col) => {
    if (err) return console.log("error occurred!!!");
    books = col;
  });
  res.end('Books deleted!');
});

app.get('/api/getAllBooks', (req, res) => {
  console.log('Getting all books');
  books.find().toArray((err, docs) => {
    res.end(JSON.stringify(docs));
  });
});

app.get('/api/addBook', (req, res) => {
  console.log('Bringing up add book prompt');
  res.sendFile(path.join(__dirname, 'client/pages/addBook.html'));
});

app.get('/api/editBook', (req, res) => {
  console.log('Bringing up edit book prompt');
  res.sendFile(path.join(__dirname, 'client/pages/editBook.html'));
});

app.get('/api/deleteBook', (req, res) => {
  console.log('Bringing up delete book prompt');
  res.sendFile(path.join(__dirname, 'client/pages/deleteBook.html'));
});

app.post('/api/addBook', (req, res) => {
  console.log('Adding book to database');
  let newTitle = req.body.title;
  let newGenre = req.body.genre;

  let newBook = {title:newTitle, genre:newGenre};
  books.findOne({title:newTitle}, (err, doc) => {
    if (!doc) {
      books.save(newBook);
    }
  });

  res.redirect('/');
});

app.post('/api/editBook', (req, res) => {
  console.log('Editing book in database');
  let oldTitle = req.body.title;
  let newTitle = req.body.newTitle;
  let newGenre = req.body.newGenre;

  books.findAndModify({title:oldTitle}, [['title','ascending']], {$set:{title:newTitle, genre:newGenre}}, (err, doc) => {
    console.log('Book modified');
  });

  res.redirect('/');
});

app.post('/api/deleteBook', (req, res) => {
  console.log('Deleting book in database');
  let oldTitle = req.body.title;
  console.log("Removing " + oldTitle);

  books.remove({title:oldTitle}, 1, (err, doc) => {
    console.log('Book deleted');
  });

  res.redirect('/');
});

MongoClient.connect(mongoURL, (err, database) => {
  if (err) return console.log(err);
  db = database.db('bookstore');
  books = db.collection('books');

  app.listen(3000, () => {
    console.log("Listening on port 3000");
  });
});

function generateAll() {
  books.findOne({title:'Moby Dick'}, (err, doc) => {
    if (!doc) {
      books.save({title:'Moby Dick', genre:'Adventure'});
    }
  });
  books.findOne({title:'Robin Hood'}, (err, doc) => {
    if (!doc) {
      books.save({title:'Robin Hood', genre:'Adventure'});
    }
  });
  books.findOne({title:'Nancy Drew'}, (err, doc) => {
    if (!doc) {
      books.save({title:'Nancy Drew', genre:'Mystery'});
    }
  });
};
