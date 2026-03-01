import Aporte from "../models/Aporte";

class AporteRepository {
    async findAll() {
        return await Aporte.find();
    }

    async create(aporte) {
        return await Aporte.create(aporte)
    }
}

export default new AporteRepository();

