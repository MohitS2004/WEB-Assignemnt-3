import '@/styles/bootstrap.min.css';
import '@/styles/globals.css';
import { useCallback, useEffect, useState } from 'react';
import { Container, SSRProvider } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { useAtom } from 'jotai';
import MainNav from '@/components/MainNav';
import { isAuthenticated } from '@/lib/authenticate';
import { getFavourites } from '@/lib/userData';
import { favouritesAtom } from '@/store';

const publicPaths = ['/login', '/register'];

const RouteGuard = ({ children }) => {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [, setFavouritesList] = useAtom(favouritesAtom);

  const loadFavourites = useCallback(async () => {
    setFavouritesList(await getFavourites());
  }, [setFavouritesList]);

  const authCheck = useCallback((url) => {
    const path = url.split('?')[0];
    if (!isAuthenticated() && !publicPaths.includes(path)) {
      setAuthorized(false);
      router.push('/login');
    } else {
      setAuthorized(true);
    }
  }, [router]);

  useEffect(() => {
    if (isAuthenticated()) {
      loadFavourites();
    }
  }, [loadFavourites]);

  useEffect(() => {
    authCheck(router.pathname);

    const handleRouteChange = (url) => authCheck(url);
    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [authCheck, router.events, router.pathname]);

  return authorized && children;
};

function MyApp({ Component, pageProps }) {
  return (
    <SSRProvider>
      <RouteGuard>
        <MainNav />
        <Container className="py-4">
          <Component {...pageProps} />
        </Container>
      </RouteGuard>
    </SSRProvider>
  );
}

export default MyApp;
