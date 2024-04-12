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
import * as fileActions from '~/actions/files';
import env from '~/env/index.mjs';
import { BaseFile, IFile } from '~/types';

const s3Client = new S3Client({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_PERSONAL_ACCESS_KEY,
    secretAccessKey: env.AWS_PERSONAL_SECRET_KEY,
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

export async function uploadPresignedFile(file: File, key: IFile['id']) {
  const clientUrl = await createPresignedUrl({ key });

  await axios.put(clientUrl, file, {
    headers: { 'Content-type': file.type, 'Access-Control-Allow-Origin': '*' },
  });
}

export async function uploadFormData(values: FormData) {
  const name = values.get('name') as string;
  const description = values.get('description') as string;
  const fileToUpload = values.get('file') as File;

  const fileObj: BaseFile = {
    name: name,
    description: description,
    url: `${env.NEXT_PUBLIC_BUCKET_URL}${name}`,
  };

  const createdFile = await fileActions.createFile(fileObj);

  await uploadPresignedFile(fileToUpload, createdFile.id);
}

export async function deleteFile(Key: IFile['id']) {
  const command = new DeleteObjectCommand({
    Bucket: env.AWS_BUCKET_NAME,
    Key,
  });
  await s3Client.send(command);
  await fileActions.deleteFile(Key);
}

interface PresignedURLClient {
  key: IFile['id'];
}
export async function createPresignedUrl({ key }: PresignedURLClient) {
  const command = new PutObjectCommand({
    Bucket: env.AWS_BUCKET_NAME,
    Key: key,
  });
  return getSignedUrl(s3Client, command, { expiresIn: 3600 });
}

export async function downloadPresignedFile(Key: IFile['id']) {
  console.log(Key);
}
