import RendaRepository from "@/repositories/RendaRepository";

class RendaService {
    async criarRenda(data) {
        return await RendaRepository.create(data);
    }

    async listarPorMesAno(mes, ano) {
        return await RendaRepository.findByMesAno(mes, ano);
    }

    async getTotalRenda(ano=null) {
        const rendas = await RendaRepository.getRendaPorAno(ano);
        return rendas.reduce((acc, renda) => acc + renda.valor, 0);
    }

    async getRendasPor(ano) {
        const rendas = await RendaRepository.getRendaPorAno(ano);
        return rendas;
    }

    async deletarRenda(id) {
        return await RendaRepository.delete(id);
    }

    async atualizarRenda(id, data) {
        return await RendaRepository.update(id, data);
    }

}
export default new RendaService()