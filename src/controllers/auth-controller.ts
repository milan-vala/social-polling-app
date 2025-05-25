import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/types/api";
import { SignupRequest, LoginRequest } from "@/types/auth";
import { AuthService } from "@/services/auth-service";
import { Logger } from "@/middleware/logger";
import { ErrorHandler } from "@/middleware/error-handler";

export class AuthController {
  static async signup(request: NextRequest): Promise<NextResponse> {
    const logData = Logger.logRequest(request);

    try {
      const body: SignupRequest = await request.json();
      const { email, password } = body;

      if (!email || !password) {
        Logger.warn("Signup validation failed", {
          body: { email: !!email, password: !!password },
        });
        return ErrorHandler.handleValidationError(
          "Email and password are required"
        );
      }

      if (password.length < 6) {
        Logger.warn("Signup validation failed - password too short", { email });
        return ErrorHandler.handleValidationError(
          "Password must be at least 6 characters long"
        );
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        Logger.warn("Signup validation failed - invalid email", { email });
        return ErrorHandler.handleValidationError(
          "Please enter a valid email address"
        );
      }

      const result = await AuthService.signup(body);
      const response: ApiResponse = {
        data: result,
        message:
          "Account created successfully! Please check your email and click the confirmation link to activate your account.",
        success: true,
      };

      const nextResponse = NextResponse.json(response, { status: 201 });
      Logger.logResponse(logData, nextResponse);
      return nextResponse;
    } catch (error: any) {
      Logger.logError(logData, error);
      return ErrorHandler.handleError(error, {
        method: request.method,
        url: request.url,
      });
    }
  }

  static async login(request: NextRequest): Promise<NextResponse> {
    const logData = Logger.logRequest(request);

    try {
      const body: LoginRequest = await request.json();
      const { email, password } = body;

      if (!email || !password) {
        Logger.warn("Login validation failed", {
          body: { email: !!email, password: !!password },
        });
        return ErrorHandler.handleValidationError(
          "Email and password are required"
        );
      }

      const result = await AuthService.login(body);
      const response: ApiResponse = {
        data: result,
        message: "Logged in successfully",
        success: true,
      };

      const nextResponse = NextResponse.json(response, { status: 200 });
      Logger.logResponse(logData, nextResponse);
      return nextResponse;
    } catch (error: any) {
      Logger.logError(logData, error);
      return ErrorHandler.handleError(error, {
        method: request.method,
        url: request.url,
      });
    }
  }

  static async logout(request: NextRequest): Promise<NextResponse> {
    const logData = Logger.logRequest(request);

    try {
      await AuthService.logout();
      const response: ApiResponse = {
        data: null,
        message: "Logged out successfully",
        success: true,
      };

      const nextResponse = NextResponse.json(response, { status: 200 });
      Logger.logResponse(logData, nextResponse);
      return nextResponse;
    } catch (error: any) {
      Logger.logError(logData, error);
      return ErrorHandler.handleError(error, {
        method: request.method,
        url: request.url,
      });
    }
  }
}
