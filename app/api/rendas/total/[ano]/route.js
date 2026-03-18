import RendaController from "@/controllers/RendaController";
import { requireAuth } from "@/utils/authGuard";

export async function GET(req, { params }) {
  const { response } = requireAuth(req);
  if (response) return response;
  const { ano } = await params;

  return await RendaController.getTotalRenda(ano);
}
