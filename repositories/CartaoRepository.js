import Cartao from "@/models/Cartao";
import { connectDB } from "../utils/mongodb";

class CartaoRepository {

    async getCartoes() {
        await connectDB();
        return await Cartao.find().sort({ createdAt: -1 });
    }

    async createCartao(cartao) {
        await connectDB();
        return await Cartao.create(cartao);
    }

    async updateCartao(id, body) {
        await connectDB();

        return await Cartao.findByIdAndUpdate(
        id,
        body,
        { new: true, runValidators: true }
        );
    }

    async deleteCartao(id) {
        await connectDB();
        return await Cartao.findByIdAndDelete(id);
    }

    async getCartaoDespesas() {
        await connectDB();
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
        await connectDB();
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
                    cor: { $first: "$cor" },
                    limite: { $first: "$limite" },
                    despesas: { $push: "$despesas" }
                }
            }
        ]);

        return resultado;
    }
}
export default new CartaoRepository()