import AporteController from "@/controllers/AporteController";
import { requireAuth } from "@/utils/authGuard";

export async function GET(req) {
    const { response } = requireAuth(req);
    if (response) return response;
    return AporteController.exportarHistorico();
}
