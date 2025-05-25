import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import {
  ApiResponse,
  CreatePollRequest,
  CreatePollResponse,
} from "@/types/api";
import { Poll, PollInsert } from "@/types/database";

export async function POST(request: NextRequest) {
  try {
    const body: CreatePollRequest = await request.json();
    const { title, options, user_id, description } = body;

    if (!title || !options || !user_id) {
      const response: ApiResponse = {
        data: null,
        message: "Title, options, and user_id are required",
        success: false,
      };
      return NextResponse.json(response, { status: 400 });
    }

    if (Array.isArray(options) && options.length < 2) {
      const response: ApiResponse = {
        data: null,
        message: "At least 2 options are required",
        success: false,
      };
      return NextResponse.json(response, { status: 400 });
    }

    const pollData: PollInsert = {
      title,
      description: description || null,
      created_by: user_id,
    };

    const { data: poll, error: pollError } = (await supabase
      .from("polls")
      .insert(pollData)
      .select()
      .single()) as { data: Poll; error: any };

    if (pollError) {
      const response: ApiResponse = {
        data: null,
        message: pollError.message,
        success: false,
      };
      return NextResponse.json(response, { status: 400 });
    }

    if (!poll) {
      throw new Error("Poll creation failed.");
    }

    const optionsData = options.map((option: string) => ({
      poll_id: poll.id,
      option_text: option,
      vote_count: 0,
    }));

    const { data: createdOptions, error: optionsError } = await supabase
      .from("poll_options")
      .insert(optionsData)
      .select();

    if (optionsError) {
      await supabase.from("polls").delete().eq("id", poll.id);

      const response: ApiResponse = {
        data: null,
        message: optionsError.message,
        success: false,
      };
      return NextResponse.json(response, { status: 400 });
    }

    const responseData: CreatePollResponse = {
      poll,
      options: createdOptions,
    };

    const response: ApiResponse<CreatePollResponse> = {
      data: responseData,
      message: "Poll created successfully",
      success: true,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Create poll error:", error);
    const response: ApiResponse = {
      data: null,
      message: "Internal server error",
      success: false,
    };
    return NextResponse.json(response, { status: 500 });
  }
}
