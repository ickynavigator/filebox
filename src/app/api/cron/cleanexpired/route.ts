/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */

import type { NextRequest } from 'next/server';
import { deleteFile } from '~/actions/aws';
import env from '~/env/index.mjs';
import prisma from '~/lib/prisma';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');

  if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const filesToDelete = await prisma.iFile.findMany({
    where: { expiresAt: { lte: new Date() } },
  });

  if (filesToDelete.length <= 0) {
    return new Response('No files to delete', { status: 200 });
  }

  const deleteResponse: Record<string, string>[] = [];

  for (const file of filesToDelete) {
    try {
      await deleteFile(file.id);

      deleteResponse.push({ id: file.id, status: 'success' });
    } catch (e) {
      deleteResponse.push({ id: file.id, status: 'error' });
    }
  }

  return Response.json(deleteResponse);
}
