import RendaController from "@/controllers/RendaController";
import { requireAuth } from "@/utils/authGuard";

export async function GET(req, { params }) {
  const { user, response } = requireAuth(req);
  if (response) return response;
  const { ano } = await params;

  return await RendaController.getRendasPor(ano, user.id);
}
