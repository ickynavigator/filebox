'use server';

import {
  AbortMultipartUploadCommand,
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
  UploadPartCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import axios from 'axios';
import { createFile } from '~/actions/files';
import { env as clientEnv } from '~/env/client.mjs';
import { env as serverEnv } from '~/env/server.mjs';
import { BaseFile } from '~/types';

export const s3Client = new S3Client({
  region: serverEnv.AWS_REGION,
  credentials: {
    accessKeyId: serverEnv.AWS_PERSONAL_ACCESS_KEY,
    secretAccessKey: serverEnv.AWS_PERSONAL_SECRET_KEY,
  },
});

export async function uploadMultiPartFile(file: File, divisions = 5) {
  const bucketName = 'test-bucket';
  const key = 'multipart.txt';
  const buffer = Buffer.from(await file.arrayBuffer());

  let uploadId;

  try {
    const multipartUpload = await s3Client.send(
      new CreateMultipartUploadCommand({
        Bucket: bucketName,
        Key: key,
      }),
    );

    uploadId = multipartUpload.UploadId;

    const uploadPromises = [];
    const partSize = Math.ceil(buffer.length / divisions);

    for (let i = 0; i < divisions; i++) {
      const start = i * partSize;
      const end = start + partSize;

      const uploadCommand = new UploadPartCommand({
        Bucket: bucketName,
        Key: key,
        UploadId: uploadId,
        Body: buffer.subarray(start, end),
        PartNumber: i + 1,
      });

      uploadPromises.push(s3Client.send(uploadCommand).then(res => res));
    }

    const uploadResults = await Promise.all(uploadPromises);

    const completeMultipartUpload = new CompleteMultipartUploadCommand({
      Bucket: bucketName,
      Key: key,
      UploadId: uploadId,
      MultipartUpload: {
        Parts: uploadResults.map(({ ETag }, i) => ({
          ETag,
          PartNumber: i + 1,
        })),
      },
    });
    return await s3Client.send(completeMultipartUpload);
  } catch (err) {
    console.error(err);

    if (uploadId) {
      const abortCommand = new AbortMultipartUploadCommand({
        Bucket: bucketName,
        Key: key,
        UploadId: uploadId,
      });

      await s3Client.send(abortCommand);
    }
  }
}

export async function uploadPresignedFile(file: File) {
  const clientUrl = await createPresignedUrl({ key: file.name });

  await axios.put(clientUrl, file, {
    headers: { 'Content-type': file.type, 'Access-Control-Allow-Origin': '*' },
  });
}

export async function uploadFormData(values: FormData) {
  const name = values.get('name') as string;
  const description = values.get('description') as string;
  const fileToUpload = values.get('file') as File;

  await uploadPresignedFile(fileToUpload);

  const fileObj: BaseFile = {
    name: name,
    description: description,
    url: `${clientEnv.NEXT_PUBLIC_BUCKET_URL}${name}`,
  };

  await createFile(fileObj);
}

export async function deleteFile(Key: string) {
  const command = new DeleteObjectCommand({
    Bucket: serverEnv.AWS_BUCKET_NAME,
    Key,
  });
  s3Client.send(command);
}

interface PresignedURLClient {
  key: string;
}
export async function createPresignedUrl({ key }: PresignedURLClient) {
  const command = new PutObjectCommand({
    Bucket: serverEnv.AWS_BUCKET_NAME,
    Key: key,
  });
  return getSignedUrl(s3Client, command, { expiresIn: 3600 });
}

export async function downloadPresignedFile(Key: string) {}
