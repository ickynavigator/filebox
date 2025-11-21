import { betterFetch } from '@better-fetch/fetch';
import { MiddlewareConfig, NextRequest, NextResponse } from 'next/server';

import { Session } from '~/lib/auth';

export async function middleware(request: NextRequest) {
  const { data: session } = await betterFetch<Session>(
    '/api/auth/get-session',
    {
      baseURL: request.nextUrl.origin,
      headers: {
        cookie: request.headers.get('cookie') || '',
      },
    },
  );

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
