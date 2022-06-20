import { Notifications as message } from '>lib/notifications';
import {
  Group,
  MantineTheme,
  Space,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { Dropzone, DropzoneStatus } from '@mantine/dropzone';
import React from 'react';
import { ErrorCode, FileRejection } from 'react-dropzone';
import { Icon as TablerIcon, Photo, Upload, X } from 'tabler-icons-react';

function getIconColor(status: DropzoneStatus, theme: MantineTheme): string {
  if (status.accepted) {
    return theme.colors[theme.primaryColor][
      theme.colorScheme === 'dark' ? 4 : 6
    ];
  }

  if (status.rejected) {
    return theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6];
  }

  if (theme.colorScheme === 'dark') {
    return theme.colors.dark[0];
  }

  return theme.colors.gray[7];

  // Original ternary converted for eslint whining
  //
  // return status.accepted
  //   ? theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6]
  //   : status.rejected
  //   ? theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6]
  //   : theme.colorScheme === 'dark'
  //   ? theme.colors.dark[0]
  //   : theme.colors.gray[7];
}

function ImageUploadIcon({
  status,
  ...props
}: React.ComponentProps<TablerIcon> & { status: DropzoneStatus }) {
  if (status.accepted) {
    return <Upload {...props} />;
  }

  if (status.rejected) {
    return <X {...props} />;
  }

  return <Photo {...props} />;
}

function dropzoneChildren(
  status: DropzoneStatus,
  theme: MantineTheme,
  size?: number,
  child?: React.ReactNode,
) {
  const bytesToMegaBytes = (bytes: number) => bytes / 1024 ** 2;

  return (
    <>
      <Group
        position="center"
        spacing="xl"
        style={{ minHeight: 220, pointerEvents: 'none' }}
      >
        <ImageUploadIcon
          status={status}
          style={{ color: getIconColor(status, theme) }}
          size={80}
        />
        <Text size="sm" color="dimmed" inline mt={7}>
          Attach files as you like
          {size && `, files should not exceed ${bytesToMegaBytes(size)}mb`}
        </Text>
      </Group>

      {child && (
        <>
          <Space h="md" />
          <Group position="center">{child}</Group>
        </>
      )}
    </>
  );
}

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
      {status => dropzoneChildren(status, theme, MAX_FILE_SIZE, child)}
    </Dropzone>
  );
};

export default Index;
