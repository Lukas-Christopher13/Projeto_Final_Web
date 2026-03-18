import rendaController from "../../../../controllers/RendaController";
import { requireAuth } from "@/utils/authGuard";

export async function DELETE(req, { params }) {
  const { user, response } = requireAuth(req);
  if (response) return response;
  const { id } = await params;
  return await rendaController.deletar(id, user.id);
}

export async function PUT(req, { params }) {
  const { user, response } = requireAuth(req);
  if (response) return response;
  const { id } = await params;
  return await rendaController.atualizar(req, id, user.id);
}
