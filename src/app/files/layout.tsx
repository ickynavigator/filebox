import { AppShell, AppShellHeader, AppShellMain } from '@mantine/core';
import React from 'react';
import { NavigationBar } from '~/components/NavigationBar';

interface Props {
  children: React.ReactNode;
}

export default function Layout(props: Props) {
  const { children } = props;

  return (
    <AppShell header={{ height: 60 }} mih="100%">
      <AppShellHeader>
        <NavigationBar />
      </AppShellHeader>

      <AppShellMain h="100%">{children}</AppShellMain>
    </AppShell>
  );
}
