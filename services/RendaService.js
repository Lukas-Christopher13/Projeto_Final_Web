import RendaRepository from "@/repositories/RendaRepository";

class RendaService {
    async getTotalRenda(ano=null) {
        const rendas = await RendaRepository.getRendaPorAno(ano);
        return rendas.reduce((acc, renda) => acc + renda.valor, 0);
    }

    async getRendasPor(ano) {
        const rendas = await RendaRepository.getRendaPorAno(ano);
        return rendas;
    }
}
export default new RendaService()