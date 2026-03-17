import Aporte from "../models/Aporte";
import { connectDB } from "../utils/mongodb";
class AporteRepository {
    async findAll() {
        await connectDB();
        return await Aporte.find();
    }

    async create(aporte) {
        await connectDB();
        return await Aporte.create(aporte)
    }

    async findByIdAndDelete(id) {
        await connectDB();
        return await Aporte.findByIdAndDelete(id)
    }

    async update(id, body) {
        await connectDB();
        return await Aporte.findByIdAndUpdate(id, body, {new: true})
    }
}

export default new AporteRepository();

