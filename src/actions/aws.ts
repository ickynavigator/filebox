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
import {
  TAGS,
  TAG_INPUT_DIVIDER,
  TAG_INPUT_GENERATED_PREFIX,
} from '~/lib/constants';
import { revalidateTag } from 'next/cache';
import type { IFile } from '@prisma/client';
import { createBatchTags } from './tags';

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
  description?: string;
}
export async function createPresignedUrl(opts: PresignedURLClient) {
  const { key, type, name, description } = opts;

  const Metadata: Record<string, string> = {};

  if (name) {
    Metadata.Name = name;
  }

  if (description) {
    Metadata.Description = description;
  }

  const command = new PutObjectCommand({
    Bucket: env.AWS_BUCKET_NAME,
    Key: key,
    ContentType: type,
    Metadata,
  });

  return getSignedUrl(s3Client, command, { expiresIn: 3600 });
}

export async function uploadFormData(values: FormData) {
  const formDataSchema = z.object({
    name: z.string(),
    description: z.string(),
    fileToUpload: z.instanceof(BufferFile, { message: 'Required' }),
    tags: z.string().transform(val => {
      const tags = val.split(TAG_INPUT_DIVIDER).filter(tag => tag !== '');

      const existingTags: string[] = [];
      const generatedTags: string[] = [];

      tags.forEach(tag => {
        if (tag.startsWith(TAG_INPUT_GENERATED_PREFIX)) {
          generatedTags.push(tag.replace(TAG_INPUT_GENERATED_PREFIX, ''));
        } else {
          existingTags.push(tag);
        }
      });

      return { existing: existingTags, generated: generatedTags };
    }),
    expiresAt: z
      .union([z.date(), z.null(), z.literal(''), z.string().datetime()])
      .transform(val => {
        if (val === '') return null;
        if (typeof val === 'string') return new Date(val);

        return val;
      }),
  });

  const parsedFormData = formDataSchema.parse({
    name: values.get('name'),
    description: values.get('description'),
    fileToUpload: values.get('file'),
    tags: values.get('tags'),
    expiresAt: values.get('expiryDate'),
  });

  const { name, description, fileToUpload, tags, expiresAt } = parsedFormData;

  const createdTags = await createBatchTags(tags.generated);
  const createdTagsIds = createdTags.map(tag => tag.id);

  const fileTags = [...tags.existing, ...createdTagsIds];
  const createdFile = await fileActions.createFile(
    {
      name,
      description,
      url: `${env.NEXT_PUBLIC_BUCKET_URL}${name}`,
      size: fileToUpload.size,
      expiresAt,
    },
    env.NEXT_PUBLIC_BUCKET_URL,
    fileTags,
  );

  const presignedUrl = await createPresignedUrl({
    key: createdFile.id,
    type: fileToUpload.type,
    name: fileToUpload.name,
    description,
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

  revalidateTag(TAGS.FILES);
}
