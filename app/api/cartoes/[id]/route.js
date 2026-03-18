import CartaoController from "@/controllers/CartaoController";
import { requireAuth } from "@/utils/authGuard";

export async function PUT(req, { params }) {
  const { response } = requireAuth(req);
  if (response) return response;
  const { id } = params;
  const body = await req.json();

  return await CartaoController.updateCartao(id, body);
}

export async function DELETE(req, { params }) {
  const { response } = requireAuth(req);
  if (response) return response;
  const { id } = params;

  return await CartaoController.deleteCartao(id);
}
