import CartaoRepository from "@/repositories/CartaoRepository"

class CartaoService {

    async getCartoes(userId) {
        return await CartaoRepository.getCartoes(userId);
    }

    async createCartao(body, userId) {

        const cartao = {
        nome: body.nome,
        tipo: body.tipo,
        titular: body.titular,
        ultimos4Digitos: body.ultimos4Digitos,
        cor: body.cor || "#6B7280"
        };

        return await CartaoRepository.createCartao(cartao, userId);
    }

    async updateCartao(id, body, userId) {
        return await CartaoRepository.updateCartao(id, body, userId);
    }

    async deleteCartao(id, userId) {
        return await CartaoRepository.deleteCartao(id, userId);
    }

    async despesasPorCartao(ano=null, userId) {
        let cartaoDespesas;

        if (ano) cartaoDespesas = await CartaoRepository.getCartaoDespesasPorAno(ano, userId);
        else cartaoDespesas = await CartaoRepository.getCartaoDespesas(userId); 

        const despesasPorCartao = cartaoDespesas.map(cartao => {
            const totalDespesas = cartao.despesas.reduce((total, despesa) => total + despesa.valor, 0);
            return {
                id: cartao._id,
                nome: cartao.nome,
                cor: cartao.cor,
                total: totalDespesas
            };
        });

        return despesasPorCartao.sort(a => a.total).reverse();
    };
}

export default new CartaoService()
