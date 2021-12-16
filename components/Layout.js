import Head from 'next/head';
import { AppBar, Toolbar, Typography, Container } from '@material-ui/core';

import useStyles from '../utils/styles';

const Layout = ({ children }) => {
  const classes = useStyles();

  return (
    <div>
      <Head>
        <title>Shop | NextJS</title>
      </Head>
      <AppBar position='static' className={classes.navbar}>
        <Toolbar>
          <Typography>SHOP</Typography>
        </Toolbar>
      </AppBar>
      <Container className={classes.main}>{children}</Container>
      <footer className={classes.footer}>
        All Right Reserved | Shop @ NextJS
      </footer>
    </div>
  );
};

export default Layout;
