import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/utils/mongodb";
import Transaction from "@/models/Transaction";
import { getUserFromRequest } from "@/utils/authHelper";
import mongoose from "mongoose";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const user = getUserFromRequest(req);
    if (!user) return NextResponse.json({ success: false, message: "Não autenticado." }, { status: 401 });

    const transaction = await Transaction.findOne({
      _id: new mongoose.Types.ObjectId(params.id),
      user: new mongoose.Types.ObjectId(user.id),
    });

    if (!transaction) return NextResponse.json({ success: false, message: "Transação não encontrada." }, { status: 404 });

    await transaction.deleteOne();
    return NextResponse.json({ success: true, message: "Transação removida." });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erro ao remover transação." }, { status: 500 });
  }
}
