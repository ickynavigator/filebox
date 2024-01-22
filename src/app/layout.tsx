import '@mantine/core/styles.css';
import '@mantine/dropzone/styles.css';
import '@mantine/notifications/styles.css';
import '~/styles/globals.css';

import {
  AppShell,
  AppShellHeader,
  AppShellMain,
  Box,
  ColorSchemeScript,
  MantineProvider,
} from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { Analytics } from '@vercel/analytics/react';
import { SessionProvider } from 'next-auth/react';
import { NavigationBar } from '~/components/NavigationBar';
import { bricolage } from '~/lib/font';
import theme from '~/lib/mantine';

interface Props {
  children: React.ReactNode;
}

function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>

      <body className={bricolage.className}>
        <SessionProvider>
          <MantineProvider theme={theme}>
            <Notifications />
            <AppShell header={{ height: 60 }} mih="100%">
              <AppShellHeader>
                <NavigationBar />
              </AppShellHeader>
              <AppShellMain h="100%">
                <Box h="100%">{children}</Box>
              </AppShellMain>
            </AppShell>
          </MantineProvider>
        </SessionProvider>

        <Analytics />
      </body>
    </html>
  );
}

export default RootLayout;
