import Despesa from "@/models/Despesa";

class UserRepository {
    async getDespesasPorAno(ano) {
        const inicioAno = new Date(`${ano}-01-01`);
        const fimAno = new Date(`${ano}-12-31`);
      
        return await Despesa.find({
          data: {
            $gte: inicioAno,
            $lte: fimAno
          }
        }).exec();
    }

    async getDespesasContaCorrente(ano) {
        const inicioAno = new Date(`${ano}-01-01`);
        const fimAno = new Date(`${ano}-12-31`);
      
        return await Despesa.find({
          data: {
            $gte: inicioAno,
            $lte: fimAno
          },
          vinculo: 'conta_corrente'
        }).exec();
    }
}
export default new UserRepository();