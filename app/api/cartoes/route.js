import CartaoController from "@/controllers/CartaoController";
import { requireAuth } from "@/utils/authGuard";

export async function GET(req) {
  const { user, response } = requireAuth(req);
  if (response) return response;
  return await CartaoController.getCartoes(user.id);
}

export async function POST(req) {
  const { user, response } = requireAuth(req);
  if (response) return response;
  const body = await req.json();
  return await CartaoController.createCartao(body, user.id);
}
