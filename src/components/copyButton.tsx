import { ActionIcon, CopyButton, Tooltip, rem } from '@mantine/core';
import { IconCheck, IconCopy } from '@tabler/icons-react';

interface Props {
  text: string;
}

export default function ClipboardButton(props: Props) {
  const { text } = props;

  return (
    <CopyButton value={text}>
      {({ copied, copy }) => (
        <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow>
          <ActionIcon
            color={copied ? 'teal' : 'yellow'}
            onClick={copy}
            variant="outline"
          >
            {copied ? (
              <IconCheck style={{ width: rem(16) }} />
            ) : (
              <IconCopy style={{ width: rem(16) }} />
            )}
          </ActionIcon>
        </Tooltip>
      )}
    </CopyButton>
  );
}
