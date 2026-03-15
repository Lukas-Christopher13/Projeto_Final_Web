import { connectDB } from "@/utils/mongodb";
import Cartao from "@/models/Cartao";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const cartoes = await Cartao.find().sort({ createdAt: -1 });
    return NextResponse.json(cartoes);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Erro ao buscar cartões" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const novoCartao = new Cartao({
      nome: body.nome,
      tipo: body.tipo,
      titular: body.titular,
      ultimos4Digitos: body.ultimos4Digitos,
      cor: body.cor || "#6B7280"
    });

    const cartaoSalvo = await novoCartao.save();
    return NextResponse.json(cartaoSalvo, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Erro ao criar cartão" },
      { status: 400 }
    );
  }
}
