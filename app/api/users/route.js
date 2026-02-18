import UserController from "@/controllers/UserController";

export async function POST(req) {
    return UserController.create(req);
}

export async function GET() {
    return UserController.list();
}