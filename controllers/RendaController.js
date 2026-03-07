import { NextResponse } from "next/server";
import { connectDB } from "../utils/mongodb";
import RendaService from "@/services/RendaService";

class RendaController {
    async getTotalRenda(ano=null) {
        await connectDB();

        try {
            const rendas = await RendaService.getTotalRenda(ano);
            return NextResponse.json(rendas);
        } catch (error) {
            return NextResponse.json(
                { error: error.message || "Erro ao obter rendas" }, 
                { status: 500 }
            );
        }
    }

    async getRendasPor(ano) {
        await connectDB();

        try {
            const rendas = await RendaService.getRendasPor(ano);
            return NextResponse.json(rendas);
        } catch (error) {
            return NextResponse.json(
                { error: error.message || "Erro ao obter rendas" }, 
                { status: 500 }
            );
        }
    }
}

export default new RendaController();