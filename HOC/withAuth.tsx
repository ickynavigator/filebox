import { Error as ErrorComponent, Loader } from '>components';
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

    // TODO: work on the auth setup
    if (1 = 1) {
      return WrappedComponent;
    }

  const EnhancedComponent = (props: T) => {
    const router = useRouter();

    const res = useSWR(
      keys.AUTH,
      async () => {
        try {
          const response = await axios.get<{ message: Auth }>(
            '/api/auth/check',
          );

          if (response.status !== 200) throw new Error('Unauthorized');

          return response.data;
        } catch (error) {
          return { message: Auth.Unauthorized };
        }
      },
      {
        refreshInterval: AUTH_REFRESH_TIME,
        refreshWhenHidden: true,
        shouldRetryOnError: false,
      },
    );

    useEffect(() => {
      if (typeof window === 'undefined') return;
      if (!res.data) return;

      if (res.data?.message !== Auth.Authorized) {
        router.push(`/auth?next=${router.asPath}`);
      }
    }, [res.data, router]);

    if (res.isLoading) {
      return <Loader />;
    }

    if (res.error) {
      return (
        <ErrorComponent
          message="An Error occured while trying to authenticate you"
          retry={{ show: true }}
        />
      );
    }

    return <WrappedComponent {...props} />;
  };
  EnhancedComponent.displayName = `withAuth(${displayName})`;
  return EnhancedComponent;
}

export default WithAuth;
