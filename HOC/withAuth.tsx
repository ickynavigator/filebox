import { AUTH_REFRESH_TIME } from '>lib/constants';
import { keys } from '>lib/swr';
import { Auth } from '>types';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import useSWR from 'swr';

type BasicProp = Record<string, unknown>;

function WithAuth<T extends BasicProp = BasicProp>(
  WrappedComponent: React.ComponentType<T>,
) {
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || 'Component';

  const EnhancedComponent = (props: T) => {
    const router = useRouter();

    const res = useSWR(
      keys.AUTH,
      async () => {
        const { data } = await axios.get<{ message: Auth }>('/api/auth/check');
        return data;
      },
      {
        refreshInterval: AUTH_REFRESH_TIME,
        refreshWhenHidden: true,
      },
    );

    useEffect(() => {
      if (typeof window === 'undefined') return;
      if (!res.data) return;

      if (res.data?.message !== Auth.Authorized) {
        router.push(`/auth?next=${router.asPath}`);
      }
    }, [res.data, router]);

    return <WrappedComponent {...props} />;
  };
  EnhancedComponent.displayName = `withAuth(${displayName})`;
  return EnhancedComponent;
}

export default WithAuth;
