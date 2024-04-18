'use client';

import { Button } from '@mantine/core';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import classes from '~/components/NavigationButton.module.css';

interface NavigationButtonProps {
  href: string;
  children: string;
}

const NavigationButton = (props: NavigationButtonProps) => {
  const { href, children } = props;

  const pathname = usePathname();

  const active = pathname === href;

  return (
    <Button
      component={Link}
      href={href}
      variant={active ? 'filled' : 'subtle'}
      size="compact-md"
      tt="capitalize"
      fw="bold"
      fz="sm"
      className={classes.button}
    >
      {children}
    </Button>
  );
};

export default NavigationButton;
