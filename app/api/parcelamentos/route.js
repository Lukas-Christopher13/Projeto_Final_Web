import ParcelamentosController from "@/controllers/ParcelamentosController";
import { requireAuth } from "@/utils/authGuard";

export async function GET(req) {
  const { user, response } = requireAuth(req);
  if (response) return response;
  return ParcelamentosController.getFuturesExpenses(user.id);
}
