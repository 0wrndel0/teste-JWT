import Loan from "../models/Loan.js";
import User from "../models/User.js";
import Book from "../models/Book.js";
import AppError from "../utils/AppError.js";
import calculateFine from "../utils/calculateFine.js";

const createLoan = async (userId, data) => {
  const { bookId } = data;
  const daysToReturn = Number(data.diasParaDevolucao ?? 7);

  if (!bookId) {
    throw new AppError("bookId é obrigatório", 400);
  }

  if (!daysToReturn || daysToReturn <= 0) {
    throw new AppError("diasParaDevolucao precisa ser maior que zero", 400);
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("Usuário não encontrado", 404);
  }

  if (!user.ativo) {
    throw new AppError("Usuário inativo não pode pegar livros emprestados", 400);
  }

  const book = await Book.findById(bookId);

  if (!book) {
    throw new AppError("Livro não encontrado", 404);
  }

  if (!book.ativo) {
    throw new AppError("Livro inativo não pode ser emprestado", 400);
  }

  if (book.quantidadeDisponivel <= 0) {
    throw new AppError("Livro sem quantidade disponível", 400);
  }

  const activeSameBookLoan = await Loan.findOne({
    userId,
    bookId,
    status: "ativo",
  });

  if (activeSameBookLoan) {
    throw new AppError("Usuário já possui empréstimo ativo desse livro", 400);
  }

  const dataEmprestimo = new Date();
  const dataPrevistaDevolucao = new Date(dataEmprestimo);
  dataPrevistaDevolucao.setDate(dataPrevistaDevolucao.getDate() + daysToReturn);

  const loan = await Loan.create({
    userId,
    bookId,
    dataEmprestimo,
    dataPrevistaDevolucao,
    status: "ativo",
    multa: 0,
  });

  book.quantidadeDisponivel -= 1;
  await book.save();

  return Loan.findById(loan._id).populate("userId").populate("bookId");
};

const getAllLoans = async () => {
  return Loan.find()
    .populate("userId")
    .populate("bookId")
    .sort({ createdAt: -1 });
};

const getMyLoans = async (userId) => {
  return Loan.find({ userId })
    .populate("userId")
    .populate("bookId")
    .sort({ createdAt: -1 });
};

const getLoanById = async (id, currentUser) => {
  const loan = await Loan.findById(id).populate("userId").populate("bookId");

  if (!loan) {
    throw new AppError("Empréstimo não encontrado", 404);
  }

  const isOwner = loan.userId._id.toString() === currentUser._id.toString();
  const isAdmin = currentUser.role === "admin";

  if (!isOwner && !isAdmin) {
    throw new AppError("Você não tem permissão para acessar esse empréstimo", 403);
  }

  return loan;
};

const getLoansByUser = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("Usuário não encontrado", 404);
  }

  return Loan.find({ userId })
    .populate("userId")
    .populate("bookId")
    .sort({ createdAt: -1 });
};

const getActiveLoans = async () => {
  return Loan.find({ status: "ativo" })
    .populate("userId")
    .populate("bookId")
    .sort({ dataPrevistaDevolucao: 1 });
};

const returnLoan = async (loanId, currentUser) => {
  const loan = await Loan.findById(loanId);

  if (!loan) {
    throw new AppError("Empréstimo não encontrado", 404);
  }

  const isOwner = loan.userId.toString() === currentUser._id.toString();
  const isAdmin = currentUser.role === "admin";

  if (!isOwner && !isAdmin) {
    throw new AppError("Você não tem permissão para devolver esse empréstimo", 403);
  }

  if (loan.status === "devolvido") {
    throw new AppError("Esse empréstimo já foi devolvido", 400);
  }

  const book = await Book.findById(loan.bookId);

  if (!book) {
    throw new AppError("Livro não encontrado", 404);
  }

  const dataDevolucao = new Date();
  const { fine } = calculateFine(loan.dataPrevistaDevolucao, dataDevolucao);

  loan.dataDevolucao = dataDevolucao;
  loan.status = "devolvido";
  loan.multa = fine;

  book.quantidadeDisponivel += 1;

  if (book.quantidadeDisponivel > book.quantidadeTotal) {
    book.quantidadeDisponivel = book.quantidadeTotal;
  }

  await loan.save();
  await book.save();

  return Loan.findById(loan._id).populate("userId").populate("bookId");
};

const getOverdueLoans = async () => {
  return Loan.find({
    status: "ativo",
    dataPrevistaDevolucao: { $lt: new Date() },
  })
    .populate("userId")
    .populate("bookId")
    .sort({ dataPrevistaDevolucao: 1 });
};

const simulateFine = async (loanId, currentUser) => {
  const loan = await Loan.findById(loanId).populate("userId").populate("bookId");

  if (!loan) {
    throw new AppError("Empréstimo não encontrado", 404);
  }

  const isOwner = loan.userId._id.toString() === currentUser._id.toString();
  const isAdmin = currentUser.role === "admin";

  if (!isOwner && !isAdmin) {
    throw new AppError("Você não tem permissão para simular multa desse empréstimo", 403);
  }

  if (loan.status === "devolvido") {
    return {
      diasDeAtraso: 0,
      multa: loan.multa,
      message: "Empréstimo já devolvido. Multa registrada no empréstimo",
    };
  }

  const { daysLate, fine } = calculateFine(loan.dataPrevistaDevolucao, new Date());

  return {
    diasDeAtraso: daysLate,
    multa: fine,
  };
};

export default {
  createLoan,
  getAllLoans,
  getMyLoans,
  getLoanById,
  getLoansByUser,
  getActiveLoans,
  returnLoan,
  getOverdueLoans,
  simulateFine,
};
