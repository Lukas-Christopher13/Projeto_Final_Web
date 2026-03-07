import CartaoRepository from "@/repositories/CartaoRepository"

class CartaoService {
    async despesasPorCartao() {
        const cartaoDespesas = await CartaoRepository.getCartaoDespesas();

        return cartaoDespesas.map(cartao => {
            const totalDespesas = cartao.despesas.reduce((total, despesa) => total + despesa.valor, 0);
            return {
                id: cartao._id,
                nome: cartao.nome,
                total: totalDespesas
            };
        });
    };
}

export default new CartaoService()