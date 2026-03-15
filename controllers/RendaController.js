import { NextResponse } from "next/server";
import { connectDB } from "../utils/mongodb";
import RendaService from "@/services/RendaService";

class RendaController {
    async criar(req) {
        await connectDB();
        const body = await req.json();

        const renda = await RendaService.criarRenda(body);

        return Response.json(renda);
    }

    async listar(req) {
        await connectDB();
        const { searchParams } = new URL(req.url);

        const mes = parseInt(searchParams.get("mes"));
        const ano = parseInt(searchParams.get("ano"));

        const rendas = await RendaService.listarPorMesAno(mes, ano);

        return Response.json(rendas);
    }

    async deletar(id) {
        await connectDB();
        await RendaService.deletarRenda(id);

        return Response.json({ message: "Renda deletada" });
    }

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

    async atualizar(req, id) {
        const body = await req.json();

        const renda = await RendaService.atualizarRenda(id, body);

        return Response.json(renda);
    }

}

export default new RendaController();