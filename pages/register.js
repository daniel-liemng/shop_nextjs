import {
  Button,
  Link,
  List,
  ListItem,
  TextField,
  Typography,
} from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import Layout from '../components/Layout';
import useStyles from '../utils/styles';
import NextLink from 'next/link';
import axios from 'axios';
import { Store } from '../utils/Store';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

const Register = () => {
  const classes = useStyles();

  const router = useRouter();
  const { redirect } = router.query; // login?redirect=/shipping
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    if (userInfo) {
      router.push('/');
    }
  }, []);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const registerSubmitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    try {
      const { data } = await axios.post('/api/users/register', {
        name,
        email,
        password,
      });
      dispatch({ type: 'USER_LOGIN', payload: data });
      Cookies.set('userInfo', JSON.stringify(data));
      router.push(redirect || '/');
    } catch (err) {
      alert(err.response.data ? err.response.data.message : err.message);
    }
  };

  return (
    <Layout title='Register'>
      <form onSubmit={registerSubmitHandler} className={classes.form}>
        <Typography component={'h1'} variant='h1'>
          Register
        </Typography>
        <List>
          <ListItem>
            <TextField
              fullWidth
              variant='outlined'
              id='name'
              label='Name'
              inputProps={{ type: 'name' }}
              onChange={(e) => setName(e.target.value)}
            ></TextField>
          </ListItem>

          <ListItem>
            <TextField
              fullWidth
              variant='outlined'
              id='email'
              label='Email'
              inputProps={{ type: 'email' }}
              onChange={(e) => setEmail(e.target.value)}
            ></TextField>
          </ListItem>

          <ListItem>
            <TextField
              fullWidth
              variant='outlined'
              id='password'
              label='Password'
              inputProps={{ type: 'password' }}
              onChange={(e) => setPassword(e.target.value)}
            ></TextField>
          </ListItem>

          <ListItem>
            <TextField
              fullWidth
              variant='outlined'
              id='confirmPassword'
              label='Confirm Password'
              inputProps={{ type: 'password' }}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></TextField>
          </ListItem>

          <ListItem>
            <Button fullWidth variant='contained' color='primary' type='submit'>
              Register
            </Button>
          </ListItem>

          <ListItem>
            Already have an account?{' '}
            <NextLink href={`/login?redirect=${redirect || '/'}`} passHref>
              <Link>Login</Link>
            </NextLink>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
};

export default Register;
