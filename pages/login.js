import {
  Button,
  Link,
  List,
  ListItem,
  TextField,
  Typography,
} from '@material-ui/core';
import React from 'react';
import Layout from '../components/Layout';
import useStyles from '../utils/styles';
import NextLink from 'next/link';

const Login = () => {
  const classes = useStyles();

  const loginHandler = () => {};

  return (
    <Layout title='Login'>
      <form className={classes.form}>
        <Typography component={'h1'} variant='h1'>
          Login
        </Typography>
        <List>
          <ListItem>
            <TextField
              fullWidth
              variant='outlined'
              id='email'
              label='Email'
              inputProps={{ type: 'email' }}
            ></TextField>
          </ListItem>
          <ListItem>
            <TextField
              fullWidth
              variant='outlined'
              id='password'
              label='Password'
              inputProps={{ type: 'password' }}
            ></TextField>
          </ListItem>
          <ListItem>
            <Button
              fullWidth
              variant='contained'
              color='primary'
              onClick={loginHandler}
            >
              Login
            </Button>
          </ListItem>
          <ListItem>
            Don't have an account?{' '}
            <NextLink href={'/register'} passHref>
              <Link>Register</Link>
            </NextLink>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
};

export default Login;
