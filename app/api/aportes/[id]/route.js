import AporteController from "@/controllers/AporteController"
import { requireAuth } from "@/utils/authGuard";

export async function DELETE(req, { params }) {
    const { response } = requireAuth(req);
    if (response) return response;
    const { id } = await params;

    return AporteController.delete(id);
}

export async function PUT(req, {params}) {
    const { response } = requireAuth(req);
    if (response) return response;
    const { id } = await params;
    const body = await req.json();

    return AporteController.update(id, body)
}
