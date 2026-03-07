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
    }

}, {
    timestamps: true
});

export default mongoose.models.CartaoSchema || mongoose.model("Cartao", CartaoSchema);