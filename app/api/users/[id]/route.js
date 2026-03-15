import UserController from "@/controllers/UserController";

export async function PUT(req, { params }) {
    const { id } = await params;
    return UserController.update(req, id);
}

export async function DELETE(req, { params }) {
    const { id } = await params;
    return UserController.delete(id);
}