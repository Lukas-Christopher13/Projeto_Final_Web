import { NextResponse } from "next/server";
import { aporteSchema } from "@/schemas/aporte.schema";

import AporteService from "../services/AporteService";

class AporteController {
    async list() {
        const aportes = await AporteService.getAllAportes();

        return NextResponse.json(aportes)
    }

    async create(body) {
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

    async update(id, body) {
        try {
            const aporteAtualizado = await AporteService.update(id, body)

            return NextResponse.json(aporteAtualizado)

        } catch (error) {
            return NextResponse.json(
                { error: "Erro ao atualizar" },
                { status: 500 }
            )
        }
    }

    async delete(id) {
        try {
            const aporte = AporteService.findByIdAndDelete(id)

            if (!aporte) {
                return NextResponse.json(
                  { error: "Aporte não encontrado" },
                  { status: 404 }
                )
            }
        
            return NextResponse.json(
                { message: "Aporte deletado com sucesso" },
                { status: 200 }
            )

        } catch (error) {
            return NextResponse.json(
                { error: "Erro ao deletar aporte" },
                { status: 500 }
            )
        }
    }

    async totalAcumulado() {
        const total = await AporteService.getTotalAcumulado()

        return NextResponse.json(total)
    }

    async total() {
        const valorTotal = await AporteService.getValorTotal()

        return NextResponse.json(valorTotal)
    }

    async exportarHistorico() {

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