import DespesasController from "@/controllers/DespesasController";
import { requireAuth } from "@/utils/authGuard";

export async function GET(req) {
  const { response } = requireAuth(req);
  if (response) return response;
  const { searchParams } = new URL(req.url);
  const mes = parseInt(searchParams.get("mes"));
  const ano = parseInt(searchParams.get("ano"));

  return DespesasController.getDespesasPorMes(mes, ano);
}

export async function POST(req) {
  const { response } = requireAuth(req);
  if (response) return response;
  const body = await req.json();
  return DespesasController.createDespesa(body);
}
