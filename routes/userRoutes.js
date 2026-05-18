import express from "express";
import userController from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

const router = express.Router();

router.get("/me", authMiddleware, userController.getMe);
router.put("/me", authMiddleware, userController.updateMe);

router.get("/", authMiddleware, adminMiddleware, userController.getAllUsers);
router.get("/:id", authMiddleware, adminMiddleware, userController.getUserById);
router.put("/:id", authMiddleware, adminMiddleware, userController.updateUser);
router.patch("/:id/deactivate", authMiddleware, adminMiddleware, userController.deactivateUser);
router.patch("/:id/activate", authMiddleware, adminMiddleware, userController.activateUser);

export default router;
