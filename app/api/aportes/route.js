import AporteController from "@/controllers/AporteController"

export async function GET() {
    return AporteController.list();
}

export async function POST(req) {
    const body = await req.json();

    return AporteController.create(body);
}