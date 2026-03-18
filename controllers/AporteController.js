import { NextResponse } from "next/server";
import { aporteSchema } from "@/schemas/aporte.schema";

import AporteService from "../services/AporteService";

class AporteController {
    async list(userId) {
        const aportes = await AporteService.getAllAportes(userId);

        return NextResponse.json(aportes)
    }

    async create(body, userId) {
        try {
            const aportValido = aporteSchema.parse(body)
            
            await AporteService.create(aportValido, userId)

            return NextResponse.json({sucesso: true})
        } catch (error) {
            return NextResponse.json(
                { erro: error.errors },
                { status: 400 }
            )
        }
    }

    async update(id, body, userId) {
        try {
            const aporteAtualizado = await AporteService.update(id, body, userId)

            return NextResponse.json(aporteAtualizado)

        } catch (error) {
            return NextResponse.json(
                { error: "Erro ao atualizar" },
                { status: 500 }
            )
        }
    }

    async delete(id, userId) {
        try {
            const aporte = await AporteService.findByIdAndDelete(id, userId)

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

    async totalAcumulado(userId) {
        const total = await AporteService.getTotalAcumulado(userId)

        return NextResponse.json(total)
    }

    async total(userId) {
        const valorTotal = await AporteService.getValorTotal(userId)

        return NextResponse.json(valorTotal)
    }

    async exportarHistorico(userId) {

        try {
            const planilha = await AporteService.exportarHistorico(userId);

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
