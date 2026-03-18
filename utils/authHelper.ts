import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

export function getUserFromRequest(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1] || req.cookies.get("token")?.value;
    if (!token) return null;
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; role: string };
    return decoded;
  } catch {
    return null;
  }
}
