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
    const now = new Date();
    const targetMonth = parseInt(searchParams.get("month") || String(now.getMonth() + 1));
    const targetYear  = parseInt(searchParams.get("year")  || String(now.getFullYear()));

    const startDate = new Date(targetYear, targetMonth - 1, 1);
    const endDate   = new Date(targetYear, targetMonth, 0, 23, 59, 59);

    const userId = new mongoose.Types.ObjectId(user.id);
    const matchStage = { user: userId, date: { $gte: startDate, $lte: endDate } };

    const totals = await Transaction.aggregate([
      { $match: matchStage },
      { $group: { _id: "$type", total: { $sum: "$amount" }, count: { $sum: 1 } } },
    ]);

    const expensesByCategory = await Transaction.aggregate([
      { $match: { ...matchStage, type: "expense" } },
      { $group: { _id: "$category", total: { $sum: "$amount" }, count: { $sum: 1 } } },
      { $sort: { total: -1 } },
    ]);

    const topExpenses = await Transaction.find({ ...matchStage, type: "expense" })
      .sort({ amount: -1 })
      .limit(5)
      .lean();

    const income  = totals.find((r) => r._id === "income")?.total  || 0;
    const expense = totals.find((r) => r._id === "expense")?.total || 0;

    return NextResponse.json({
      success: true,
      summary: { income, expense, balance: income - expense, month: targetMonth, year: targetYear, expensesByCategory, topExpenses },
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erro ao calcular resumo." }, { status: 500 });
  }
}
