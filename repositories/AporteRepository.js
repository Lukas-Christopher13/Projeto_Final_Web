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
}

export default new AporteRepository();

