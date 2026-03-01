import { NextResponse } from "next/server";
import { connectDB } from "../utils/mongodb"
import AporteService from "../services/AporteService";
import next from "next";

class AporteController {
    async list() {
        await connectDB();

        const aportes = await AporteService.getAllAportes();

        return NextResponse.json(aportes)
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