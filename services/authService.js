import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import AppError from "../utils/AppError.js";

const register = async (data) => {
  const { nome, email, password, telefone, role } = data;

  if (!nome || !email || !password) {
    throw new AppError("Nome, email e senha são obrigatórios", 400);
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new AppError("Já existe um usuário com esse email", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    nome,
    email,
    password: hashedPassword,
    telefone,
    role: role || "user",
    ativo: true,
  });

  return {
    _id: user._id,
    nome: user.nome,
    email: user.email,
    telefone: user.telefone,
    role: user.role,
    ativo: user.ativo,
  };
};

const login = async (data) => {
  const { email, password } = data;

  if (!email || !password) {
    throw new AppError("Email e senha são obrigatórios", 400);
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new AppError("Email ou senha inválidos", 401);
  }

  if (!user.ativo) {
    throw new AppError("Usuário inativo. Entre em contato com a administração", 403);
  }

  const passwordIsCorrect = await bcrypt.compare(password, user.password);

  if (!passwordIsCorrect) {
    throw new AppError("Email ou senha inválidos", 401);
  }

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    }
  );

  return {
    user: {
      _id: user._id,
      nome: user.nome,
      email: user.email,
      telefone: user.telefone,
      role: user.role,
      ativo: user.ativo,
    },
    token,
  };
};

export default {
  register,
  login,
};
