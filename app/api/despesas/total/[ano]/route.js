import DespesasController from "@/controllers/DespesasController";
import { requireAuth } from "@/utils/authGuard";

export async function GET(req, { params }) {
  const { user, response } = requireAuth(req);
  if (response) return response;
  const { ano } = await params;

  return await DespesasController.getTotalDespesas(ano, user.id);
}
