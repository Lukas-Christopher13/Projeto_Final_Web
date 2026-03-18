import { NextResponse } from "next/server";
import CartaoService from "@/services/CartaoService";

class CartaoController {
    async despesasPorCartao(ano = null, userId) {
        try {
            if (ano) {
                let gastosPorCartao = await CartaoService.despesasPorCartao(ano, userId);
                return NextResponse.json(gastosPorCartao)
            }

            let gastosPorCartao = await CartaoService.despesasPorCartao(null, userId);
            return NextResponse.json(gastosPorCartao)
        } catch (error) {
            return NextResponse.json(
                { error: error.message || "Erro ao obter despesas por cartão" },
                { status: 500 }
            )
        }
    }

    async getCartoes(userId) {
        try {
            const cartoes = await CartaoService.getCartoes(userId);
            return NextResponse.json(cartoes);
        } catch (error) {
            return NextResponse.json(
                { error: error.message || "Erro ao buscar cartões" },
                { status: 500 }
            );
        }
    }

    async createCartao(body, userId) {
        try {
        const cartao = await CartaoService.createCartao(body, userId);
        return NextResponse.json(cartao, { status: 201 });
        } catch (error) {
        return NextResponse.json(
            { error: error.message || "Erro ao criar cartão" },
            { status: 400 }
        );
        }
    }

    async updateCartao(id, body, userId) {
        try {
        const cartao = await CartaoService.updateCartao(id, body, userId);

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

    async deleteCartao(id, userId) {
        try {
        const cartao = await CartaoService.deleteCartao(id, userId);

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

    async despesasPorCartao(ano = null, userId) {
        try {
        const gastos = await CartaoService.despesasPorCartao(ano, userId);
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
