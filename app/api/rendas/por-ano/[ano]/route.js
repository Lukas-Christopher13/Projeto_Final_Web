import RendaController from "@/controllers/RendaController";

export async function GET(req, { params }) {
  const { ano } = await params;

  return await RendaController.getRendasPor(ano);
}
