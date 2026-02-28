import Aporte from "../models/Aporte";

class AporteRepository {
    async findAll() {
        return await Aporte.find();
    }
}

export default new AporteRepository();

