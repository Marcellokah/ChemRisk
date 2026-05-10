import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json(
      { message: "Sikeres kijelentkezés" },
      { status: 200 }
    );

    response.cookies.delete("auth_token");

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Kijelentkezési hiba" },
      { status: 500 }
    );
  }
}
