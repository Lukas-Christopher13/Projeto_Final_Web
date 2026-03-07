import CartaoController from "@/controllers/CartaoController";

export async function GET() {
    return await CartaoController.despesasPorCartao();
}