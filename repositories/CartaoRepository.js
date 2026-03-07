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
}

export default new CartaoRepository()