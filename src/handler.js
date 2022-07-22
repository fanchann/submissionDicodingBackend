const idgen = require('id-generator');
const book = require('./book');
const books = require('./book');


const addBookHandler = (request, h) => {
  const {
    name, year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  } else if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    });
    response.code(400);
    return response;
  } else {
    const id = new idgen().newId();
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = pageCount === readPage;
    
    const newBook = {
      id,
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      insertedAt,
      updatedAt,
    };
    books.push(newBook);
    const isSuccess = books.filter((note) => note.id === id).length > 0;
    if (isSuccess) {
      const response = h.response({
        status: 'succes',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: id,
        },
      });
      response.code(201);
      return response
    }
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
}

const getAllBooksHandler = (request, h) => {
  const {name, reading, finished} = request.query;

  if (name !== undefined) {
    const BooksName = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
    const response = h
        .response({
          status: 'success',
          data: {
            books: BooksName.map((book) => ({
              id: book.id,
              name: book.name,
              publisher: book.publisher,
            })),
          },
        });
    response.code(200);
    return response;
  
  } else if (reading !== undefined) {
    const BooksReading = books.filter(
        (book) => Number(book.reading) === Number(reading),
    );

    const response = h
        .response({
          status: 'success',
          data: {
            books: BooksReading.map((book) => ({
              id: book.id,
              name: book.name,
              publisher: book.publisher,
            })),
          },
        });
    response.code(200);
    return response;
  
  } else if (finished !== undefined){
    const BooksFinished = books.filter(
        (book) => book.finished == finished,
    );

    const response = h
        .response({
          status: 'success',
          data: {
            books: BooksFinished.map((book) => ({
              id: book.id,
              name: book.name,
              publisher: book.publisher,
            })),
          },
        });
    response.code(200);
    return response;
  
  } else {
    const response = h.response( {
      status: 'success',
      data: {
        books: books.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    } );
    response.code(200);
    return response;
  }
};

const getBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const book = books.filter((book) => book.id === id)[0];
  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tak ditemukan!',
  });
  response.code(404)
  return response;
}

const editBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const updateAt = new Date().toISOString();
  const index = books.findIndex((book) => book.id === id);
  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui bku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  } else if (readPage > pageCount) {
    const response = h.response({
      status: 'fial',
      message: 'Gagal memperbarui buku, readpage lebih besar dari readcount',
    });
    response.code(400)
    return response;
  } else if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updateAt,
    }
    const response = h.response({
      status: 'success',
      message: 'Buku Berhasil diperbarui',
    });
    response.code(200);
    return response;
  } else {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku id tak ditemukan!'
    });
    response.code(404);
    return response;
  }
};

const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'succes',
      message: 'Buku berhasil dihapus!',
    });
    response.code(200)
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus id tak ditemuakan',
  });
  response.code(404);
  return response;
}

module.exports = {addBookHandler,getAllBooksHandler,getBookByIdHandler,editBookByIdHandler,deleteBookByIdHandler}