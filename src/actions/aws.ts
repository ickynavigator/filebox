'use server';

import { File as BufferFile } from 'buffer';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { z } from 'zod';
import * as fileActions from '~/actions/files';
import env from '~/env/index.mjs';
import { TAGS } from '~/lib/constants';
import { IFile } from '~/types';

const s3Client = new S3Client({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_PERSONAL_ACCESS_KEY,
    secretAccessKey: env.AWS_PERSONAL_SECRET_KEY,
  },
});

interface PresignedURLClient {
  key: IFile['id'];
  type?: string;
  name?: string;
}
export async function createPresignedUrl(opts: PresignedURLClient) {
  const { key, type, name } = opts;

  const command = new PutObjectCommand({
    Bucket: env.AWS_BUCKET_NAME,
    Key: key,
    ContentType: type,
    Metadata: {
      'Content-Disposition': `inline; filename="${name}"`,
    },
  });
  return getSignedUrl(s3Client, command, { expiresIn: 3600 });
}

export async function uploadFormData(values: FormData) {
  const formDataSchema = z.object({
    name: z.string(),
    description: z.string(),
    fileToUpload: z.instanceof(BufferFile, { message: 'Required' }),
  });

  const { name, description, fileToUpload } = formDataSchema.parse({
    name: values.get('name'),
    description: values.get('description'),
    fileToUpload: values.get('file'),
  });

  const createdFile = await fileActions.createFile(
    {
      name,
      description,
      url: `${env.NEXT_PUBLIC_BUCKET_URL}${name}`,
      size: fileToUpload.size,
    },
    env.NEXT_PUBLIC_BUCKET_URL,
  );

  const presignedUrl = await createPresignedUrl({
    key: createdFile.id,
    type: fileToUpload.type,
    name: fileToUpload.name,
  });

  await fetch(presignedUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': fileToUpload.type,
      'Access-Control-Allow-Origin': '*',
    },
    // this is safe..... trust me
    body: fileToUpload as unknown as File,
    next: { tags: [TAGS.FILES] },
  });
}

export async function deleteFile(Key: IFile['id']) {
  const command = new DeleteObjectCommand({
    Bucket: env.AWS_BUCKET_NAME,
    Key,
  });
  await s3Client.send(command);
  await fileActions.deleteFile(Key);
}
