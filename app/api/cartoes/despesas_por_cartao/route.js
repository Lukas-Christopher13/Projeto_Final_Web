import CartaoController from "@/controllers/CartaoController";
import { requireAuth } from "@/utils/authGuard";

export async function GET(req) {
    const { user, response } = requireAuth(req);
    if (response) return response;
    return await CartaoController.despesasPorCartao(null, user.id);
}
