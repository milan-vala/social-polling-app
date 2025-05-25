import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { ApiResponse } from "@/types/api";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      const response: ApiResponse = {
        data: null,
        message: "Email and password are required",
        success: false,
      };
      return NextResponse.json(response, { status: 400 });
    }

    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      const response: ApiResponse = {
        data: null,
        message: error.message,
        success: false,
      };
      return NextResponse.json(response, { status: 401 });
    }

    const response: ApiResponse = {
      data: {
        user: data.user,
        session: data.session,
      },
      message: "Login successful",
      success: true,
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error while logging in: ", error);
    const response: ApiResponse = {
      data: null,
      message: "Internal server error",
      success: false,
    };
    return NextResponse.json(response, { status: 500 });
  }
}
