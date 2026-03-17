import CartaoRepository from "@/repositories/CartaoRepository"

class CartaoService {

    async getCartoes() {
        return await CartaoRepository.getCartoes();
    }

    async createCartao(body) {

        const cartao = {
        nome: body.nome,
        tipo: body.tipo,
        titular: body.titular,
        ultimos4Digitos: body.ultimos4Digitos,
        cor: body.cor || "#6B7280"
        };

        return await CartaoRepository.createCartao(cartao);
    }

    async updateCartao(id, body) {
        return await CartaoRepository.updateCartao(id, body);
    }

    async deleteCartao(id) {
        return await CartaoRepository.deleteCartao(id);
    }

    async despesasPorCartao(ano=null) {
        let cartaoDespesas;

        if (ano) cartaoDespesas = await CartaoRepository.getCartaoDespesasPorAno(ano);
        else cartaoDespesas = await CartaoRepository.getCartaoDespesas(); 

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