import mongoose from "mongoose";

const AporteSchema = new mongoose.Schema(
    {
        valor: { type: Number, require: true },
        data:  { type: Date,   require: true },
        fonte: { type: String, require: true }
    },
    { timestamps: true }
);

export default mongoose.models.Aporte || mongoose.model("Aporte", AporteSchema)