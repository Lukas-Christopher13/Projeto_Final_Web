import { connectDB } from "@/utils/mongodb";
import Despesa from "@/models/Despesa";
import Cartao from "@/models/Cartao";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    // Busca todas as despesas futuras (a partir do mês atual ou próximos meses)
    const hoje = new Date();
    const mesAtual = hoje.getMonth() + 1;
    const anoAtual = hoje.getFullYear();

    const despesas = await Despesa.find({
      $expr: {
        $or: [
          { $gt: [{ $year: "$data" }, anoAtual] },
          {
            $and: [
              { $eq: [{ $year: "$data" }, anoAtual] },
              { $gte: [{ $month: "$data" }, mesAtual] }
            ]
          }
        ]
      }
    })
      .populate("cartao")
      .sort({ data: 1 });

    // Calcular índice de cada parcela por parcelaId
    const indiceParcelaPorId = {};
    const contadorParcelas = {};

    despesas.forEach((despesa) => {
      const parcelaId = despesa.parcelaId;
      
      // Contar total de parcelas deste grupo
      if (!contadorParcelas[parcelaId]) {
        contadorParcelas[parcelaId] = despesas.filter(d => d.parcelaId === parcelaId).length;
      }

      // Calcular o índice desta parcela
      if (!indiceParcelaPorId[parcelaId]) {
        indiceParcelaPorId[parcelaId] = {};
      }
      
      // Se ainda não calculamos o índice para este ID
      if (!indiceParcelaPorId[parcelaId][despesa._id.toString()]) {
        const parcelasDoGrupo = despesas
          .filter(d => d.parcelaId === parcelaId)
          .sort((a, b) => new Date(a.data) - new Date(b.data));
        
        const indice = parcelasDoGrupo.findIndex(d => d._id.toString() === despesa._id.toString()) + 1;
        indiceParcelaPorId[parcelaId][despesa._id.toString()] = indice;
      }
    });

    // Calcular total de dívidas
    const totalDividas = despesas.reduce((acc, d) => acc + (d.valor || 0), 0);

    // Agrupar por mês e cartão
    const resumoMensal = {};
    const detalhesCartao = {};

    despesas.forEach((despesa) => {
      const parcelaId = despesa.parcelaId;
      const mesChave = despesa.data.toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric"
      });

      // Resumo mensal (Geral)
      if (!resumoMensal[mesChave]) {
        resumoMensal[mesChave] = 0;
      }
      resumoMensal[mesChave] += despesa.valor || 0;

      // Detalhes por Cartão
      const nomeCartao = despesa.cartao?.nome || "Conta Corrente";
      if (!detalhesCartao[nomeCartao]) {
        detalhesCartao[nomeCartao] = {
          nome: nomeCartao,
          tipo: despesa.vinculo,
          cor: despesa.cartao?.cor || "#6B7280",
          total: 0,
          itens: {}
        };
      }

      detalhesCartao[nomeCartao].total += despesa.valor || 0;

      if (!detalhesCartao[nomeCartao].itens[mesChave]) {
        detalhesCartao[nomeCartao].itens[mesChave] = [];
      }

      const indiceAtual = indiceParcelaPorId[parcelaId][despesa._id.toString()];
      const totalParcelas = contadorParcelas[parcelaId];

      detalhesCartao[nomeCartao].itens[mesChave].push({
        descricao: despesa.descricao,
        valor: despesa.valor,
        categoria: despesa.categoria,
        data: despesa.data,
        parcelaInfo: totalParcelas > 1 ? `${indiceAtual}/${totalParcelas}` : null
      });
    });

    return NextResponse.json({
      totalDividas,
      resumoMensal,
      detalhesCartao
    });
  } catch (error) {
    console.error("Erro ao buscar dívidas:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao buscar dívidas" },
      { status: 500 }
    );
  }
}
