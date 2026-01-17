import { NextResponse } from "next/server";

const JWT_COOKIE_NAME = "auth_token";

export async function POST() {
  const response = NextResponse.json({ success: true });

  response.cookies.set(JWT_COOKIE_NAME, "", {
    expires: new Date(0),
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    httpOnly: false,
  });

  response.cookies.delete(JWT_COOKIE_NAME);

  return response;
}

