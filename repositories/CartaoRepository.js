import Cartao from "@/models/Cartao";

class CartaoRepository {
    async getCartaoDespesas() {
        const resultado = await Cartao.aggregate([
            {
                $lookup: {
                    from: "despesas",
                    localField: "_id",
                    foreignField: "cartao",
                    as: "despesas"
                }
            },
        ]);

        return resultado
    }

    async getCartaoDespesasPorAno(ano) {
        const inicioAno = new Date(`${ano}-01-01`);
        const fimAno = new Date(`${ano}-12-31`);

        const resultado = await Cartao.aggregate([
            {
                $lookup: {
                    from: "despesas",
                    localField: "_id",
                    foreignField: "cartao",
                    as: "despesas"
                }
            },
            {
                $unwind: "$despesas"
            },
            {
                $match: {
                    "despesas.data": {
                        $gte: inicioAno,
                        $lte: fimAno
                    }
                }
            },
            {
                $group: {
                    _id: "$_id",
                    nome: { $first: "$nome" },
                    limite: { $first: "$limite" },
                    despesas: { $push: "$despesas" }
                }
            }
        ]);

        return resultado;
    }
}
export default new CartaoRepository()