import CartaoController from "@/controllers/CartaoController";

export async function GET() {
  return await CartaoController.getCartoes();
}

export async function POST(req) {
  const body = await req.json();
  return await CartaoController.createCartao(body);
}