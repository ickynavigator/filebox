import '@mantine/core/styles.css';
import '@mantine/dropzone/styles.css';
import '@mantine/notifications/styles.css';
import '~/styles/globals.css';

import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { Analytics } from '@vercel/analytics/react';
import { bricolage } from '~/lib/font';
import theme from '~/lib/mantine';
import type { Metadata } from 'next';

interface Props {
  children: React.ReactNode;
}

export function generateMetadata(): Metadata {
  return {
    title: {
      template: 'File Box | %s',
      default: 'File Box',
    },
    description: 'A file sharing application',
    keywords: ['PORTFOLIO', 'DEVELOPER', 'NEXTJS', 'REACTJS', 'SANITY'],
    robots: 'index, follow',
    creator: 'Obi Fortune',
    authors: [{ name: 'Obi Fortune', url: 'https://obifortune.com' }],
    openGraph: {
      type: 'website',
      title: {
        template: 'File Box | %s',
        default: 'File Box',
      },
      description: 'A file sharing application',
      url: '/',
    },
    twitter: {
      card: 'summary',
      title: {
        template: 'File Box | %s',
        default: 'File Box',
      },
      description: 'A file sharing application',
      site: '/',
      creator: '@obifortunebleh',
      creatorId: '1467726470533754880',
    },
  };
}

function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>

      <body className={bricolage.className}>
        <MantineProvider theme={theme}>
          <Notifications />

          {children}
        </MantineProvider>

        <Analytics />
      </body>
    </html>
  );
}

export default RootLayout;
