import Cartao from "@/models/Cartao";
import mongoose from "mongoose";
import { connectDB } from "../utils/mongodb";

class CartaoRepository {

    async getCartoes(userId) {
        await connectDB();
        return await Cartao.find({ usuarioId: userId }).sort({ createdAt: -1 });
    }

    async createCartao(cartao, userId) {
        await connectDB();
        return await Cartao.create({ ...cartao, usuarioId: userId });
    }

    async updateCartao(id, body, userId) {
        await connectDB();

        return await Cartao.findOneAndUpdate(
        { _id: id, usuarioId: userId },
        body,
        { new: true, runValidators: true }
        );
    }

    async deleteCartao(id, userId) {
        await connectDB();
        return await Cartao.findOneAndDelete({ _id: id, usuarioId: userId });
    }

    async getCartaoDespesas(userId) {
        await connectDB();
        const userObjectId = new mongoose.Types.ObjectId(userId);
        const resultado = await Cartao.aggregate([
            {
                $match: { usuarioId: userObjectId }
            },
            {
                $lookup: {
                    from: "despesas",
                    let: { cartaoId: "$_id", usuarioId: "$usuarioId" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$cartao", "$$cartaoId"] },
                                        { $eq: ["$usuarioId", "$$usuarioId"] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "despesas"
                }
            },
        ]);

        return resultado
    }

    async getCartaoDespesasPorAno(ano, userId) {
        await connectDB();
        const inicioAno = new Date(`${ano}-01-01`);
        const fimAno = new Date(`${ano}-12-31`);
        const userObjectId = new mongoose.Types.ObjectId(userId);

        const resultado = await Cartao.aggregate([
            {
                $match: { usuarioId: userObjectId }
            },
            {
                $lookup: {
                    from: "despesas",
                    let: { cartaoId: "$_id", usuarioId: "$usuarioId" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$cartao", "$$cartaoId"] },
                                        { $eq: ["$usuarioId", "$$usuarioId"] }
                                    ]
                                }
                            }
                        }
                    ],
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
