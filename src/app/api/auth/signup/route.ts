import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { ApiResponse } from "@/types/api";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      const resposne: ApiResponse = {
        data: null,
        message: "Email and password are required",
        success: false,
      };
      return NextResponse.json(resposne, { status: 400 });
    }

    if (password.length < 6) {
      const response: ApiResponse = {
        data: null,
        message: "Password must be at least 6 characters",
        success: false,
      };
      return NextResponse.json(response, { status: 400 });
    }

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      const response: ApiResponse = {
        data: null,
        message: error.message,
        success: false,
      };
      return NextResponse.json(response, { status: 400 });
    }

    const response: ApiResponse = {
      data: data.user,
      message: "User created successfully",
      success: true,
    };
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Error while signing up: ", error);
    const response: ApiResponse = {
      data: null,
      message: "Internal server error",
      success: false,
    };

    return NextResponse.json(response, { status: 500 });
  }
}
