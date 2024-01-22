import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const filePath = searchParams.get('filename');

  if (!filePath) {
    return Response.json({
      status: 400,
      body: 'No filename provided',
    });
  }

  // filename only
  const fileName = filePath.substring(filePath.lastIndexOf('/') + 1);

  // set header
  //   const res = new Response();
  //   res.setHeader('content-disposition', `attachment; filename=${fileName}`);

  //   const readableObject = s3Client.(downloadParams).createReadStream();

  //   res.setHeader('Content-Type', `image/${imageFormat}`);
  //   res.setHeader('Content-Disposition', `attachment; filename=${imageKey}`);
  //   readableObject.pipe(res);
}
