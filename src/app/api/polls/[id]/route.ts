import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { ApiResponse, UpdatePollRequest } from "@/types/api";
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
