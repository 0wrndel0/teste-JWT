import userService from "../services/userService.js";

const getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      message: "Usuário logado encontrado com sucesso",
      data: req.user,
    });
  } catch (error) {
    next(error);
  }
};

const updateMe = async (req, res, next) => {
  try {
    const user = await userService.updateMe(req.user._id, req.body);

    res.status(200).json({
      message: "Perfil atualizado com sucesso",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();

    res.status(200).json({
      message: "Usuários encontrados com sucesso",
      total: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);

    res.status(200).json({
      message: "Usuário encontrado com sucesso",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);

    res.status(200).json({
      message: "Usuário atualizado com sucesso",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const deactivateUser = async (req, res, next) => {
  try {
    const user = await userService.deactivateUser(req.params.id);

    res.status(200).json({
      message: "Usuário desativado com sucesso",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const activateUser = async (req, res, next) => {
  try {
    const user = await userService.activateUser(req.params.id);

    res.status(200).json({
      message: "Usuário ativado com sucesso",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getMe,
  updateMe,
  getAllUsers,
  getUserById,
  updateUser,
  deactivateUser,
  activateUser,
};
