import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/utils/mongodb";
import User from "@/models/User";
import { getUserFromRequest } from "@/utils/authHelper";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const user = getUserFromRequest(req);
    if (!user || user.role !== "admin") return NextResponse.json({ success: false, message: "Acesso negado." }, { status: 403 });

    const totalMembers  = await User.countDocuments({ role: "member" });
    const activeMembers = await User.countDocuments({ role: "member", isActive: true });

    return NextResponse.json({ success: true, stats: { totalMembers, activeMembers, inactiveMembers: totalMembers - activeMembers } });
  } catch {
    return NextResponse.json({ success: false, message: "Erro ao buscar estatísticas." }, { status: 500 });
  }
}
