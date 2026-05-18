import mongoose from "mongoose";
import User from "../models/User.js";
import Book from "../models/Book.js";
import Loan from "../models/Loan.js";

const getDashboard = async () => {
  const [
    totalUsuarios,
    totalUsuariosAtivos,
    totalUsuariosInativos,
    totalLivros,
    totalLivrosAtivos,
    totalLivrosDisponiveis,
    totalEmprestimos,
    totalEmprestimosAtivos,
    totalEmprestimosAtrasados,
    finesResult,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ ativo: true }),
    User.countDocuments({ ativo: false }),
    Book.countDocuments(),
    Book.countDocuments({ ativo: true }),
    Book.countDocuments({ ativo: true, quantidadeDisponivel: { $gt: 0 } }),
    Loan.countDocuments(),
    Loan.countDocuments({ status: "ativo" }),
    Loan.countDocuments({ status: "ativo", dataPrevistaDevolucao: { $lt: new Date() } }),
    Loan.aggregate([
      { $match: { multa: { $gt: 0 } } },
      { $group: { _id: null, total: { $sum: "$multa" } } },
    ]),
  ]);

  return {
    totalUsuarios,
    totalUsuariosAtivos,
    totalUsuariosInativos,
    totalLivros,
    totalLivrosAtivos,
    totalLivrosDisponiveis,
    totalEmprestimos,
    totalEmprestimosAtivos,
    totalEmprestimosAtrasados,
    totalMultasGeradas: finesResult[0]?.total || 0,
  };
};

const getUsersWithActiveLoans = async () => {
  const loans = await Loan.find({ status: "ativo" })
    .populate("userId")
    .populate("bookId")
    .sort({ createdAt: -1 });

  const usersMap = new Map();

  loans.forEach((loan) => {
    if (!loan.userId) return;

    const userId = loan.userId._id.toString();

    if (!usersMap.has(userId)) {
      usersMap.set(userId, {
        user: loan.userId,
        activeLoans: [],
      });
    }

    usersMap.get(userId).activeLoans.push(loan);
  });

  return Array.from(usersMap.values());
};

const getMostBorrowedBooks = async () => {
  const result = await Loan.aggregate([
    {
      $group: {
        _id: "$bookId",
        totalEmprestimos: { $sum: 1 },
      },
    },
    {
      $sort: { totalEmprestimos: -1 },
    },
  ]);

  const books = await Promise.all(
    result.map(async (item) => {
      const book = await Book.findById(item._id);

      return {
        book,
        totalEmprestimos: item.totalEmprestimos,
      };
    })
  );

  return books.filter((item) => item.book);
};

const getFines = async () => {
  return Loan.find({ multa: { $gt: 0 } })
    .populate("userId")
    .populate("bookId")
    .sort({ dataDevolucao: -1 });
};

export default {
  getDashboard,
  getUsersWithActiveLoans,
  getMostBorrowedBooks,
  getFines,
};
