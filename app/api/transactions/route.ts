import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/utils/mongodb";
import Transaction from "@/models/Transaction";
import { getUserFromRequest } from "@/utils/authHelper";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const user = getUserFromRequest(req);
    if (!user) return NextResponse.json({ success: false, message: "Não autenticado." }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "50");

    const transactions = await Transaction.find({ user: new mongoose.Types.ObjectId(user.id) })
      .sort({ date: -1 })
      .limit(limit);

    return NextResponse.json({ success: true, transactions });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erro ao buscar transações." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const user = getUserFromRequest(req);
    if (!user) return NextResponse.json({ success: false, message: "Não autenticado." }, { status: 401 });

    const { description, amount, type, category, date, notes } = await req.json();

    if (!description || !amount || !type || !category) {
      return NextResponse.json({ success: false, message: "Campos obrigatórios faltando." }, { status: 400 });
    }

    const transaction = await Transaction.create({
      description,
      amount: Math.abs(amount),
      type,
      category,
      date: date || new Date(),
      notes,
      user: new mongoose.Types.ObjectId(user.id),
    });

    return NextResponse.json({ success: true, transaction }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erro ao criar transação." }, { status: 500 });
  }
}
