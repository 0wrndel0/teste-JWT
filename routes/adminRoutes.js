import express from "express";
import adminController from "../controllers/adminController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

const router = express.Router();

router.get("/dashboard", authMiddleware, adminMiddleware, adminController.getDashboard);
router.get("/users/with-active-loans", authMiddleware, adminMiddleware, adminController.getUsersWithActiveLoans);
router.get("/books/most-borrowed", authMiddleware, adminMiddleware, adminController.getMostBorrowedBooks);
router.get("/fines", authMiddleware, adminMiddleware, adminController.getFines);

export default router;
