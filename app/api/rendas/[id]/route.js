import rendaController from "../../../../controllers/RendaController";

export async function DELETE(req, { params }) {
  const { id } = await params;
  return await rendaController.deletar(id);
}

export async function PUT(req, { params }) {
  const { id } = await params;
  return await rendaController.atualizar(req, id);
}