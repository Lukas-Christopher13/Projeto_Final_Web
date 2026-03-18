import RendaRepository from "@/repositories/RendaRepository";

class RendaService {
    async criarRenda(data, userId) {
        return await RendaRepository.create(data, userId);
    }

    async listarPorMesAno(mes, ano, userId) {
        return await RendaRepository.findByMesAno(mes, ano, userId);
    }

    async getTotalRenda(ano=null, userId) {
        const rendas = await RendaRepository.getRendaPorAno(ano, userId);
        return rendas.reduce((acc, renda) => acc + renda.valor, 0);
    }

    async getRendasPor(ano, userId) {
        const rendas = await RendaRepository.getRendaPorAno(ano, userId);
        return rendas;
    }

    async deletarRenda(id, userId) {
        return await RendaRepository.delete(id, userId);
    }

    async atualizarRenda(id, data, userId) {
        return await RendaRepository.update(id, data, userId);
    }

}
export default new RendaService()
