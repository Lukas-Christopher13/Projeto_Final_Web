import mongoose from "mongoose";

const DespesaSchema = new mongoose.Schema({
    descricao: {
        type: String,
        required: true,
        trim: true
    },

    valor: {
        type: Number,
        required: true,
        min: 0
    },

    data: {
        type: Date,
        required: true
    },

    categoria: {
        type: String,
        required: true,
    },

    numeroParcelas: {
        type: Number,
        default: 1,
        min: 1
    },

    vinculo: {
        type: String,
        required: true,
        enum: ["conta_corrente", "cartao_credito"]
    },

    cartao: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cartao",
        required: false
    },

    usuarioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    parcelaId: {
        type: String,
        required: false
    }

}, {
    timestamps: true
});
export default mongoose.models.Despesa || mongoose.model("Despesa", DespesaSchema);
