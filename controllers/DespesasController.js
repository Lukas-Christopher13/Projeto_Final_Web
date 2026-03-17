import { NextResponse } from "next/server";
import DespesasService from "@/services/DespesasService";

class DespesasController {
  async getTotalDespesas(ano = null) {
    try {
      const despesas = await DespesasService.getTotalDespesas(ano);
      return NextResponse.json(despesas);
    } catch (error) {
      return NextResponse.json(
        { error: error.message || "Erro ao obter despesas" },
        { status: 500 }
      );
    }
  }

  async getTotalDespesasContaCorrente(ano = null) {
    try {
      const despesas = await DespesasService.getDespesasContaCorrente(ano);
      return NextResponse.json(despesas);
    } catch (error) {
      return NextResponse.json(
        { error: error.message || "Erro ao obter despesas da conta corrente" },
        { status: 500 }
      );
    }
  }

  async getDespesasPorMes(mes, ano) {
    try {
      if (!mes || !ano) {
        return NextResponse.json(
          { error: "Mês e ano são obrigatórios" },
          { status: 400 }
        );
      }

      const despesas = await DespesasService.getDespesasPorMes(mes, ano);
      return NextResponse.json(despesas);
    } catch (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
  }

  async createDespesa(body) {
    try {
      const {
        descricao,
        valor,
        data,
        categoria,
        vinculo,
        cartao,
        numeroParcelas = 1
      } = body;

      // Validar campos obrigatórios
      if (!descricao || !valor || !data || !categoria || !vinculo) {
        return NextResponse.json(
          {
            error:
              "Campos obrigatórios faltando: descricao, valor, data, categoria, vinculo"
          },
          { status: 400 }
        );
      }

      const despesas = await DespesasService.createDespesasComParcelas(
        descricao,
        valor,
        data,
        categoria,
        vinculo,
        cartao,
        numeroParcelas
      );

      return NextResponse.json(despesas);
    } catch (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
  }
}

export default new DespesasController();
