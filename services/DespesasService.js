import DespesasRepository from "@/repositories/DespesasRepository";
import { v4 as uuidv4 } from "uuid";

class DespesasService {
  async getTotalDespesas(ano = null, userId) {
    const despesas = await DespesasRepository.getDespesasPorAno(ano, userId);
    return despesas.reduce((acc, despesa) => acc + despesa.valor, 0);
  }

  async getDespesasContaCorrente(ano = null, userId) {
    const despesas = await DespesasRepository.getDespesasContaCorrente(ano, userId);
    return despesas.reduce((acc, despesa) => acc + despesa.valor, 0);
  }

  async getDespesasPorMes(mes, ano, userId) {
    return await DespesasRepository.getDespesasPorMes(mes, ano, userId);
  }

  async createDespesasComParcelas(
    descricao,
    valor,
    data,
    categoria,
    vinculo,
    cartao,
    numeroParcelas = 1,
    userId
  ) {
    const parcelaId = uuidv4();
    const despesas = [];

    for (let i = 0; i < numeroParcelas; i++) {
      const dataParc = new Date(data);
      dataParc.setMonth(dataParc.getMonth() + i);

      const despesa = {
        descricao,
        valor: valor / numeroParcelas,
        data: dataParc,
        categoria,
        vinculo,
        cartao: cartao || null,
        numeroParcelas,
        parcelaId
      };

      despesas.push(despesa);
    }

    return await DespesasRepository.createDespesas(despesas, userId);
  }

    async deleteDespesa(id, deleteAll = false, userId) {

    const despesa = await DespesasRepository.getDespesaById(id, userId);

    if (!despesa) return null;

    if (deleteAll) {
        await DespesasRepository.deleteByParcelaId(despesa.parcelaId, userId);
        return { message: "Todas as parcelas deletadas" };
    }

    await DespesasRepository.deleteById(id, userId);

    return { message: "Despesa deletada" };
    }

    async updateDespesa(id, body, userId) {
    return await DespesasRepository.updateById(id, body, userId);
    }
}

export default new DespesasService();
