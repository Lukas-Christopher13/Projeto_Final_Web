import mongoose from "mongoose";

const RendaSchema = new mongoose.Schema({
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
    tipo: {
        type: String,
        required: true,
    },
    data: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
});
export default mongoose.models.Renda || mongoose.model("Renda", RendaSchema);
