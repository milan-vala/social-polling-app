import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { ApiResponse } from "@/types/api";

export async function POST(request: NextRequest) {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      const response: ApiResponse = {
        data: null,
        message: error.message,
        success: false,
      };
      return NextResponse.json(response, { status: 400 });
    }

    const response: ApiResponse = {
      data: null,
      message: "Logout successful",
      success: true,
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error while logging out: ", error);
    const response: ApiResponse = {
      data: null,
      message: "Internal server error",
      success: false,
    };
    return NextResponse.json(response, { status: 500 });
  }
}
