import { connectDB } from "@/utils/mongodb";
import Cartao from "@/models/Cartao";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    const cartaoAtualizado = await Cartao.findByIdAndUpdate(
      id,
      {
        nome: body.nome,
        tipo: body.tipo,
        titular: body.titular,
        ultimos4Digitos: body.ultimos4Digitos,
        cor: body.cor
      },
      { new: true, runValidators: true }
    );

    if (!cartaoAtualizado) {
      return NextResponse.json(
        { error: "Cartão não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(cartaoAtualizado);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Erro ao atualizar cartão" },
      { status: 400 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const cartaoDeletado = await Cartao.findByIdAndDelete(id);

    if (!cartaoDeletado) {
      return NextResponse.json(
        { error: "Cartão não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Cartão removido com sucesso" }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Erro ao deletar cartão" },
      { status: 500 }
    );
  }
}
