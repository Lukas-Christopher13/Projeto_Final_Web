import CartaoRepository from "@/repositories/CartaoRepository"

class CartaoService {
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