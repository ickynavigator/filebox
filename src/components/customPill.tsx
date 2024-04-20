import { Badge } from '@mantine/core';
import { Tag } from '@prisma/client';
import React from 'react';

interface Props {
  tag: Tag;
}

export default function CustomPill(props: Props) {
  const { tag } = props;

  return <Badge variant="light">{tag.name}</Badge>;
}
