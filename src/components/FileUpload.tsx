import { Box, Group, Text, rem } from '@mantine/core';
import {
  Dropzone,
  DropzoneAccept,
  DropzoneIdle,
  DropzoneReject,
  FileRejection,
} from '@mantine/dropzone';
import { IconPhoto, IconUpload, IconX } from '@tabler/icons-react';
import React from 'react';
import { ErrorCode } from 'react-dropzone';
import { Notifications as message } from '~/lib/notifications';
import { bytesToMegaBytes as bytesToMB } from '~/lib/utils';

const iconProps = (color: string) => ({
  stroke: 1.5,
  style: { color, width: rem(52), height: rem(52) },
});

export interface FileInterface {
  file: File;
  preview: string;
  name: string;
  type: string;
}

export interface FileUploadProps {
  files: FileInterface[];
  setFiles: (files: FileInterface[]) => void;

  onDrop?: (files: File[]) => void;
  onDropRejected?: (fileRejects: FileRejection[]) => void;

  FILE_TYPE?: string[];
  MAX_FILE_SIZE?: number;

  singleFile?: boolean;
  children?: React.ReactNode;
}

export function FileUpload({
  files,
  setFiles,
  MAX_FILE_SIZE,
  FILE_TYPE,
  onDrop,
  onDropRejected,
  children,
  singleFile,
}: FileUploadProps) {
  /** Handles file dropping */
  function handleFileDrop(fileList: File[]) {
    fileList.forEach(async curr => {
      if (!curr) {
        message.error('No file selected');
      } else {
        const file = {
          file: curr,
          preview: URL.createObjectURL(curr),
          name: `${curr.name}+-+${new Date().toDateString()}`,
          type: curr.type,
        };

        if (singleFile) {
          setFiles([file]);
        } else {
          setFiles([...files, file]);
        }
      }
    });

    if (onDrop) {
      onDrop(fileList);
    }
  }

  /** Handles the file upload rejections */
  function handleFileUploadRejection(RejectedFiles: FileRejection[]) {
    if (onDropRejected) {
      onDropRejected(RejectedFiles);
    }

    if (RejectedFiles.length > 0) {
      message.error('No file selected');
    }

    RejectedFiles.forEach(({ file, errors }) => {
      let errStr = `For ${file.name}:`;

      errors.forEach(err => {
        if (err.code === ErrorCode.FileTooLarge) {
          errStr += ' File is too big. Max file size is 5MB.';
        }

        if (err.code === ErrorCode.FileInvalidType) {
          errStr += ' - File type not allowed.';
        }
      });

      message.error(errStr);
    });
  }

  return (
    <Dropzone
      onDrop={file => handleFileDrop(file)}
      onReject={file => handleFileUploadRejection(file)}
      maxSize={MAX_FILE_SIZE}
      accept={FILE_TYPE}
      name="file"
    >
      <Group
        justify="center"
        gap="xl"
        mih={220}
        style={{ pointerEvents: 'none' }}
      >
        <DropzoneAccept>
          <IconUpload {...iconProps('var(--mantine-color-blue-6)')} />
        </DropzoneAccept>

        <DropzoneReject>
          <IconX {...iconProps('var(--mantine-color-red-6)')} />
        </DropzoneReject>

        <DropzoneIdle>
          <IconPhoto {...iconProps('var(--mantine-color-dimmed)')} />
        </DropzoneIdle>

        <Box>
          <Text size="xl" inline>
            Drag files here or click to select them
          </Text>
          {MAX_FILE_SIZE && (
            <Text size="sm" c="dimmed" inline mt={7}>
              {`Files should not exceed ${bytesToMB(MAX_FILE_SIZE).toFixed(2)}mb`}
            </Text>
          )}
          {children ? children : null}
        </Box>
      </Group>
    </Dropzone>
  );
}
