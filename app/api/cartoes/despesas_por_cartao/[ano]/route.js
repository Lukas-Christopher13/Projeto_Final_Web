import CartaoController from "@/controllers/CartaoController";
import { requireAuth } from "@/utils/authGuard";

export async function GET(req, { params }) {
  const { response } = requireAuth(req);
  if (response) return response;
  const { ano } = await params;

  return await CartaoController.despesasPorCartao(ano);
}
