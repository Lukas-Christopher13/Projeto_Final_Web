import { connectDB } from "@/utils/mongodb";
import Despesa from "@/models/Despesa";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
  await connectDB();
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const deleteAll = searchParams.get("deleteAll") === "true";

  try {
    if (deleteAll) {
      const despesa = await Despesa.findById(id);
      if (!despesa) {
        return NextResponse.json({ error: "Despesa não encontrada" }, { status: 404 });
      }
      await Despesa.deleteMany({ parcelaId: despesa.parcelaId });
      return NextResponse.json({ message: "Todas as parcelas deletadas" });
    } else {
      await Despesa.findByIdAndDelete(id);
      return NextResponse.json({ message: "Despesa deletada" });
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  await connectDB();
  const { id } = await params;
  const body = await req.json();

  try {
    const despesa = await Despesa.findByIdAndUpdate(
      id,
      body,
      { new: true, returnDocument: "after" }
    );

    if (!despesa) {
      return NextResponse.json({ error: "Despesa não encontrada" }, { status: 404 });
    }

    return NextResponse.json(despesa);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
