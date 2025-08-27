import { useState, useEffect, useCallback } from 'react';


import { useAuthContext } from '../hooks';
import { paths } from '@/routes/paths';
import { useRouter } from '../../../i18n/routing';
import { useLocale } from 'next-intl';


// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function GuestGuard({ children }: Props) {
  const { loading } = useAuthContext();

  return <>{loading ? <>Loading...</> : <Container>{children}</Container>}</>;
}

// ----------------------------------------------------------------------

function Container({ children }: Props) {
  const router = useRouter();
  const locale = useLocale();

  const { authenticated, loading } = useAuthContext();

  const [checked, setChecked] = useState(false);

  const check = useCallback(() => {
    if(loading) return;

    if (authenticated) {

      router.replace(paths.home(), { locale })
    } else {
      setChecked(true);
    }
  }, [authenticated, router, locale, loading]);

  useEffect(() => {
    check();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading || !checked) {
    return null;
  }

  return <>{children}</>;
}
