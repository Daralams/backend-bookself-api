const { saveNewBook, showAllBooks, showBookById, updateBook, deleteBook } = require('./handler')

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: saveNewBook
  },
  {
    method: 'GET',
    path: '/books',
    handler: showAllBooks
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: showBookById
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: updateBook
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteBook
  }
  ]
  
module.exports = routes