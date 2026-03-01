import { z } from "zod"

import { NextResponse } from "next/server";
import { connectDB } from "../utils/mongodb"
import AporteService from "../services/AporteService";

const aporteSchema = z.object({
    valor: z.number().positive("O valor deve ser positivo!"),
    data: z.string().nonempty("Data obrigatória!"),
    fonte: z.string().min(3, "Fonte deve ter no minimo 3 caracteres")
})


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
}

export default new AporteController();