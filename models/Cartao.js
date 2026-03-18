import mongoose from "mongoose";

const CartaoSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        trim: true
    },

    tipo: {
        type: String,
        required: true,
        enum: ["credito", "debito"]
    },

    titular: {
        type: String,
        required: true,
        trim: true
    },

    ultimos4Digitos: {
        type: String,
        required: true,
        match: /^[0-9]{4}$/
    },

    cor: {
        type: String,
        default: "#6B7280"
    },

    usuarioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

}, {
    timestamps: true
});

export default mongoose.models.Cartao || mongoose.model("Cartao", CartaoSchema);
