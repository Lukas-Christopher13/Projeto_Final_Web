import Renda from "@/models/Renda";

class RendaRepository {
    async getRendaPorAno(ano) {
        const inicioAno = new Date(`${ano}-01-01`);
        const fimAno = new Date(`${ano}-12-31`);
      
        return await Renda.find({
          data: {
            $gte: inicioAno,
            $lte: fimAno
          }
        }).exec();
    }
}

export default new RendaRepository();