import mongoose from "mongoose";

const LoanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    dataEmprestimo: {
      type: Date,
      default: Date.now,
    },
    dataPrevistaDevolucao: {
      type: Date,
      required: true,
    },
    dataDevolucao: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["ativo", "devolvido", "atrasado"],
      default: "ativo",
    },
    multa: {
      type: Number,
      default: 0,
    },
  },
  {
    collection: "loans",
    timestamps: true,
  }
);

export default mongoose.model("Loan", LoanSchema);
