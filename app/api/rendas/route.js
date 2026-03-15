import rendaController from "../../../controllers/RendaController";

export async function GET(req) {
  return await rendaController.listar(req);
}

export async function POST(req) {
  return await rendaController.criar(req);
}
