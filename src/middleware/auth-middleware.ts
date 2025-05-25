import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/services/auth-service";
import { ErrorHandler } from "./error-handler";

export interface AuthenticatedRequest extends NextRequest {
  user: {
    id: string;
    email: string;
    created_at: string;
  };
}

export class AuthMiddleware {
  static async verifyAuth(request: NextRequest): Promise<{
    success: boolean;
    user?: any;
    response?: NextResponse;
  }> {
    try {
      const authHeader = request.headers.get("authorization");

      if (!authHeader?.startsWith("Bearer ")) {
        return {
          success: false,
          response: ErrorHandler.handleAuthError("Authentication required"),
        };
      }

      const accessToken = authHeader.split(" ")[1];
      const user = await AuthService.verifySession(accessToken);

      return {
        success: true,
        user,
      };
    } catch (error: any) {
      return {
        success: false,
        response: ErrorHandler.handleAuthError(
          error.message || "Invalid session"
        ),
      };
    }
  }
}
