import express from "express";
import bookController from "../controllers/bookController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

const router = express.Router();

router.get("/", bookController.getAllBooks);
router.get("/available", authMiddleware, bookController.getAvailableBooks);
router.get("/search/:title", authMiddleware, bookController.searchBooksByTitle);
router.get("/category/:category", authMiddleware, bookController.getBooksByCategory);
router.get("/:id",  authMiddleware ,bookController.getBookById);

router.post("/", authMiddleware, adminMiddleware, bookController.createBook);
router.put("/:id", authMiddleware, adminMiddleware, bookController.updateBook);
router.patch("/:id/deactivate", authMiddleware, adminMiddleware, bookController.deactivateBook);
router.patch("/:id/activate", authMiddleware, adminMiddleware, bookController.activateBook);

export default router;
