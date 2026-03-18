import Aporte from "../models/Aporte";
import { connectDB } from "../utils/mongodb";
class AporteRepository {
    async findAll(userId) {
        await connectDB();
        return await Aporte.find({ usuarioId: userId });
    }

    async create(aporte, userId) {
        await connectDB();
        return await Aporte.create({ ...aporte, usuarioId: userId })
    }

    async findByIdAndDelete(id, userId) {
        await connectDB();
        return await Aporte.findOneAndDelete({ _id: id, usuarioId: userId })
    }

    async update(id, body, userId) {
        await connectDB();
        return await Aporte.findOneAndUpdate(
            { _id: id, usuarioId: userId },
            body,
            { new: true }
        )
    }
}

export default new AporteRepository();
