import { NextRequest, NextResponse } from "next/server";
import { parseToken } from "../../../lib/auth";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const parsed = parseToken(token);
    if (!parsed) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // In a real app, fetch full user data from database
    return NextResponse.json(
      {
        user: {
          id: parsed.userId,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Session error:", error);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
