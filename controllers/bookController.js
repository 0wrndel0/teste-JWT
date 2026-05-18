import bookService from "../services/bookService.js";

const createBook = async (req, res, next) => {
  try {
    const book = await bookService.createBook(req.body);

    res.status(201).json({
      message: "Livro criado com sucesso",
      data: book,
    });
  } catch (error) {
    next(error);
  }
};

const getAllBooks = async (req, res, next) => {
  try {
    const books = await bookService.getAllBooks();

    res.status(200).json({
      message: "Livros encontrados com sucesso",
      total: books.length,
      data: books,
    });
  } catch (error) {
    next(error);
  }
};

const getBookById = async (req, res, next) => {
  try {
    const book = await bookService.getBookById(req.params.id);

    res.status(200).json({
      message: "Livro encontrado com sucesso",
      data: book,
    });
  } catch (error) {
    next(error);
  }
};

const searchBooksByTitle = async (req, res, next) => {
  try {
    const books = await bookService.searchBooksByTitle(req.params.title);

    res.status(200).json({
      message: "Livros encontrados por título com sucesso",
      total: books.length,
      data: books,
    });
  } catch (error) {
    next(error);
  }
};

const getBooksByCategory = async (req, res, next) => {
  try {
    const books = await bookService.getBooksByCategory(req.params.category);

    res.status(200).json({
      message: "Livros encontrados por categoria com sucesso",
      total: books.length,
      data: books,
    });
  } catch (error) {
    next(error);
  }
};

const getAvailableBooks = async (req, res, next) => {
  try {
    const books = await bookService.getAvailableBooks();

    res.status(200).json({
      message: "Livros disponíveis encontrados com sucesso",
      total: books.length,
      data: books,
    });
  } catch (error) {
    next(error);
  }
};

const updateBook = async (req, res, next) => {
  try {
    const book = await bookService.updateBook(req.params.id, req.body);

    res.status(200).json({
      message: "Livro atualizado com sucesso",
      data: book,
    });
  } catch (error) {
    next(error);
  }
};

const deactivateBook = async (req, res, next) => {
  try {
    const book = await bookService.deactivateBook(req.params.id);

    res.status(200).json({
      message: "Livro desativado com sucesso",
      data: book,
    });
  } catch (error) {
    next(error);
  }
};

const activateBook = async (req, res, next) => {
  try {
    const book = await bookService.activateBook(req.params.id);

    res.status(200).json({
      message: "Livro ativado com sucesso",
      data: book,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  createBook,
  getAllBooks,
  getBookById,
  searchBooksByTitle,
  getBooksByCategory,
  getAvailableBooks,
  updateBook,
  deactivateBook,
  activateBook,
};
