import AporteController from "@/controllers/AporteController"
import { requireAuth } from "@/utils/authGuard";

export async function DELETE(req, { params }) {
    const { user, response } = requireAuth(req);
    if (response) return response;
    const { id } = await params;

    return AporteController.delete(id, user.id);
}

export async function PUT(req, {params}) {
    const { user, response } = requireAuth(req);
    if (response) return response;
    const { id } = await params;
    const body = await req.json();

    return AporteController.update(id, body, user.id)
}
