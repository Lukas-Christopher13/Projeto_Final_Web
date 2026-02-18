import { NextResponse } from "next/server";
import { connectDB } from "../utils/mongodb"
import  UserService  from "../services/UserService"

class UserController {
    async create(req) {
        await connectDB();

        const body = await req.json();

        const user = await UserService.createUser(body);

        return NextResponse.json(user, { status: 201 })
    }

    async list() {
        await connectDB();

        const users = await UserService.getAllUsers();

        return NextResponse.json(users);
    }

    async update(req, id) {
        await connectDB();
        const body = await req.json();

        const updateUser = await UserService.updateUser(id, body);

        return NextResponse.json(updateUser);
    }

    async delete(id) {
        await connectDB();

        await UserService.deleteUser(id);

        return NextResponse.json({ message: "Usuario deletado" });
    }
}

export default new UserController();