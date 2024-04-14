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
import { MAX_UPLOAD_FILE_SIZE } from '~/lib/constants';
import { Notifications } from '~/lib/notifications';

function Page() {
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

  const onDrop = (fileList: File[]) => {
    form.setFieldValue('name', fileList[fileList.length - 1]?.name);
  };

  const submitHandler = async (
    values: typeof form.values,
    event: FormEvent<HTMLFormElement> | undefined,
  ) => {
    event?.preventDefault();
    event?.stopPropagation();

    const fileToUpload = files[0];

    if (!fileToUpload) {
      Notifications.error('No file selected');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', fileToUpload.file);
      formData.append('name', values.name);
      formData.append('description', values.description);

      await uploadFormData(formData);

      Notifications.success('File uploaded successfully');

      form.reset();
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
        MAX_FILE_SIZE={MAX_UPLOAD_FILE_SIZE}
        singleFile
        children={
          <Text size="sm" c="dimmed" inline>
            Only one file should be uploaded at a time
          </Text>
        }
      />

      {files[0] && (
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
