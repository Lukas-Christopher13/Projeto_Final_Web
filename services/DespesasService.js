import DespesasRepository from "@/repositories/DespesasRepository";

class DespesasService {
    async getTotalDespesas(ano=null) {
        const despesas = await DespesasRepository.getDespesasPorAno(ano);
        return despesas.reduce((acc, despesa) => acc + despesa.valor, 0);
    }

    async getDespesasContaCorrente(ano=null) {
        const despesas = await DespesasRepository.getDespesasContaCorrente(ano);
        return despesas.reduce((acc, despesa) => acc + despesa.valor, 0);
    }
}
export default new DespesasService()