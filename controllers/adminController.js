import adminService from "../services/adminService.js";

const getDashboard = async (req, res, next) => {
  try {
    const dashboard = await adminService.getDashboard();

    res.status(200).json({
      message: "Dashboard encontrado com sucesso",
      data: dashboard,
    });
  } catch (error) {
    next(error);
  }
};

const getUsersWithActiveLoans = async (req, res, next) => {
  try {
    const users = await adminService.getUsersWithActiveLoans();

    res.status(200).json({
      message: "Usuários com empréstimos ativos encontrados com sucesso",
      total: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

const getMostBorrowedBooks = async (req, res, next) => {
  try {
    const books = await adminService.getMostBorrowedBooks();

    res.status(200).json({
      message: "Livros mais emprestados encontrados com sucesso",
      total: books.length,
      data: books,
    });
  } catch (error) {
    next(error);
  }
};

const getFines = async (req, res, next) => {
  try {
    const fines = await adminService.getFines();

    res.status(200).json({
      message: "Multas encontradas com sucesso",
      total: fines.length,
      data: fines,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getDashboard,
  getUsersWithActiveLoans,
  getMostBorrowedBooks,
  getFines,
};
