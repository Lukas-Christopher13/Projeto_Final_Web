import Despesa from "@/models/Despesa";
import Cartao from "@/models/Cartao"; 

class ParcelamentosRepository {
  async getFuturesExpenses() {
    const hoje = new Date();
    const mesAtual = hoje.getMonth() + 1;
    const anoAtual = hoje.getFullYear();

    return await Despesa.find({
      $expr: {
        $or: [
          { $gt: [{ $year: "$data" }, anoAtual] },
          {
            $and: [
              { $eq: [{ $year: "$data" }, anoAtual] },
              { $gte: [{ $month: "$data" }, mesAtual] }
            ]
          }
        ]
      }
    })
      .populate("cartao")
      .sort({ data: 1 });
  }
}

export default new ParcelamentosRepository();
