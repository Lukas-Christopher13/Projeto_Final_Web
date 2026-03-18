import Despesa from "@/models/Despesa";
import { connectDB } from "../utils/mongodb";

class DespesasRepository {
  async getDespesasPorAno(ano, userId) {
    await connectDB();

    const inicioAno = new Date(`${ano}-01-01`);
    const fimAno = new Date(`${ano}-12-31`);

    return await Despesa.find({
      data: {
        $gte: inicioAno,
        $lte: fimAno
      },
      usuarioId: userId
    }).exec();
  }

  async getDespesasContaCorrente(ano, userId) {
    await connectDB();

    const inicioAno = new Date(`${ano}-01-01`);
    const fimAno = new Date(`${ano}-12-31`);

    return await Despesa.find({
      data: {
        $gte: inicioAno,
        $lte: fimAno
      },
      vinculo: "conta_corrente",
      usuarioId: userId
    }).exec();
  }

  async getDespesasPorMes(mes, ano, userId) {
    await connectDB();

    const inicio = new Date(ano, mes - 1, 1);
    const fim = new Date(ano, mes, 0, 23, 59, 59);

    return await Despesa.find({
      data: {
        $gte: inicio,
        $lte: fim
      },
      usuarioId: userId
    }).sort({ data: -1 });
  }

  async createDespesas(despesas, userId) {
    await connectDB();
    const payload = despesas.map((d) => ({ ...d, usuarioId: userId }));
    return await Despesa.insertMany(payload);
  }

    async getDespesaById(id, userId) {
        await connectDB();
        return await Despesa.findOne({ _id: id, usuarioId: userId });
    }

    async deleteById(id, userId) {
        await connectDB();
        return await Despesa.findOneAndDelete({ _id: id, usuarioId: userId });
    }

    async deleteByParcelaId(parcelaId, userId) {
        await connectDB();
        return await Despesa.deleteMany({ parcelaId, usuarioId: userId });
    }

    async updateById(id, body, userId) {
        await connectDB();

        return await Despesa.findOneAndUpdate(
            { _id: id, usuarioId: userId },
            body,
            { new: true }
        );
    }
}

export default new DespesasRepository();
