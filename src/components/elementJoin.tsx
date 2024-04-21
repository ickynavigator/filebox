import { Text, rem } from '@mantine/core';
import { useId } from '@mantine/hooks';
import React from 'react';

interface Props {
  //   nodes: React.ReactNode[];
  separator?: React.ReactNode;
  children: React.ReactNode[];
}

// make sure you don't add a separator after the last element
// don't add a separator if there is only one element
// don't add a separator if the element before it is null (check for null)
export default function ElementJoin(props: Props) {
  const {
    children,
    separator = (
      <Text component="span" px={rem(5)}>
        &#8226;
      </Text>
    ),
  } = props;
  const id = useId();

  const getKey = (index: number) => `${id}-${index}`;

  return (
    <>
      {children.map((child, index) => (
        <React.Fragment key={getKey(index)}>
          {child}
          {index < children.length - 1 &&
            child !== null &&
            children[index + 1] !== null &&
            separator}
        </React.Fragment>
      ))}
    </>
  );
}
