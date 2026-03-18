import Despesa from "@/models/Despesa";
import Cartao from "@/models/Cartao";
import { connectDB } from "../utils/mongodb";

class ParcelamentosRepository {
  async getFuturesExpenses(userId) {
    await connectDB();

    const inicioMesAtual = new Date();
    inicioMesAtual.setDate(1);
    inicioMesAtual.setHours(0, 0, 0, 0);

    return await Despesa.find({
      data: { $gte: inicioMesAtual },
      usuarioId: userId
    })
      .populate("cartao")
      .sort({ data: 1 });
  }
}

export default new ParcelamentosRepository();
