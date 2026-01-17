import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const JWT_COOKIE_NAME = "auth_token";

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get(JWT_COOKIE_NAME)?.value;

  if (token) {
    redirect('/dashboard/users');
  } else {
    redirect('/login');
  }
}

