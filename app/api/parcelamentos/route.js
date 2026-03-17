import ParcelamentosController from "@/controllers/ParcelamentosController";

export async function GET() {
  return ParcelamentosController.getFuturesExpenses();
}
