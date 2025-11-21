import { Group, ThemeIcon, Title } from '@mantine/core';
import { IconBox } from '@tabler/icons-react';

export default function FileBoxLogo() {
  return (
    <Group>
      <ThemeIcon variant="outline">
        <IconBox />
      </ThemeIcon>

      <Title td="none">FileBox</Title>
    </Group>
  );
}
