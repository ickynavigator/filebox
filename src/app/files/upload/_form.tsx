'use client';

import {
  Button,
  Container,
  Group,
  Stack,
  Text,
  TextInput,
  Textarea,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { Tag } from '@prisma/client';
import { FormEvent, useState } from 'react';
import { z } from 'zod';
import { uploadFormData } from '~/actions/aws';
import { FileUpload, type FileInterface } from '~/components/FileUpload';
import CustomTagInput from '~/components/customTagInput';
import { MAX_UPLOAD_FILE_SIZE } from '~/lib/constants';
import { Notifications } from '~/lib/notifications';

interface Props {
  tags?: Tag[];
}

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
  const { tags } = props;

  const [files, setFiles] = useState<FileInterface[]>([]);

  const form = useForm({
    initialValues: { name: '', description: '' },
    validate: zodResolver(schema),
  });

  const onDrop = (fileList: File[]) => {
    form.setFieldValue('name', fileList[fileList.length - 1]?.name);
  };

  const submitHandler = async (
    _values: typeof form.values,
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
      const formData = new FormData(event?.currentTarget);

      formData.set('file', fileToUpload.file);

      await uploadFormData(formData);

      Notifications.success('File uploaded successfully');

      return;
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
        <Stack gap="md">
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

          {files[0] ? (
            <>
              <TextInput
                name="name"
                placeholder="Enter file name"
                label="File Name"
                required
                {...form.getInputProps('name')}
              />

              <CustomTagInput tags={tags} />

              <Textarea
                name="description"
                placeholder="Enter file description"
                label="File Description"
                autosize
                minRows={4}
                maxRows={6}
                {...form.getInputProps('description')}
              />

              <Group justify="flex-end">
                <Button type="submit">Upload File</Button>
              </Group>
            </>
          ) : null}
        </Stack>
      </form>
    </Container>
  );
}
