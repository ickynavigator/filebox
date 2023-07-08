import { Notifications as message } from '>lib/notifications';
import { Group, Space, Text, useMantineTheme } from '@mantine/core';
import { Dropzone, FileRejection } from '@mantine/dropzone';
import { IconPhoto, IconUpload, IconX } from '@tabler/icons-react';
import React from 'react';
import { ErrorCode } from 'react-dropzone';

const bytesToMegaBytes = (bytes: number) => bytes / 1024 ** 2;

/**
 * Verifies the File
 */
async function checkSetFile(fileToCheck: File) {
  if (!fileToCheck) {
    message.error('No file selected');
    return false;
  }

  return true;
}

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
  child?: React.ReactNode;
}

const Index: React.FC<FileUploadProps> = props => {
  const theme = useMantineTheme();
  const {
    files,
    setFiles,
    MAX_FILE_SIZE,
    FILE_TYPE,
    onDrop,
    onDropRejected,
    child,
  } = props;

  /**
   * Handles file dropping
   */
  async function handleFileDrop(fileList: File[]) {
    fileList.forEach(async curr => {
      const res = await checkSetFile(curr);

      if (res) {
        const file = {
          file: curr,
          preview: URL.createObjectURL(curr),
          name: `${curr.name}+-+${new Date().toDateString()}`,
          type: curr.type,
        };

        setFiles([...files, file]);
      }
    });

    if (onDrop) {
      onDrop(fileList);
    }
  }

  /**
   * Handles the file upload rejections
   */
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
    >
      <Group
        position="center"
        spacing="xl"
        style={{ minHeight: 220, pointerEvents: 'none' }}
      >
        <Dropzone.Accept>
          <IconUpload
            size="3.2rem"
            color={
              theme.colors[theme.primaryColor][
                theme.colorScheme === 'dark' ? 4 : 6
              ]
            }
          />
        </Dropzone.Accept>

        <Dropzone.Reject>
          <IconX
            size="3.2rem"
            color={theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6]}
          />
        </Dropzone.Reject>

        <Dropzone.Idle>
          <IconPhoto size="3.2rem" color={theme.colors.dark[0]} />
        </Dropzone.Idle>

        <Text size="sm" color="dimmed" inline mt={7}>
          Attach files as you like
          {MAX_FILE_SIZE
            ? `, files should not exceed ${bytesToMegaBytes(MAX_FILE_SIZE)}mb`
            : null}
        </Text>
      </Group>

      {child && (
        <>
          <Space h="md" />
          <Group position="center">{child}</Group>
        </>
      )}
    </Dropzone>
  );
};

export default Index;
