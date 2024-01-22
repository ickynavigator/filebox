import { NextResponse } from 'next/server';

export function middleware(request: Request) {
  const requestHeaders = new Headers(request.headers);
  const url = new URL(request.url);
  requestHeaders.set('x-url', url.pathname);

  return NextResponse.next({ request: { headers: requestHeaders } });
}
