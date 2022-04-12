import Head from 'next/head';
import NextLink from 'next/link';
import dynamic from 'next/dynamic';
import { createTheme } from '@mui/material/styles';
import {
  ThemeProvider,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Link,
  Switch,
  Badge,
  Button,
  Menu,
  MenuItem,
  Box,
} from '@mui/material';
import { useContext, useState } from 'react';

import { Store } from '../utils/Store';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

const Layout = ({ title, description, children }) => {
  const { state, dispatch } = useContext(Store);
  const { darkMode, cart, userInfo } = state;
  const router = useRouter();

  const theme = createTheme({
    typography: {
      h1: {
        fontSize: '1.6rem',
        fontWeight: 400,
        margin: '1rem 0',
      },
      h2: {
        fontSize: '1.4rem',
        fontWeight: 400,
        margin: '1rem 0',
      },
      body1: {
        fontWeight: 'normal',
      },
    },
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#ff595e',
      },
      secondary: {
        main: '#43aa8b',
      },
    },
  });

  const navbarStyle = {
    backgroundColor: '#203040',
    '& a': {
      color: '#ffffff',
      marginLeft: 10,
    },
  };

  const brandStyle = {
    fontWeight: 'bold',
    fontSize: '1.5rem',
    // flexGrow: 1,
  };

  const growStyle = {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  };

  const mainStyle = {
    minHeight: '80vh',
  };
  const footerStyle = {
    textAlign: 'center',
    marginTop: 10,
  };

  const navbarButtonStyle = {
    color: '#fff',
    textTransform: 'initial',
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const logoutHandler = () => {
    setAnchorEl(null);
    dispatch({ type: 'USER_LOGOUT' });
    Cookies.remove('userInfo');
    Cookies.remove('cartItems');
    router.push('/');
  };

  const darkModeChangeHandler = () => {
    dispatch({ type: darkMode ? 'DARK_MODE_OFF' : 'DARK_MODE_ON' });
    const newDarkMode = !darkMode;
    Cookies.set('darkMode', newDarkMode ? 'ON' : 'OFF');
  };

  return (
    <div>
      <Head>
        <title>{title ? `${title} - Shop | NextJS` : `Shop | NextJS`}</title>
        {description && <meta name='description' content={description}></meta>}
      </Head>

      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position='static' sx={navbarStyle}>
          <Toolbar>
            <Box sx={growStyle}>
              <NextLink href='/' passHref>
                <Link>
                  <Typography sx={{ ...brandStyle, flexGrow: 1 }}>
                    SHOP
                  </Typography>
                </Link>
              </NextLink>
            </Box>

            <Box>
              <Switch
                checked={darkMode}
                onChange={darkModeChangeHandler}
              ></Switch>
              <NextLink href='/cart' passHref>
                <Link>
                  <Typography component={'span'}>
                    {cart.cartItems.length > 0 ? (
                      <Badge
                        color='secondary'
                        badgeContent={cart.cartItems.length}
                      >
                        Cart
                      </Badge>
                    ) : (
                      'Cart'
                    )}
                  </Typography>
                </Link>
              </NextLink>

              {userInfo ? (
                <>
                  <Button
                    sx={navbarButtonStyle}
                    id='basic-button'
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup='true'
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleMenuClick}
                  >
                    {userInfo.name}
                  </Button>
                  <Menu
                    id='basic-menu'
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleMenuClose}
                    MenuListProps={{
                      'aria-labelledby': 'basic-button',
                    }}
                  >
                    <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
                    <MenuItem onClick={handleMenuClose}>My account</MenuItem>
                    <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                  </Menu>
                </>
              ) : (
                <NextLink href='/login' passHref>
                  <Link>Login</Link>
                </NextLink>
              )}
            </Box>
          </Toolbar>
        </AppBar>

        <Container sx={mainStyle}>{children}</Container>
        <footer sx={footerStyle}>
          <Typography>All Right Reserved | Shop @ NextJS</Typography>
        </footer>
      </ThemeProvider>
    </div>
  );
};

export default dynamic(() => Promise.resolve(Layout), { ssr: false });
