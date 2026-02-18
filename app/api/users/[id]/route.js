import UserController from "@/controllers/UserController";

export async function PUT(req, { params }) {
    return UserController.update(req, params.id);
}

export async function DELETE(req, { params }) {
    return UserController.delete(params.id);
}