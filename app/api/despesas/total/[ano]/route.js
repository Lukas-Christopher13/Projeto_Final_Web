import DespesasController from "@/controllers/DespesasController";

export async function GET(req, { params }) {
  const { ano } = await params;

  return await DespesasController.getTotalDespesas(ano);
}