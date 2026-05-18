import mongoose from "mongoose";

const BookSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: true,
      trim: true,
    },
    autor: {
      type: String,
      required: true,
      trim: true,
    },
    categoria: {
      type: String,
      trim: true,
    },
    ano: {
      type: Number,
    },
    quantidadeTotal: {
      type: Number,
      required: true,
      min: 1,
    },
    quantidadeDisponivel: {
      type: Number,
      required: true,
      min: 0,
    },
    ativo: {
      type: Boolean,
      default: true,
    },
  },
  {
    collection: "books",
    timestamps: true,
  }
);

export default mongoose.model("Book", BookSchema);
