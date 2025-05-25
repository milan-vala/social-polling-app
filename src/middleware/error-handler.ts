import { NextResponse } from "next/server";
import { ApiResponse } from "@/types/api";
import { Logger } from "./logger";

export interface ErrorContext {
  method: string;
  url: string;
  userId?: string;
}

export class ErrorHandler {
  static handleError(error: Error, context: ErrorContext): NextResponse {
    Logger.error(`API Error in ${context.method} ${context.url}`, error);

    const status = this.getStatusCode(error.message);

    const response: ApiResponse = {
      data: null,
      message: this.getClientMessage(error.message, status),
      success: false,
    };

    return NextResponse.json(response, { status });
  }

  private static getStatusCode(errorMessage: string): number {
    if (errorMessage.includes("not found")) return 404;
    if (errorMessage.includes("Unauthorized")) return 403;
    if (errorMessage.includes("required")) return 400;
    if (errorMessage.includes("Invalid")) return 400;
    if (errorMessage.includes("already")) return 409;
    if (
      errorMessage.includes("Email not confirmed") ||
      errorMessage.includes("confirmation link")
    )
      return 401;
    return 500;
  }

  private static getClientMessage(
    errorMessage: string,
    status: number
  ): string {
    if (status === 500) {
      return "Internal server error";
    }

    if (status === 401 && errorMessage.includes("confirmation")) {
      return errorMessage;
    }

    return errorMessage;
  }

  static handleValidationError(message: string): NextResponse {
    const response: ApiResponse = {
      data: null,
      message,
      success: false,
    };

    return NextResponse.json(response, { status: 400 });
  }

  static handleAuthError(
    message: string = "Authentication required"
  ): NextResponse {
    const response: ApiResponse = {
      data: null,
      message,
      success: false,
    };

    return NextResponse.json(response, { status: 401 });
  }

  static handleAuthorizationError(
    message: string = "Access denied"
  ): NextResponse {
    const response: ApiResponse = {
      data: null,
      message,
      success: false,
    };

    return NextResponse.json(response, { status: 403 });
  }
}
