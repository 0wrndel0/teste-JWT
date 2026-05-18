import express from "express";
import bookController from "../controllers/bookController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

const router = express.Router();

router.get("/", bookController.getAllBooks);
router.get("/available", bookController.getAvailableBooks);
router.get("/search/:title", bookController.searchBooksByTitle);
router.get("/category/:category", bookController.getBooksByCategory);
router.get("/:id", bookController.getBookById);

router.post("/", authMiddleware, adminMiddleware, bookController.createBook);
router.put("/:id", authMiddleware, adminMiddleware, bookController.updateBook);
router.patch("/:id/deactivate", authMiddleware, adminMiddleware, bookController.deactivateBook);
router.patch("/:id/activate", authMiddleware, adminMiddleware, bookController.activateBook);

export default router;
