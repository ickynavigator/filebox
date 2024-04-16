'use client';

import {
  Button,
  Container,
  Space,
  Text,
  TextInput,
  Textarea,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { FormEvent, useState } from 'react';
import { z } from 'zod';
import { uploadFormData } from '~/actions/aws';
import { FileUpload, type FileInterface } from '~/components/FileUpload';
import { MAX_UPLOAD_FILE_SIZE } from '~/lib/constants';
import { Notifications } from '~/lib/notifications';

interface Props {}

const schema = z.object({
  name: z
    .string()
    .min(1, 'Name is Required')
    .max(64, 'Name cannot be more than 64 characters'),
  description: z
    .string()
    .max(512, 'Description cannot be more than 512 characters'),
});

export function Form(props: Props) {
  // eslint-disable-next-line no-empty-pattern
  const {} = props;

  const [files, setFiles] = useState<FileInterface[]>([]);

  const form = useForm({
    initialValues: { name: '', description: '' },
    validate: zodResolver(schema),
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
      <form onSubmit={form.onSubmit(submitHandler)}>
        <FileUpload
          files={files}
          setFiles={setFiles}
          onDrop={onDrop}
          MAX_FILE_SIZE={MAX_UPLOAD_FILE_SIZE}
          singleFile
        >
          <Text size="sm" c="dimmed" inline>
            Only one file should be uploaded at a time
          </Text>
        </FileUpload>

        {files[0] && (
          <>
            <Space h="md" />
            <TextInput
              name="name"
              placeholder="Enter file name"
              label="File Name"
              required
              {...form.getInputProps('name')}
            />
            <Textarea
              name="description"
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
          </>
        )}
      </form>
    </Container>
  );
}
