import { NextResponse } from "next/server";
import CartaoService from "@/services/CartaoService";

class CartaoController {
    async despesasPorCartao(ano = null) {
        try {
            if (ano) {
                let gastosPorCartao = await CartaoService.despesasPorCartao(ano);
                return NextResponse.json(gastosPorCartao)
            }

            let gastosPorCartao = await CartaoService.despesasPorCartao();
            return NextResponse.json(gastosPorCartao)
        } catch (error) {
            return NextResponse.json(
                { error: error.message || "Erro ao obter despesas por cartão" },
                { status: 500 }
            )
        }
    }
}

export default new CartaoController()