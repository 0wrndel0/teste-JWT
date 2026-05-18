import loanService from "../services/loanService.js";

const createLoan = async (req, res, next) => {
  try {
    const loan = await loanService.createLoan(req.user._id, req.body);

    res.status(201).json({
      message: "Empréstimo criado com sucesso",
      data: loan,
    });
  } catch (error) {
    next(error);
  }
};

const getAllLoans = async (req, res, next) => {
  try {
    const loans = await loanService.getAllLoans();

    res.status(200).json({
      message: "Empréstimos encontrados com sucesso",
      total: loans.length,
      data: loans,
    });
  } catch (error) {
    next(error);
  }
};

const getMyLoans = async (req, res, next) => {
  try {
    const loans = await loanService.getMyLoans(req.user._id);

    res.status(200).json({
      message: "Meus empréstimos encontrados com sucesso",
      total: loans.length,
      data: loans,
    });
  } catch (error) {
    next(error);
  }
};

const getLoanById = async (req, res, next) => {
  try {
    const loan = await loanService.getLoanById(req.params.id, req.user);

    res.status(200).json({
      message: "Empréstimo encontrado com sucesso",
      data: loan,
    });
  } catch (error) {
    next(error);
  }
};

const getLoansByUser = async (req, res, next) => {
  try {
    const loans = await loanService.getLoansByUser(req.params.userId);

    res.status(200).json({
      message: "Empréstimos do usuário encontrados com sucesso",
      total: loans.length,
      data: loans,
    });
  } catch (error) {
    next(error);
  }
};

const getActiveLoans = async (req, res, next) => {
  try {
    const loans = await loanService.getActiveLoans();

    res.status(200).json({
      message: "Empréstimos ativos encontrados com sucesso",
      total: loans.length,
      data: loans,
    });
  } catch (error) {
    next(error);
  }
};

const returnLoan = async (req, res, next) => {
  try {
    const loan = await loanService.returnLoan(req.params.id, req.user);

    res.status(200).json({
      message: "Livro devolvido com sucesso",
      data: loan,
    });
  } catch (error) {
    next(error);
  }
};

const getOverdueLoans = async (req, res, next) => {
  try {
    const loans = await loanService.getOverdueLoans();

    res.status(200).json({
      message: "Empréstimos atrasados encontrados com sucesso",
      total: loans.length,
      data: loans,
    });
  } catch (error) {
    next(error);
  }
};

const simulateFine = async (req, res, next) => {
  try {
    const result = await loanService.simulateFine(req.params.id, req.user);

    res.status(200).json({
      message: "Simulação de multa realizada com sucesso",
      data: result,
    });
  } catch (error) {
    next(error);
  }
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
