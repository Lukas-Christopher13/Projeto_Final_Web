import { NextResponse } from "next/server";
import { connectDB } from "../utils/mongodb";
import DespesasService from "@/services/DespesasService";

class DespesasController {
    async getTotalDespesas(ano=null) {
        await connectDB();

        try {
            const despesas = await DespesasService.getTotalDespesas(ano);
            return NextResponse.json(despesas);
        } catch (error) {
            return NextResponse.json(
                { error: error.message || "Erro ao obter despesas" }, 
                { status: 500 }
            );
        }
    }

    async getTotalDespesasContaCorrente(ano=null) {
        await connectDB();

        try {
            const despesas = await DespesasService.getDespesasContaCorrente(ano);
            return NextResponse.json(despesas);
        } catch (error) {
            return NextResponse.json(
                { error: error.message || "Erro ao obter despesas da conta corrente" }, 
                { status: 500 }
            );
        }      
    }
}

export default new DespesasController();