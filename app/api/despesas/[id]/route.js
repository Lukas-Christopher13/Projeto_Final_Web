import DespesasController from "@/controllers/DespesasController";
import { requireAuth } from "@/utils/authGuard";

export async function DELETE(req, { params }) {
  const { response } = requireAuth(req);
  if (response) return response;
  const { id } = params;
  const { searchParams } = new URL(req.url);
  const deleteAll = searchParams.get("deleteAll") === "true";

  return await DespesasController.deleteDespesa(id, deleteAll);
}

export async function PUT(req, { params }) {
  const { response } = requireAuth(req);
  if (response) return response;
  const { id } = params;
  const body = await req.json();

  return await DespesasController.updateDespesa(id, body);
}
