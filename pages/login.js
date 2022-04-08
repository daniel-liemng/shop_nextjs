import {
  Button,
  Link,
  List,
  ListItem,
  TextField,
  Typography,
} from '@material-ui/core';
import React, { useState } from 'react';
import Layout from '../components/Layout';
import useStyles from '../utils/styles';
import NextLink from 'next/link';
import axios from 'axios';

const Login = () => {
  const classes = useStyles();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post('/api/users/login', {
        email,
        password,
      });
      console.log('ddd', data);
    } catch (err) {
      alert(err.response.data ? err.response.data.message : err.message);
    }
  };

  return (
    <Layout title='Login'>
      <form onSubmit={loginSubmitHandler} className={classes.form}>
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
            <Button fullWidth variant='contained' color='primary' type='submit'>
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
