import DespesasController from "@/controllers/DespesasController";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const mes = parseInt(searchParams.get("mes"));
  const ano = parseInt(searchParams.get("ano"));

  return DespesasController.getDespesasPorMes(mes, ano);
}

export async function POST(req) {
  const body = await req.json();
  return DespesasController.createDespesa(body);
}
