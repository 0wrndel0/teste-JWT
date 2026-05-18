import express from "express";
import loanController from "../controllers/loanController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, loanController.createLoan);
router.get("/my", authMiddleware, loanController.getMyLoans);

router.get("/", authMiddleware, adminMiddleware, loanController.getAllLoans);
router.get("/user/:userId", authMiddleware, adminMiddleware, loanController.getLoansByUser);
router.get("/active", authMiddleware, adminMiddleware, loanController.getActiveLoans);
router.get("/overdue", authMiddleware, adminMiddleware, loanController.getOverdueLoans);

router.get("/:id", authMiddleware, loanController.getLoanById);
router.patch("/:id/return", authMiddleware, loanController.returnLoan);
router.post("/:id/fine/simulate", authMiddleware, loanController.simulateFine);

export default router;
