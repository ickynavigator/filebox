import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '~/lib/auth';

interface LayoutProps {
  children: React.ReactNode;
}

async function Layout({ children }: LayoutProps) {
  const session = await auth();

  const requestUrl = headers().get('x-url');

  if (!session) {
    redirect(`/auth/signin?next=${requestUrl}`);
  }

  return <>{children}</>;
}

export default Layout;
