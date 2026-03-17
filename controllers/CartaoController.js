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

    async getCartoes() {
        try {
            const cartoes = await CartaoService.getCartoes();
            return NextResponse.json(cartoes);
        } catch (error) {
            return NextResponse.json(
                { error: error.message || "Erro ao buscar cartões" },
                { status: 500 }
            );
        }
    }

    async createCartao(body) {
        try {
        const cartao = await CartaoService.createCartao(body);
        return NextResponse.json(cartao, { status: 201 });
        } catch (error) {
        return NextResponse.json(
            { error: error.message || "Erro ao criar cartão" },
            { status: 400 }
        );
        }
    }

    async updateCartao(id, body) {
        try {
        const cartao = await CartaoService.updateCartao(id, body);

        if (!cartao) {
            return NextResponse.json(
            { error: "Cartão não encontrado" },
            { status: 404 }
            );
        }

        return NextResponse.json(cartao);
        } catch (error) {
        return NextResponse.json(
            { error: error.message || "Erro ao atualizar cartão" },
            { status: 400 }
        );
        }
    }

    async deleteCartao(id) {
        try {
        const cartao = await CartaoService.deleteCartao(id);

        if (!cartao) {
            return NextResponse.json(
            { error: "Cartão não encontrado" },
            { status: 404 }
            );
        }

        return NextResponse.json({
            message: "Cartão removido com sucesso"
        });
        } catch (error) {
        return NextResponse.json(
            { error: error.message || "Erro ao deletar cartão" },
            { status: 500 }
        );
        }
    }

    async despesasPorCartao(ano = null) {
        try {
        const gastos = await CartaoService.despesasPorCartao(ano);
        return NextResponse.json(gastos);
        } catch (error) {
        return NextResponse.json(
            { error: error.message || "Erro ao obter despesas por cartão" },
            { status: 500 }
        );
        }
    }
}

export default new CartaoController()