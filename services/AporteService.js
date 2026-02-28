import AporteRepository from "../repositories/AporteRepository";

class AporteService {
    async getAllAportes() {
        return await AporteRepository.findAll();
    }
}

export default new AporteService();