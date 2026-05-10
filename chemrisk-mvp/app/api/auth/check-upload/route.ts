import { NextRequest, NextResponse } from "next/server";
import { parseToken, canUpload } from "../../../lib/auth";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value;
    let userId: string | undefined = undefined;

    if (token) {
      const parsed = parseToken(token);
      userId = parsed?.userId;
    }

    // Get IP address
    const ipAddress =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const { allowed, remaining } = canUpload(userId, ipAddress);

    return NextResponse.json(
      {
        allowed,
        remaining,
        isAuthenticated: !!userId,
        limit: userId ? Infinity : 5,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Upload check error:", error);
    return NextResponse.json(
      { error: "Hiba az upload ellenőrzésekor" },
      { status: 500 }
    );
  }
}
