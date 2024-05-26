const { nanoid } = require('nanoid') 
const books = require('./book-store')

const saveNewBook = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload
  
  if(!name || name.trim().length < 1) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan buku. Mohon isi nama buku"
    })
    response.code(400)
    return response
  }
  
  if(readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount"  
    })
    response.code(400)
    return response
  }
  
  const id = nanoid(16)
  const finished = pageCount === readPage
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt
  
  const saveBook = { id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt }
  
  books.push(saveBook)
  
  const isSuccess = books.filter(book => book.id === id).length > 0
  
  if(isSuccess) {
    // Jika buku berhasil ditambahkan
    const response = h.response({
    status: 'success',
    message: "Buku berhasil ditambahkan",
    data: { "bookId": saveBook.id }
    })
    response.code(201) 
    return response
  }
  
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan!'
  })
  response.code(500)
  return response
}

const showAllBooks = (request, h) => {
    const { name, reading, finished } = request.query;

    let filteredBooks = books;

    // Filter by name (case insensitive)
    if (name) {
      const lowerCaseName = name.toLowerCase();
      filteredBooks = filteredBooks.filter(book => book.name.toLowerCase().includes(lowerCaseName));
    }

    // Filter by reading status
    if (reading !== undefined) {
      let isReading = reading === '1';
      if(isReading == '1') {
        isReading = true
      }else {
        isReading = false
      }
      filteredBooks = filteredBooks.filter(book => book.reading === isReading);
    }

    // Filter by finished status
    if (finished !== undefined) {
      let isFinished = finished === '1';
      if(isFinished == '1') {
        isFinished = true
      }else {
        isFinished = false
      }
      filteredBooks = filteredBooks.filter(book => book.finished === isFinished);
    }

    const response = h.response({
      status: 'success',
      data: {
        books: filteredBooks.map(book => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher
        }))
      }
    })
    response.code(200)
    return response
  };

const showBookById = (request, h) => {
  const { bookId } = request.params
  
  const searchBookId = books.filter(book => book.id === bookId)[0]
  
  // send response 200 jika id ditemukan
  if(searchBookId !== undefined) {
    const book = searchBookId
    const response = h.response({
      status: 'success',
      data: { book }
    })
    response.code(200)
    return response
  }
  
  // send response 404 jika id tidak ditemukan
  const response = h.response({
      status: "fail",
      message: "Buku tidak ditemukan"
    })
    response.code(404)
    return response
}

const updateBook = (request, h) => {
  const { bookId } = request.params
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload
  
  const finished = pageCount === readPage
  const updatedAt = new Date().toISOString()
  
  // search index id yg sesuai dengan id params
  const index = books.findIndex(book => book.id === bookId)
  
  if(!name || name.trim().length < 1) {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Mohon isi nama buku"
    })
    response.code(400)
    return response
  }
  if(readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount"  
    })
    response.code(400)
    return response
  }
  
  if(index !== -1) {
    books[index] = {
      ...books[index],
      name, year, author, summary, publisher, pageCount, readPage, finished, reading, updatedAt
    }
    const response = h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui'
    })
    response.code(200)
    return response
  }
  
  // jika id tidak ditemukan
  const response = h.response({
    status: "fail",
    message: "Gagal memperbarui buku. Id tidak ditemukan"
  })
  response.code(404)
  return response
}

const deleteBook = (request, h) => {
  const { bookId } = request.params
  
  const index = books.findIndex(book => book.id === bookId) 
  
  if(index !== -1) {
    books.splice(index, 1)
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    })
    response.code(200)
    return response
  }
  
  const response = h.response({
    status: "fail",
    message: "Buku gagal dihapus. Id tidak ditemukan"
  })
  response.code(404)
  return response
}

module.exports = { saveNewBook, showAllBooks, showBookById, updateBook, deleteBook }