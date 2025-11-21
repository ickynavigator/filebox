import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  ctx: RouteContext<'/api/download/[filepath]'>,
) {
  const { filepath } = await ctx.params;

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
