import AporteController from "@/controllers/AporteController"
import { requireAuth } from "@/utils/authGuard";

export async function GET(req) {
    const { user, response } = requireAuth(req);
    if (response) return response;
    return AporteController.list(user.id);
}

export async function POST(req) {
    const { user, response } = requireAuth(req);
    if (response) return response;
    const body = await req.json();

    return AporteController.create(body, user.id);
}
