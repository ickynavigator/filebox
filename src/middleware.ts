import { MiddlewareConfig, NextResponse } from 'next/server';
import { auth } from '~/lib/auth';

export async function middleware(request: Request) {
  const session = await auth();

  if (!session) {
    const redirectURL = new URL('/auth/signin', request.url);
    redirectURL.searchParams.set('next', request.url);

    return NextResponse.redirect(redirectURL);
  }

  return NextResponse.next();
}

export const config: MiddlewareConfig = {
  matcher: ['/files/:path*'],
};
