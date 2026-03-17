import { NextResponse } from "next/server";
import GraphBarCharService from "@/services/GraphBarCharService";

class GrapBarChartController {
    async getGraphBarCharData(ano) {

        try {
            const data = await GraphBarCharService.getGrapBarCharData(ano);
            return NextResponse.json(data);
        } catch (error) {
            return NextResponse.json(
                { error: error.message || "Erro ao obter dados do grafico" }, 
                { status: 500 }
            );
        }
    }
}

export default new GrapBarChartController();