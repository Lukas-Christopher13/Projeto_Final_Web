import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/utils/mongodb";
import User from "@/models/User";
import { getUserFromRequest } from "@/utils/authHelper";
import bcrypt from "bcryptjs";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const user = getUserFromRequest(req);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, message: "Acesso negado." }, { status: 403 });
    }
    const members = await User.find({ role: "member" }).select("-password").sort({ createdAt: -1 });
    return NextResponse.json({ success: true, members });
  } catch {
    return NextResponse.json({ success: false, message: "Erro ao buscar membros." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const user = getUserFromRequest(req);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, message: "Acesso negado." }, { status: 403 });
    }

    const { name, email, password } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json({ success: false, message: "Nome, e-mail e senha são obrigatórios." }, { status: 400 });
    }

    const exists = await User.findOne({ email });
    if (exists) return NextResponse.json({ success: false, message: "E-mail já cadastrado." }, { status: 409 });

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({ name, email, password: hashedPassword, role: "member", isActive: true });

    return NextResponse.json({ success: true, user: newUser }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, message: "Erro ao criar membro." }, { status: 500 });
  }
}
