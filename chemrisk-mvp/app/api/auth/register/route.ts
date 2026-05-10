import { NextRequest, NextResponse } from "next/server";
import { createUser, findUserByEmail, verifyPassword, createToken } from "../../../lib/auth";

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

    if (password.length < 6) {
      return NextResponse.json(
        { error: "A jelszó legalább 6 karakter hosszú kell, hogy legyen" },
        { status: 400 }
      );
    }

    // Try to create user
    const user = createUser(email, password);
    if (!user) {
      return NextResponse.json(
        { error: "Ez az email már regisztrálva van" },
        { status: 400 }
      );
    }

    // Create token
    const token = createToken(user.id);

    // Set httpOnly cookie
    const response = NextResponse.json(
      {
        message: "Sikeres regisztráció",
        user: {
          id: user.id,
          email: user.email,
        },
      },
      { status: 201 }
    );

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Regisztrációs hiba" },
      { status: 500 }
    );
  }
}
