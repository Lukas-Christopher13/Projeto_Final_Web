import Aporte from "../models/Aporte";

class AporteRepository {
    async findAll() {
        return await Aporte.find();
    }

    async create(aporte) {
        return await Aporte.create(aporte)
    }

    async findByIdAndDelete(id) {
        return await Aporte.findByIdAndDelete(id)
    }

    async update(id, body) {
        return await Aporte.findByIdAndUpdate(id, body, {new: true})
    }
}

export default new AporteRepository();

