import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/utils/authHelper";

export function requireAuth(req, role = null) {
  const user = getUserFromRequest(req);
  if (!user) {
    return {
      user: null,
      response: NextResponse.json(
        { success: false, message: "Não autenticado." },
        { status: 401 }
      ),
    };
  }

  if (role && user.role !== role) {
    return {
      user: null,
      response: NextResponse.json(
        { success: false, message: "Acesso negado." },
        { status: 403 }
      ),
    };
  }

  return { user, response: null };
}
