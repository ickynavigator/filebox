import { NextRequest } from 'next/server';

interface RouteParams {
  params: {
    filepath: string;
  };
}

export async function GET(request: NextRequest, opts: RouteParams) {
  const { params } = opts;
  const { filepath } = params;

  const { searchParams } = request.nextUrl;

  const filename =
    searchParams.get('filename') ??
    filepath.substring(filepath.lastIndexOf('/') + 1);

  const file = await fetch(filepath, { cache: 'no-store' });

  return new Response(file.body, {
    headers: {
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
