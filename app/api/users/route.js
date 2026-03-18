import UserController from "@/controllers/UserController";
import { requireAuth } from "@/utils/authGuard";

export async function POST(req) {
    const { response } = requireAuth(req, "admin");
    if (response) return response;
    return UserController.create(req);
}

export async function GET(req) {
    const { response } = requireAuth(req, "admin");
    if (response) return response;
    return UserController.list();
}
