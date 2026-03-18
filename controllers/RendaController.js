import { NextResponse } from "next/server";
import RendaService from "@/services/RendaService";

class RendaController {
    async criar(req, userId) {
        const body = await req.json();

        const renda = await RendaService.criarRenda(body, userId);

        return Response.json(renda);
    }

    async listar(req, userId) {
        const { searchParams } = new URL(req.url);

        const mes = parseInt(searchParams.get("mes"));
        const ano = parseInt(searchParams.get("ano"));

        const rendas = await RendaService.listarPorMesAno(mes, ano, userId);

        return Response.json(rendas);
    }

    async deletar(id, userId) {
        await RendaService.deletarRenda(id, userId);

        return Response.json({ message: "Renda deletada" });
    }

    async getTotalRenda(ano=null, userId) {

        try {
            const rendas = await RendaService.getTotalRenda(ano, userId);
            return NextResponse.json(rendas);
        } catch (error) {
            return NextResponse.json(
                { error: error.message || "Erro ao obter rendas" }, 
                { status: 500 }
            );
        }
    }

    async getRendasPor(ano, userId) {

        try {
            const rendas = await RendaService.getRendasPor(ano, userId);
            return NextResponse.json(rendas);
        } catch (error) {
            return NextResponse.json(
                { error: error.message || "Erro ao obter rendas" }, 
                { status: 500 }
            );
        }
    }

    async atualizar(req, id, userId) {
        const body = await req.json();

        const renda = await RendaService.atualizarRenda(id, body, userId);

        return Response.json(renda);
    }

}

export default new RendaController();
