import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/utils/mongodb";
import User from "@/models/User";
import { getUserFromRequest } from "@/utils/authHelper";
import mongoose from "mongoose";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const user = getUserFromRequest(req);
    if (!user || user.role !== "admin") return NextResponse.json({ success: false, message: "Acesso negado." }, { status: 403 });

    const member = await User.findById(new mongoose.Types.ObjectId(params.id));
    if (!member) return NextResponse.json({ success: false, message: "Usuário não encontrado." }, { status: 404 });
    if (member.role === "admin") return NextResponse.json({ success: false, message: "Não é possível desativar um admin." }, { status: 403 });

    member.isActive = !member.isActive;
    await member.save();

    return NextResponse.json({ success: true, user: member });
  } catch {
    return NextResponse.json({ success: false, message: "Erro ao atualizar membro." }, { status: 500 });
  }
}
