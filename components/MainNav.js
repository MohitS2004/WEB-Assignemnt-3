import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  Navbar, Nav, Container, NavDropdown
} from 'react-bootstrap';
import { useAtom } from 'jotai';
import { isAuthenticated, readToken, removeToken } from '@/lib/authenticate';
import { favouritesAtom } from '@/store';

const MainNav = () => {
  const router = useRouter();
  const [, setFavouritesList] = useAtom(favouritesAtom);
  const [token, setToken] = useState(() => readToken());

  useEffect(() => {
    setToken(readToken());
  }, [router.asPath]);

  const handleLogout = () => {
    removeToken();
    setFavouritesList([]);
    setToken(null);
    router.push('/login');
  };

  return (
    <Navbar bg="primary" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={Link} href="/">
          NextReads
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="me-auto">
            <Nav.Link
              as={Link}
              href="/about"
              active={router.pathname === '/about'}
            >
              About
            </Nav.Link>
          </Nav>
          <Nav className="ms-auto">
            {isAuthenticated() ? (
              <NavDropdown title={token?.userName} id="user-dropdown">
                <NavDropdown.Item
                  as={Link}
                  href="/favourites"
                >
                  Favourites
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link
                  as={Link}
                  href="/login"
                  active={router.pathname === '/login'}
                >
                  Login
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  href="/register"
                  active={router.pathname === '/register'}
                >
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MainNav;
