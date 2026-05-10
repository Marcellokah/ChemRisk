import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail, verifyPassword, createToken } from "../../../lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email és jelszó szükséges" },
        { status: 400 }
      );
    }

    // Find user
    const user = findUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: "Érvénytelen email vagy jelszó" },
        { status: 401 }
      );
    }

    // Verify password
    if (!verifyPassword(password, user.passwordHash)) {
      return NextResponse.json(
        { error: "Érvénytelen email vagy jelszó" },
        { status: 401 }
      );
    }

    // Create token
    const token = createToken(user.id);

    // Set httpOnly cookie
    const response = NextResponse.json(
      {
        message: "Sikeres bejelentkezés",
        user: {
          id: user.id,
          email: user.email,
        },
      },
      { status: 200 }
    );

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Bejelentkezési hiba" },
      { status: 500 }
    );
  }
}
