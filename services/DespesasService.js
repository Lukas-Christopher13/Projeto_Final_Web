import DespesasRepository from "@/repositories/DespesasRepository";
import { v4 as uuidv4 } from "uuid";

class DespesasService {
  async getTotalDespesas(ano = null) {
    const despesas = await DespesasRepository.getDespesasPorAno(ano);
    return despesas.reduce((acc, despesa) => acc + despesa.valor, 0);
  }

  async getDespesasContaCorrente(ano = null) {
    const despesas = await DespesasRepository.getDespesasContaCorrente(ano);
    return despesas.reduce((acc, despesa) => acc + despesa.valor, 0);
  }

  async getDespesasPorMes(mes, ano) {
    return await DespesasRepository.getDespesasPorMes(mes, ano);
  }

  async createDespesasComParcelas(
    descricao,
    valor,
    data,
    categoria,
    vinculo,
    cartao,
    numeroParcelas = 1
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

    return await DespesasRepository.createDespesas(despesas);
  }

    async deleteDespesa(id, deleteAll = false) {

    const despesa = await DespesasRepository.getDespesaById(id);

    if (!despesa) return null;

    if (deleteAll) {
        await DespesasRepository.deleteByParcelaId(despesa.parcelaId);
        return { message: "Todas as parcelas deletadas" };
    }

    await DespesasRepository.deleteById(id);

    return { message: "Despesa deletada" };
    }

    async updateDespesa(id, body) {
    return await DespesasRepository.updateById(id, body);
    }
}

export default new DespesasService();
