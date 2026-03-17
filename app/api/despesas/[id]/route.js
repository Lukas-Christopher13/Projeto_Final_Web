import DespesasController from "@/controllers/DespesasController";

export async function DELETE(req, { params }) {
  const { id } = params;
  const { searchParams } = new URL(req.url);
  const deleteAll = searchParams.get("deleteAll") === "true";

  return await DespesasController.deleteDespesa(id, deleteAll);
}

export async function PUT(req, { params }) {
  const { id } = params;
  const body = await req.json();

  return await DespesasController.updateDespesa(id, body);
}