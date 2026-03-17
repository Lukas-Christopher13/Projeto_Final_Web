import Despesa from "@/models/Despesa";
import { connectDB } from "../utils/mongodb";

class DespesasRepository {
  async getDespesasPorAno(ano) {
    await connectDB();

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
    await connectDB();

    const inicioAno = new Date(`${ano}-01-01`);
    const fimAno = new Date(`${ano}-12-31`);

    return await Despesa.find({
      data: {
        $gte: inicioAno,
        $lte: fimAno
      },
      vinculo: "conta_corrente"
    }).exec();
  }

  async getDespesasPorMes(mes, ano) {
    await connectDB();

    const inicio = new Date(ano, mes - 1, 1);
    const fim = new Date(ano, mes, 0, 23, 59, 59);

    return await Despesa.find({
      data: {
        $gte: inicio,
        $lte: fim
      }
    }).sort({ data: -1 });
  }

  async createDespesas(despesas) {
    await connectDB();
    return await Despesa.insertMany(despesas);
  }
}

export default new DespesasRepository();
