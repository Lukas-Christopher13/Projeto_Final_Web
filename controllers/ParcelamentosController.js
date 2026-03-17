import { NextResponse } from "next/server";
import ParcelamentosService from "@/services/ParcelamentosService";

class ParcelamentosController {
  async getFuturesExpenses() {
    try {
      const parcelamentos = await ParcelamentosService.getParcelamentos();
      return NextResponse.json(parcelamentos);
    } catch (error) {
      console.error("Erro ao buscar dívidas:", error);
      return NextResponse.json(
        { error: error.message || "Erro ao buscar dívidas" },
        { status: 500 }
      );
    }
  }
}

export default new ParcelamentosController();
