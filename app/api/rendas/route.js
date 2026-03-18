import rendaController from "../../../controllers/RendaController";
import { requireAuth } from "@/utils/authGuard";

export async function GET(req) {
  const { user, response } = requireAuth(req);
  if (response) return response;
  return await rendaController.listar(req, user.id);
}

export async function POST(req) {
  const { user, response } = requireAuth(req);
  if (response) return response;
  return await rendaController.criar(req, user.id);
}
