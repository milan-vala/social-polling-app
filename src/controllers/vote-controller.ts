import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/types/api";
import { CastVoteRequest, DeleteVoteRequest } from "@/types/vote";
import { VoteService } from "@/services/vote-service";
import { Logger } from "@/middleware/logger";
import { ErrorHandler } from "@/middleware/error-handler";
import { AuthMiddleware } from "@/middleware/auth-middleware";

export class VoteController {
  static async castVote(request: NextRequest): Promise<NextResponse> {
    const logData = Logger.logRequest(request);

    try {
      const authResult = await AuthMiddleware.verifyAuth(request);
      if (!authResult.success) {
        return authResult.response!;
      }

      const user = authResult.user!;
      const body: CastVoteRequest = await request.json();
      const { poll_id, option_id } = body;

      if (!poll_id || !option_id) {
        Logger.warn("Cast vote validation failed", { body });
        return ErrorHandler.handleValidationError(
          "poll_id, option_id are required"
        );
      }

      if (typeof poll_id !== "number" || typeof option_id !== "number") {
        Logger.warn("Cast vote validation failed - invalid ID types", {
          poll_id,
          option_id,
        });
        return ErrorHandler.handleValidationError(
          "poll_id and option_id must be numbers"
        );
      }

      Logger.info("Casting vote", { poll_id, option_id, user_id: user.id });

      const result = await VoteService.castVote(body);

      Logger.info("Vote cast successfully", {
        voteId: result.id,
        poll_id,
        option_id,
        user_id: user.id,
      });

      const response: ApiResponse = {
        data: result,
        message: "Vote cast successfully",
        success: true,
      };

      const nextResponse = NextResponse.json(response, { status: 201 });
      Logger.logResponse(logData, nextResponse);

      return nextResponse;
    } catch (error: any) {
      Logger.logError(logData, error);

      const statusCode = error.message.includes("already voted")
        ? 409
        : error.message.includes("Invalid option")
        ? 400
        : error.message.includes("does not belong")
        ? 400
        : 500;

      const response: ApiResponse = {
        data: null,
        message: error.message || "Internal server error",
        success: false,
      };

      return NextResponse.json(response, { status: statusCode });
    }
  }

  static async getPollVotes(
    request: NextRequest,
    pollId: string
  ): Promise<NextResponse> {
    const logData = Logger.logRequest(request);

    try {
      const id = parseInt(pollId);
      if (isNaN(id)) {
        Logger.warn("Get poll votes validation failed - invalid poll ID", {
          pollId,
        });
        return ErrorHandler.handleValidationError("Invalid poll ID");
      }

      Logger.info("Fetching votes for poll", { pollId: id });

      const result = await VoteService.getPollVotes(id);

      Logger.info("Poll votes retrieved successfully", {
        pollId: id,
        totalVotes: result.total_votes,
      });

      const response: ApiResponse = {
        data: result,
        message: "Poll votes retrieved successfully",
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

  static async deleteVote(
    request: NextRequest,
    voteId: string
  ): Promise<NextResponse> {
    const logData = Logger.logRequest(request);

    try {
      const id = parseInt(voteId);
      if (isNaN(id)) {
        Logger.warn("Delete vote validation failed - invalid vote ID", {
          voteId,
        });
        return ErrorHandler.handleValidationError("Invalid vote ID");
      }

      const body: DeleteVoteRequest = await request.json();
      const { user_id } = body;

      if (!user_id) {
        Logger.warn("Delete vote validation failed - missing user_id", {
          voteId: id,
        });
        return ErrorHandler.handleValidationError("User ID is required");
      }

      Logger.info("Deleting vote", { voteId: id, user_id });

      const result = await VoteService.deleteVote(id, body);

      Logger.info("Vote deleted successfully", { voteId: id, user_id });

      const response: ApiResponse = {
        data: result,
        message: "Vote deleted successfully",
        success: true,
      };

      const nextResponse = NextResponse.json(response, { status: 200 });
      Logger.logResponse(logData, nextResponse);

      return nextResponse;
    } catch (error: any) {
      Logger.logError(logData, error);

      const statusCode = error.message.includes("not found")
        ? 404
        : error.message.includes("Unauthorized")
        ? 403
        : 500;

      const response: ApiResponse = {
        data: null,
        message: error.message || "Internal server error",
        success: false,
      };

      return NextResponse.json(response, { status: statusCode });
    }
  }
}
