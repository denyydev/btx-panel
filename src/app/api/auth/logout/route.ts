import { NextResponse } from "next/server";

const JWT_COOKIE_NAME = "auth_token";

export async function POST() {
  const response = NextResponse.json({ success: true });

  // Удаляем cookie через Set-Cookie заголовок с истекшим сроком
  // Используем те же параметры, что и при установке
  response.cookies.set(JWT_COOKIE_NAME, "", {
    expires: new Date(0), // Истекший срок
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    httpOnly: false, // Должно совпадать с тем, как устанавливается на клиенте
  });

  // Также пробуем удалить с другими параметрами
  response.cookies.delete(JWT_COOKIE_NAME);

  return response;
}

