import CartaoController from "@/controllers/CartaoController";

export async function GET(req, { params }) {
  const { ano } = await params;

  return await CartaoController.despesasPorCartao(ano);
}