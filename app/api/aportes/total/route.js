import AporteController from "@/controllers/AporteController"

export async function GET() {
    return AporteController.total();
}