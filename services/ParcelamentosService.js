import ParcelamentosRepository from "@/repositories/ParcelamentosRepository";

class ParcelamentosService {
  async getParcelamentos() {
    const despesas = await ParcelamentosRepository.getFuturesExpenses();

    const indiceParcelaPorId = this._calcularIndicesParcelas(despesas);
    const contadorParcelas = this._contarParcelasPorId(despesas);
    const totalDividas = this._calcularTotalDividas(despesas);
    const resumoMensal = this._agruparPorMes(despesas);
    const detalhesCartao = this._agruparPorCartao(
      despesas,
      indiceParcelaPorId,
      contadorParcelas
    );

    return {
      totalDividas,
      resumoMensal,
      detalhesCartao
    };
  }

  _contarParcelasPorId(despesas) {
    const contador = {};
    despesas.forEach((despesa) => {
      const parcelaId = despesa.parcelaId;
      if (!contador[parcelaId]) {
        contador[parcelaId] = despesas.filter(
          (d) => d.parcelaId === parcelaId
        ).length;
      }
    });
    return contador;
  }

  _calcularIndicesParcelas(despesas) {
    const indices = {};

    despesas.forEach((despesa) => {
      const parcelaId = despesa.parcelaId;

      if (!indices[parcelaId]) {
        indices[parcelaId] = {};
      }

      if (!indices[parcelaId][despesa._id.toString()]) {
        const parcelasDoGrupo = despesas
          .filter((d) => d.parcelaId === parcelaId)
          .sort((a, b) => new Date(a.data) - new Date(b.data));

        const indice =
          parcelasDoGrupo.findIndex(
            (d) => d._id.toString() === despesa._id.toString()
          ) + 1;
        indices[parcelaId][despesa._id.toString()] = indice;
      }
    });

    return indices;
  }

  _calcularTotalDividas(despesas) {
    return despesas.reduce((acc, d) => acc + (d.valor || 0), 0);
  }

  _agruparPorMes(despesas) {
    const resumo = {};

    despesas.forEach((despesa) => {
      const mesChave = despesa.data.toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric"
      });

      if (!resumo[mesChave]) {
        resumo[mesChave] = 0;
      }
      resumo[mesChave] += despesa.valor || 0;
    });

    return resumo;
  }

  _agruparPorCartao(despesas, indiceParcelaPorId, contadorParcelas) {
    const detalhes = {};

    despesas.forEach((despesa) => {
      const parcelaId = despesa.parcelaId;
      const mesChave = despesa.data.toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric"
      });

      const nomeCartao = despesa.cartao?.nome || "Conta Corrente";

      if (!detalhes[nomeCartao]) {
        detalhes[nomeCartao] = {
          nome: nomeCartao,
          tipo: despesa.vinculo,
          cor: despesa.cartao?.cor || "#6B7280",
          total: 0,
          itens: {}
        };
      }

      detalhes[nomeCartao].total += despesa.valor || 0;

      if (!detalhes[nomeCartao].itens[mesChave]) {
        detalhes[nomeCartao].itens[mesChave] = [];
      }

      const indiceAtual = indiceParcelaPorId[parcelaId][despesa._id.toString()];
      const totalParcelas = contadorParcelas[parcelaId];

      detalhes[nomeCartao].itens[mesChave].push({
        descricao: despesa.descricao,
        valor: despesa.valor,
        categoria: despesa.categoria,
        data: despesa.data,
        parcelaInfo:
          totalParcelas > 1 ? `${indiceAtual}/${totalParcelas}` : null
      });
    });

    return detalhes;
  }
}

export default new ParcelamentosService();
