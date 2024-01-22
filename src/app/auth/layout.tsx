import { redirect } from 'next/navigation';
import { auth } from '~/lib/auth';

interface LayoutProps {
  children: React.ReactNode;
}

async function Layout({ children }: LayoutProps) {
  const session = await auth();

  if (session) {
    redirect(`/`);
  }

  return <>{children}</>;
}

export default Layout;
