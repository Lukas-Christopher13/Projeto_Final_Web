import rendaController from "../../../controllers/RendaController";
import { requireAuth } from "@/utils/authGuard";

export async function GET(req) {
  const { response } = requireAuth(req);
  if (response) return response;
  return await rendaController.listar(req);
}

export async function POST(req) {
  const { response } = requireAuth(req);
  if (response) return response;
  return await rendaController.criar(req);
}
