import CartaoController from "@/controllers/CartaoController";
import { requireAuth } from "@/utils/authGuard";

export async function PUT(req, { params }) {
  const { user, response } = requireAuth(req);
  if (response) return response;
  const { id } = await params;
  const body = await req.json();

  return await CartaoController.updateCartao(id, body, user.id);
}

export async function DELETE(req, { params }) {
  const { user, response } = requireAuth(req);
  if (response) return response;
  const { id } = await params;

  return await CartaoController.deleteCartao(id, user.id);
}
