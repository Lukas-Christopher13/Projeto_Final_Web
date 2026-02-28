import { NextResponse } from "next/server";
import { connectDB } from "../utils/mongodb"
import AporteService from "../services/AporteService";

class AporteController {
    async list() {
        await connectDB();

        const aportes = await AporteService.getAllAportes();

        return NextResponse.json(aportes)
    }
}

export default new AporteController();