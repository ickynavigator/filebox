import type { NextApiRequest, NextApiResponse } from 'next';
import request from 'request';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // path to file
  const filePath = req.query.filename as string;

  // filename only
  const fileName = filePath.substring(filePath.lastIndexOf('/') + 1);

  // set header
  res.setHeader('content-disposition', `attachment; filename=${fileName}`);

  // send request to the original file
  request
    .get(filePath) // download original image
    .on('error', err => {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.write('<h1>404 not found</h1>');
      res.end();
    })
    .pipe(res); // pipe converted image to HTTP response
}
