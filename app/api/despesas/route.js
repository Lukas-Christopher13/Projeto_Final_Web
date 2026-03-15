import { connectDB } from "@/utils/mongodb";
import Despesa from "@/models/Despesa";
import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";

export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);

  const mes = parseInt(searchParams.get("mes"));
  const ano = parseInt(searchParams.get("ano"));

  if (!mes || !ano) {
    return NextResponse.json({ error: "Mês e ano são obrigatórios" }, { status: 400 });
  }

  const inicio = new Date(ano, mes - 1, 1);
  const fim = new Date(ano, mes, 0, 23, 59, 59);

  try {
    const despesas = await Despesa.find({
      data: {
        $gte: inicio,
        $lte: fim
      }
    }).sort({ data: -1 });

    return NextResponse.json(despesas);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  await connectDB();
  const body = await req.json();
  
  const { descricao, valor, data, categoria, vinculo, cartao, numeroParcelas = 1 } = body;

  try {
    const parcelaId = uuidv4();
    const despesas = [];

    for (let i = 0; i < numeroParcelas; i++) {
      const dataParc = new Date(data);
      dataParc.setMonth(dataParc.getMonth() + i);

      const despesa = await Despesa.create({
        descricao,
        valor: valor / numeroParcelas,
        data: dataParc,
        categoria,
        vinculo,
        cartao: cartao || null,
        numeroParcelas,
        parcelaId
      });

      despesas.push(despesa);
    }

    return NextResponse.json(despesas);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
