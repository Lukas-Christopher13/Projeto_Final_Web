import { NextResponse } from "next/server";
import { connectDB } from "../utils/mongodb";
import { aporteSchema } from "@/schemas/aporte.schema";

import AporteService from "../services/AporteService";

class AporteController {
    async list() {
        await connectDB();

        const aportes = await AporteService.getAllAportes();

        return NextResponse.json(aportes)
    }

    async create(body) {
        await connectDB();
        
        try {
            const aportValido = aporteSchema.parse(body)
            
            AporteService.create(aportValido)

            return NextResponse.json({sucesso: true})
        } catch (error) {
            return NextResponse.json(
                { erro: error.errors },
                { status: 400 }
            )
        }
    }

    async totalAcumulado() {
        await connectDB();

        const total = await AporteService.getTotalAcumulado()

        return NextResponse.json(total)
    }

    async total() {
        await connectDB();

        const valorTotal = await AporteService.getValorTotal()

        return NextResponse.json(valorTotal)
    }

    async exportarHistorico() {
        await connectDB();

        try {
            const planilha = await AporteService.exportarHistorico();

            return new NextResponse(planilha, {
                status: 200,
                headers: {
                    "Content-Type":
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    "Content-Disposition":
                        "attachment; filename=aportes.xlsx"
                }
            });
        } catch (error) {
            return NextResponse.json(
                { error: "Erro ao gerar planilha" },
                { status: 500 }
            )
        }
    }
}

export default new AporteController();