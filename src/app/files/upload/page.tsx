'use client';

import {
  Button,
  Container,
  Space,
  Text,
  TextInput,
  Textarea,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { FormEvent, useState } from 'react';
import { uploadFormData } from '~/actions/aws';
import { FileUpload, type FileInterface } from '~/components/FileUpload';
import { Notifications } from '~/lib/notifications';

function Page() {
  const [fileToUpload, setFileToUpload] = useState<File>();
  const [files, setFiles] = useState<FileInterface[]>([]);

  const form = useForm({
    initialValues: { name: '', description: '' },

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
    event: FormEvent<HTMLFormElement> | undefined,
  ) => {
    event?.preventDefault();
    event?.stopPropagation();

    if (!fileToUpload) {
      Notifications.error('No file selected');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', fileToUpload);
      formData.append('name', values.name);
      formData.append('description', values.description);
      uploadFormData(formData);

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
    <Container py="lg">
      <FileUpload
        files={files}
        setFiles={setFiles}
        onDrop={onDrop}
        MAX_FILE_SIZE={20 * 1024 ** 2}
        children={
          <Text size="sm" c="dimmed" inline>
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
}

export default Page;
