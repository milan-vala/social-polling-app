import { NextRequest } from "next/server";
import { AuthController } from "@/controllers/auth-controller";

export async function POST(request: NextRequest) {
  return AuthController.signup(request);
}
