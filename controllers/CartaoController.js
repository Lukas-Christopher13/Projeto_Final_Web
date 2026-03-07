import { NextResponse } from "next/server";
import { connectDB } from "../utils/mongodb";
import CartaoService from "@/services/CartaoService";

class CartaoController {
    async despesasPorCartao() {
        await connectDB();

        try {
            const gastosPorCartao = await CartaoService.despesasPorCartao();

            return NextResponse.json(gastosPorCartao)
        } catch (error) {
            return NextResponse.json(
                { error: "Erro ao obter gastos por cartão" },
                { status: 500 }
            )
        }
    }
}

export default new CartaoController()