import CartaoController from "@/controllers/CartaoController";

export async function PUT(req, { params }) {
  const { id } = params;
  const body = await req.json();

  return await CartaoController.updateCartao(id, body);
}

export async function DELETE(req, { params }) {
  const { id } = params;

  return await CartaoController.deleteCartao(id);
}