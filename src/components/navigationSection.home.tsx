'use client';

import { Button, Group } from '@mantine/core';
import Link from 'next/link';

import ColorSchemeToggle from '~/components/colorSchemeToggle';
import classes from '~/components/navigationSection.home.module.css';

export default function NavigationSection(props: { isLoggedIn: boolean }) {
  return (
    <Group mt={30}>
      {props.isLoggedIn ? (
        <Button
          component={Link}
          href="/files"
          radius="md"
          className={classes.control}
        >
          View Files
        </Button>
      ) : (
        <Button
          component={Link}
          href="/auth/signin"
          radius="md"
          className={classes.control}
        >
          Login
        </Button>
      )}

      <Button
        component={Link}
        href="https://github.com/ickynavigator/filebox"
        target="_blank"
        variant="default"
        radius="md"
        className={classes.control}
      >
        Source code
      </Button>
      <ColorSchemeToggle />
    </Group>
  );
}
