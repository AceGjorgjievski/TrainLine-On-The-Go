import { useState, useEffect, useCallback } from 'react';


import { useAuthContext } from '../hooks';
import { paths } from '@/routes/paths';
import { usePathname, useRouter } from '@/routes/hooks';

// ----------------------------------------------------------------------

const loginPaths: Record<string, (locale: string) => string> = {
  jwt: (locale: string) => paths.auth.jwt.login(locale),
};

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function AuthGuard({ children }: Props) {
  const { loading } = useAuthContext();

  return <>{loading ? <>Loading...</> : <Container>{children}</Container>}</>;
}

// ----------------------------------------------------------------------

function Container({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const { authenticated } = useAuthContext();

  const [checked, setChecked] = useState(false);

  const check = useCallback(() => {
    if (!authenticated) {
      const pathParts = pathname!.split('/');
      const locale = pathParts[1] || 'en';
      const loginPath = loginPaths.jwt(locale);

      router.replace(loginPath)
    } else {
      setChecked(true);
    }
  }, [authenticated, router, pathname]);

  useEffect(() => {
    check();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!checked) {
    return null;
  }

  return <>{children}</>;
}
