import UserController from "@/controllers/UserController";
import { requireAuth } from "@/utils/authGuard";

export async function PUT(req, { params }) {
    const { response } = requireAuth(req, "admin");
    if (response) return response;
    const { id } = await params;
    return UserController.update(req, id);
}

export async function DELETE(req, { params }) {
    const { response } = requireAuth(req, "admin");
    if (response) return response;
    const { id } = await params;
    return UserController.delete(id);
}
