import { FileUpload } from '>components';
import { Notifications } from '>lib/notifications';
import {
  Button,
  Container,
  Space,
  Text,
  TextInput,
  Textarea,
} from '@mantine/core';
import { hasLength, useForm } from '@mantine/form';
import { IFile } from '@prisma/client';
import WithAuth from 'HOC/withAuth';
import axios from 'axios';
import Head from 'next/head';
import { FormEvent, useState } from 'react';

const MAX_FILE_SIZE = 20 * 1024 ** 2;

const Index = () => {
  const [fileToUpload, setFileToUpload] = useState<File>();
  const [fileExtension, setFileExtension] = useState<string>();

  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      name: '',
      description: '',
    },

    validate: {
      name: hasLength(
        { min: 1, max: 128 },
        'Name must be between 1-128 characters',
      ),
      description: hasLength(
        { min: 1, max: 500 },
        'Description cannot be more than 500 characters',
      ),
    },
  });

  const onDrop = (fileList: File[]) => {
    setFileToUpload(fileList[0]);

    const extension = fileList[0].name.split('.').pop();
    const name = fileList[0].name.split('.').slice(0, -1).join('.');

    form.setFieldValue('name', name);
    setFileExtension(extension);
  };

  const submitHandler = async (
    values: typeof form.values,
    event: FormEvent<Element>,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    setLoading(true);

    if (!fileToUpload) {
      Notifications.error('No file selected');
      return;
    }

    Notifications.success(
      'The site has been disabled till password protection is setup',
    );

    try {
      const enhancedName = `${values.name}${
        fileExtension ? `.${fileExtension}` : ''
      }`;
      const res = await axios.post('/api/upload', {
        name: enhancedName,
        type: fileToUpload.type,
      });

      if (res.status !== 200) {
        throw new Error('Upload failed');
      }

      const { url } = res.data;

      const S3Res = await axios.put(url, fileToUpload, {
        headers: {
          'Content-type': fileToUpload.type,
          'Access-Control-Allow-Origin': '*',
        },
      });

      if (S3Res.status !== 200) {
        throw new Error('Upload failed');
      }

      const fileObj: BetterOmit<IFile, 'id'> = {
        name: enhancedName,
        description: values.description,
        url: `${process.env.NEXT_PUBLIC_BUCKET_URL}${enhancedName}`,
        size: fileToUpload.size,
      };

      const mongoRes = await axios.post('/api/file', fileObj);

      if (mongoRes.status !== 201) {
        throw new Error('Upload failed');
      }

      Notifications.success('File uploaded successfully');

      form.reset();
      setFileToUpload(undefined);
    } catch (error) {
      console.error(error);

      Notifications.error('Error uploading file');
    }
    setLoading(false);
  };

  return (
    <Container>
      <Head>
        <title>Upload a file</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <FileUpload
        onDrop={onDrop}
        dropzoneProps={{
          maxSize: MAX_FILE_SIZE,
          multiple: false,
        }}
        child={
          <Text size="sm" color="dimmed" inline>
            Only one file should be uploaded at a time
          </Text>
        }
      />

      {fileToUpload && (
        <>
          <Space h="md" />
          <form onSubmit={form.onSubmit(submitHandler)}>
            <TextInput
              placeholder="Enter file name"
              label="File Name"
              required
              {...form.getInputProps('name')}
            />
            <Textarea
              placeholder="Enter file description"
              label="File Description"
              autosize
              minRows={2}
              maxRows={4}
              {...form.getInputProps('description')}
            />

            <Button type="submit" my="md" loading={loading}>
              Upload File
            </Button>
          </form>
        </>
      )}
    </Container>
  );
};

export default WithAuth(Index);
