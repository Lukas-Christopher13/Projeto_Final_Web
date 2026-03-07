import GraphBarCharController from "@/controllers/GraphBarCharController";

export async function GET(req, { params }) {
  const { ano } = await params;

  return await GraphBarCharController.getGraphBarCharData(ano);
}