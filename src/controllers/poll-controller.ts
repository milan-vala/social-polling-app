import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/types/api";
import {
  CreatePollRequest,
  UpdatePollRequest,
  DeletePollRequest,
} from "@/types/poll";
import { PollService } from "@/services/poll-service";
import { Logger } from "@/middleware/logger";
import { ErrorHandler } from "@/middleware/error-handler";
import { AuthMiddleware } from "@/middleware/auth-middleware";

export class PollController {
  static async createPoll(request: NextRequest): Promise<NextResponse> {
    const logData = Logger.logRequest(request);

    try {
      const authResult = await AuthMiddleware.verifyAuth(request);
      if (!authResult.success) {
        return authResult.response!;
      }

      const user = authResult.user!;
      const body: CreatePollRequest = await request.json();
      const { title, options } = body;

      if (!title || !options || !user.id) {
        Logger.warn("Create poll validation failed", { body });
        return ErrorHandler.handleValidationError(
          "Title, options, and user_id are required"
        );
      }

      if (!Array.isArray(options) || options.length < 2) {
        Logger.warn("Create poll validation failed - insufficient options", {
          optionsCount: options?.length,
        });
        return ErrorHandler.handleValidationError(
          "At least 2 options are required"
        );
      }

      Logger.info("Creating poll", {
        title,
        user_id: user.id,
        optionsCount: options.length,
      });

      const pollData = {
        title,
        description: body.description,
        options,
        user_id: user.id,
      };

      const result = await PollService.createPoll(pollData);

      Logger.info("Poll created successfully", {
        pollId: result.poll.id,
        user_id: user.id,
      });

      const response: ApiResponse = {
        data: result,
        message: "Poll created successfully",
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
        userId: (await request.json().catch(() => ({})))?.user_id,
      });
    }
  }

  static async getAllPolls(request: NextRequest): Promise<NextResponse> {
    const logData = Logger.logRequest(request);

    try {
      Logger.info("Fetching all polls");

      const polls = await PollService.getAllPolls();

      Logger.info("Polls retrieved successfully", { count: polls.length });

      const response: ApiResponse = {
        data: polls,
        message: "Polls retrieved successfully",
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

  static async getPollById(
    request: NextRequest,
    pollId: string
  ): Promise<NextResponse> {
    const logData = Logger.logRequest(request);

    try {
      const id = parseInt(pollId);
      if (isNaN(id)) {
        Logger.warn("Get poll validation failed - invalid poll ID", { pollId });
        return ErrorHandler.handleValidationError("Invalid poll ID");
      }

      Logger.info("Fetching poll by ID", { pollId: id });

      const poll = await PollService.getPollById(id);

      if (!poll) {
        Logger.warn("Poll not found", { pollId: id });
        const response: ApiResponse = {
          data: null,
          message: "Poll not found",
          success: false,
        };
        return NextResponse.json(response, { status: 404 });
      }

      Logger.info("Poll retrieved successfully", { pollId: id });

      const response: ApiResponse = {
        data: poll,
        message: "Poll retrieved successfully",
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

  static async updatePoll(
    request: NextRequest,
    pollId: string
  ): Promise<NextResponse> {
    const logData = Logger.logRequest(request);

    try {
      const id = parseInt(pollId);
      if (isNaN(id)) {
        Logger.warn("Update poll validation failed - invalid poll ID", {
          pollId,
        });
        return ErrorHandler.handleValidationError("Invalid poll ID");
      }

      const body: UpdatePollRequest = await request.json();
      const { title, description, user_id } = body;

      if (!user_id) {
        Logger.warn("Update poll validation failed - missing user_id", {
          pollId: id,
        });
        return ErrorHandler.handleValidationError("User ID is required");
      }

      if (!title && description === undefined) {
        Logger.warn("Update poll validation failed - no fields to update", {
          pollId: id,
          user_id,
        });
        return ErrorHandler.handleValidationError(
          "At least one field (title or description) is required"
        );
      }

      Logger.info("Updating poll", {
        pollId: id,
        user_id,
        hasTitle: !!title,
        hasDescription: description !== undefined,
      });

      const updatedPoll = await PollService.updatePoll(id, body);

      Logger.info("Poll updated successfully", { pollId: id, user_id });

      const response: ApiResponse = {
        data: updatedPoll,
        message: "Poll updated successfully",
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
        userId: (await request.json().catch(() => ({})))?.user_id,
      });
    }
  }

  static async deletePoll(
    request: NextRequest,
    pollId: string
  ): Promise<NextResponse> {
    const logData = Logger.logRequest(request);

    try {
      const id = parseInt(pollId);
      if (isNaN(id)) {
        Logger.warn("Delete poll validation failed - invalid poll ID", {
          pollId,
        });
        return ErrorHandler.handleValidationError("Invalid poll ID");
      }

      const body: DeletePollRequest = await request.json();
      const { user_id } = body;

      if (!user_id) {
        Logger.warn("Delete poll validation failed - missing user_id", {
          pollId: id,
        });
        return ErrorHandler.handleValidationError("User ID is required");
      }

      Logger.info("Deleting poll", { pollId: id, user_id });

      const result = await PollService.deletePoll(id, body);

      Logger.info("Poll deleted successfully", {
        pollId: id,
        user_id,
        title: result.title,
      });

      const response: ApiResponse = {
        data: result,
        message: "Poll deleted successfully",
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
        userId: (await request.json().catch(() => ({})))?.user_id,
      });
    }
  }
}
