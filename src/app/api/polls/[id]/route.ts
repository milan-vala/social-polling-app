import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { ApiResponse, UpdatePollRequest, DeletePollRequest } from "@/types/api";
import { PollUpdate } from "@/types/database";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const pollId = parseInt(id);

    if (isNaN(pollId)) {
      const response: ApiResponse = {
        data: null,
        message: "Invalid poll ID",
        success: false,
      };
      return NextResponse.json(response, { status: 400 });
    }

    const body: UpdatePollRequest = await request.json();
    const { title, description, user_id } = body;

    if (!title && description === undefined) {
      const response: ApiResponse = {
        data: null,
        message: "At least one field 'title or description' is required",
        success: false,
      };
      return NextResponse.json(response, { status: 400 });
    }

    if (!user_id) {
      const response: ApiResponse = {
        data: null,
        message: "User ID is required",
        success: false,
      };
      return NextResponse.json(response, { status: 400 });
    }

    const { data: existingPoll, error: fetchError } = await supabase
      .from("polls")
      .select("id, created_by")
      .eq("id", pollId)
      .single();

    if (fetchError || !existingPoll) {
      const response: ApiResponse = {
        data: null,
        message: "Poll not found",
        success: false,
      };
      return NextResponse.json(response, { status: 404 });
    }

    if (existingPoll.created_by !== user_id) {
      const response: ApiResponse = {
        data: null,
        message: "Unauthorized: You can only update polls you created",
        success: false,
      };
      return NextResponse.json(response, { status: 403 });
    }

    const updateData: PollUpdate = {
      updated_at: new Date().toISOString(),
    };

    if (title) {
      updateData.title = title;
    }

    if (description !== undefined) {
      updateData.description = description;
    }

    const { data: updatedPoll, error: updateError } = await supabase
      .from("polls")
      .update(updateData)
      .eq("id", pollId)
      .select()
      .single();

    if (updateError) {
      const response: ApiResponse = {
        data: null,
        message: updateError.message,
        success: false,
      };
      return NextResponse.json(response, { status: 400 });
    }

    const response: ApiResponse = {
      data: updatedPoll,
      message: "Poll updated successfully",
      success: true,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Update poll error:", error);
    const response: ApiResponse = {
      data: null,
      message: "Internal server error",
      success: false,
    };
    return NextResponse.json(response, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const pollId = parseInt(id);

    if (isNaN(pollId)) {
      const response: ApiResponse = {
        data: null,
        message: "Invalid poll ID",
        success: false,
      };
      return NextResponse.json(response, { status: 400 });
    }

    const body: DeletePollRequest = await request.json();
    const { user_id } = body;

    if (!user_id) {
      const response: ApiResponse = {
        data: null,
        message: "User ID is required",
        success: false,
      };
      return NextResponse.json(response, { status: 400 });
    }

    const { data: existingPoll, error: fetchError } = await supabase
      .from("polls")
      .select("id, created_by, title")
      .eq("id", pollId)
      .single();

    if (fetchError || !existingPoll) {
      const response: ApiResponse = {
        data: null,
        message: "Poll not found",
        success: false,
      };
      return NextResponse.json(response, { status: 404 });
    }

    if (existingPoll.created_by !== user_id) {
      const response: ApiResponse = {
        data: null,
        message: "Unauthorized: You can only delete polls you created",
        success: false,
      };
      return NextResponse.json(response, { status: 403 });
    }

    const { error: votesDeleteError } = await supabase
      .from("votes")
      .delete()
      .eq("poll_id", pollId);

    if (votesDeleteError) {
      console.error("Error deleting votes:", votesDeleteError);
      const response: ApiResponse = {
        data: null,
        message: "Failed to delete poll votes",
        success: false,
      };
      return NextResponse.json(response, { status: 500 });
    }

    const { error: optionsDeleteError } = await supabase
      .from("poll_options")
      .delete()
      .eq("poll_id", pollId);

    if (optionsDeleteError) {
      console.error("Error deleting poll options:", optionsDeleteError);
      const response: ApiResponse = {
        data: null,
        message: "Failed to delete poll options",
        success: false,
      };
      return NextResponse.json(response, { status: 500 });
    }

    const { error: pollDeleteError } = await supabase
      .from("polls")
      .delete()
      .eq("id", pollId);

    if (pollDeleteError) {
      console.error("Error deleting poll:", pollDeleteError);
      const response: ApiResponse = {
        data: null,
        message: "Failed to delete poll",
        success: false,
      };
      return NextResponse.json(response, { status: 500 });
    }

    const response: ApiResponse = {
      data: {
        id: pollId,
        title: existingPoll.title,
      },
      message: "Poll deleted successfully",
      success: true,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Delete poll error:", error);
    const response: ApiResponse = {
      data: null,
      message: "Internal server error",
      success: false,
    };
    return NextResponse.json(response, { status: 500 });
  }
}