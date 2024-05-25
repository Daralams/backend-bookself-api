const { nanoid } = require('nanoid') 
const books = require('./book-store')

const saveNewBook = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload
  
  const id = nanoid(16)
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt
  
  // cek quantity readPage 
  let finished = false
  if(readPage === pageCount) {
    finished = true
  }else if(name.trim().length < 1) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan buku. Mohon isi nama buku"
    })
    response.code(400)
    return response
  }else if(readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount"  
    })
    response.code(400)
    return response
  }
  
  const saveBook = { id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt }
  
  books.push(saveBook)
  
  const response = h.response({
    status: 'success',
    message: "Buku berhasil ditambahkan",
    data: {
        "bookId": saveBook.id
    }
  })
  response.code(201) 
  return response
}

const showAllBooks = () => ({
  status: 'success',
  data: { books }
})

const showBookById = (request, h) => {
  const { bookId } = request.params
  
  const searchBookId = books.filter(book => book.id === bookId)
  
  // send response 404 jika id tidak ditemukan
  if(searchBookId === undefined || searchBookId.length == 0) {
    const response = h.response({
      status: "fail",
      message: "Buku tidak ditemukan"
    })
    response.code(404)
    return response
  }
  
  const book = searchBookId
  const response = h.response({
    status: 'success',
    data: { book }
  })
  response.code(200)
  return response
}

const updateBook = (request, h) => {
  const { bookId } = request.params
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload
  
  const updatedAt = new Date().toISOString()
  
  // search index id yg sesuai dengan id params
  const index = books.findIndex(book => book.id === bookId)
  
  let finished = false
  if(readPage === pageCount) {
    finished = true
  }else if(name.trim().length < 1) {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Mohon isi nama buku"
    })
    response.code(400)
    return response
  }else if(readPage > pageCount) {
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