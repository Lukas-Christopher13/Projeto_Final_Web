import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/utils/mongodb";
import User from "@/models/User";
import { getUserFromRequest } from "@/utils/authHelper";
import mongoose from "mongoose";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params;
  try {
    await connectDB();
    const user = getUserFromRequest(req);
    if (!user || user.role !== "admin") return NextResponse.json({ success: false, message: "Acesso negado." }, { status: 403 });

    const member = await User.findById(new mongoose.Types.ObjectId(id));
    if (!member) return NextResponse.json({ success: false, message: "Usuário não encontrado." }, { status: 404 });
    if (member.role === "admin") return NextResponse.json({ success: false, message: "Não é possível excluir um admin." }, { status: 403 });

    await member.deleteOne();
    return NextResponse.json({ success: true, message: "Membro removido." });
  } catch {
    return NextResponse.json({ success: false, message: "Erro ao remover membro." }, { status: 500 });
  }
}
