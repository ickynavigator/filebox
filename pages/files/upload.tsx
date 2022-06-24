/* eslint-disable no-nested-ternary */
import { FileUpload } from '>components';
import type { FileInterface } from '>components/FileUpload';
import { Notifications } from '>lib/notifications';
import { IFile } from '>types/File';
import {
  Button,
  Container,
  Space,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import axios from 'axios';
import { FormEvent, useState } from 'react';

const Index = () => {
  const [fileToUpload, setFileToUpload] = useState<File>();
  const [files, setFiles] = useState<FileInterface[]>([]);

  const form = useForm({
    initialValues: {
      name: '',
      description: '',
    },

    validate: {
      name: value =>
        value.length > 0
          ? value.length < 60
            ? null
            : 'Name cannot be more than 60 characters'
          : 'Name is required',
      description: value =>
        value.length < 500
          ? null
          : 'Description cannot be more than 500 characters',
    },
  });

  type FormValues = typeof form.values;

  const onDrop = (fileList: File[]) => {
    setFileToUpload(fileList[0]);
    form.setFieldValue('name', fileList[0].name);
  };

  const submitHandler = async (
    values: FormValues,
    event: FormEvent<Element>,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (!fileToUpload) {
      Notifications.error('No file selected');
      return;
    }

    try {
      const res = await axios.post('/api/upload', {
        name: values.name,
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

      const fileObj: IFile = {
        name: values.name,
        description: values.description,
        url: process.env.NEXT_PUBLIC_BUCKET_URL + values.name,
      };

      const mongoRes = await axios.post('/api/file', fileObj);

      if (mongoRes.status !== 201) {
        throw new Error('Upload failed');
      }

      Notifications.success('File uploaded successfully');

      form.reset();
      setFileToUpload(undefined);
      setFiles([]);
    } catch (error) {
      console.error(error);

      Notifications.error('Error uploading file');
    }
  };

  return (
    <Container>
      <FileUpload
        files={files}
        setFiles={setFiles}
        onDrop={onDrop}
        MAX_FILE_SIZE={20 * 1024 ** 2}
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

            <Button type="submit" my="md">
              Upload File
            </Button>
          </form>
        </>
      )}
    </Container>
  );
};

export default Index;
