import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Loan from "../models/Loan.js";
import AppError from "../utils/AppError.js";

const getAllUsers = async () => {
  return User.find().sort({ createdAt: -1 });
};

const getUserById = async (id) => {
  const user = await User.findById(id);

  if (!user) {
    throw new AppError("Usuário não encontrado", 404);
  }

  return user;
};

const updateMe = async (userId, data) => {
  delete data.role;
  delete data.ativo;
  delete data.password;

  if (data.email) {
    const emailExists = await User.findOne({
      email: data.email,
      _id: { $ne: userId },
    });

    if (emailExists) {
      throw new AppError("Já existe outro usuário com esse email", 400);
    }
  }

  const user = await User.findByIdAndUpdate(userId, data, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw new AppError("Usuário não encontrado", 404);
  }

  return user;
};

const updateUser = async (id, data) => {
  if (data.email) {
    const emailExists = await User.findOne({
      email: data.email,
      _id: { $ne: id },
    });

    if (emailExists) {
      throw new AppError("Já existe outro usuário com esse email", 400);
    }
  }

  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }

  const user = await User.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw new AppError("Usuário não encontrado", 404);
  }

  return user;
};

const deactivateUser = async (id) => {
  const user = await User.findById(id);

  if (!user) {
    throw new AppError("Usuário não encontrado", 404);
  }

  if (!user.ativo) {
    throw new AppError("Usuário já está desativado", 400);
  }

  const activeLoansCount = await Loan.countDocuments({
    userId: id,
    status: "ativo",
  });

  if (activeLoansCount > 0) {
    throw new AppError("Não é possível desativar usuário com empréstimo ativo", 400);
  }

  user.ativo = false;
  await user.save();

  return user;
};

const activateUser = async (id) => {
  const user = await User.findById(id);

  if (!user) {
    throw new AppError("Usuário não encontrado", 404);
  }

  if (user.ativo) {
    throw new AppError("Usuário já está ativo", 400);
  }

  user.ativo = true;
  await user.save();

  return user;
};

export default {
  getAllUsers,
  getUserById,
  updateMe,
  updateUser,
  deactivateUser,
  activateUser,
};
