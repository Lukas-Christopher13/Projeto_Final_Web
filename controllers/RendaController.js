import { NextResponse } from "next/server";
import RendaService from "@/services/RendaService";

class RendaController {
    async criar(req) {
        const body = await req.json();

        const renda = await RendaService.criarRenda(body);

        return Response.json(renda);
    }

    async listar(req) {
        const { searchParams } = new URL(req.url);

        const mes = parseInt(searchParams.get("mes"));
        const ano = parseInt(searchParams.get("ano"));

        const rendas = await RendaService.listarPorMesAno(mes, ano);

        return Response.json(rendas);
    }

    async deletar(id) {
        await RendaService.deletarRenda(id);

        return Response.json({ message: "Renda deletada" });
    }

    async getTotalRenda(ano=null) {

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