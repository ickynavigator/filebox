import { Badge } from '@mantine/core';

import type { Tag } from '~/types';

interface Props {
  tag: Tag;
}

export default function CustomPill(props: Props) {
  const { tag } = props;

  return <Badge variant="light">{tag.name}</Badge>;
}
