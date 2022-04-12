import {
  Button,
  List,
  ListItem,
  TextField,
  Link,
  Typography,
} from '@mui/material';
import React, { useContext, useEffect } from 'react';
import Layout from '../components/Layout';
import NextLink from 'next/link';
import axios from 'axios';
import { Store } from '../utils/Store';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { useForm, Controller } from 'react-hook-form';
import { useSnackbar } from 'notistack';

const Register = () => {
  const formStyle = {
    maxWidth: 800,
    margin: '0 auto',
  };

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const router = useRouter();
  const { redirect } = router.query; // login?redirect=/shipping
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    if (userInfo) {
      router.push('/');
    }
  }, []);

  // const [name, setName] = useState('');
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  // const [confirmPassword, setConfirmPassword] = useState('');

  const registerSubmitHandler = async ({
    name,
    email,
    password,
    confirmPassword,
  }) => {
    closeSnackbar();
    if (password !== confirmPassword) {
      enqueueSnackbar("Passwords don't match", { variant: 'error' });
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
      enqueueSnackbar(
        err.response.data ? err.response.data.message : err.message,
        { variant: 'error' },
      );
    }
  };

  return (
    <Layout title='Register'>
      <form onSubmit={handleSubmit(registerSubmitHandler)} sx={formStyle}>
        <Typography component={'h1'} variant='h1'>
          Register
        </Typography>
        <List>
          <ListItem>
            <Controller
              name='name'
              control={control}
              defaultValue=''
              rules={{
                required: true,
                minLength: 3,
              }}
              render={({ field }) => (
                <TextField
                  fullWidth
                  variant='outlined'
                  id='name'
                  label='Name'
                  inputProps={{ type: 'name' }}
                  error={Boolean(errors.name)}
                  helperText={
                    errors.name
                      ? errors.name.type === 'minLength'
                        ? 'Name is at least 3 characters'
                        : 'Name is required'
                      : ''
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>

          <ListItem>
            <Controller
              name='email'
              control={control}
              defaultValue=''
              rules={{
                required: true,
                pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
              }}
              render={({ field }) => (
                <TextField
                  fullWidth
                  variant='outlined'
                  id='email'
                  label='Email'
                  inputProps={{ type: 'email' }}
                  error={Boolean(errors.email)}
                  helperText={
                    errors.email
                      ? errors.email.type === 'pattern'
                        ? 'Email is not valid'
                        : 'Email is required'
                      : ''
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>

          <ListItem>
            <Controller
              name='password'
              control={control}
              defaultValue=''
              rules={{
                required: true,
                minLength: 6,
              }}
              render={({ field }) => (
                <TextField
                  fullWidth
                  variant='outlined'
                  id='password'
                  label='Password'
                  inputProps={{ type: 'password' }}
                  error={Boolean(errors.password)}
                  helperText={
                    errors.password
                      ? errors.password.type === 'minLength'
                        ? 'Password must be at least 6 characters'
                        : 'Password is required'
                      : ''
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>

          <ListItem>
            <Controller
              name='confirmPassword'
              control={control}
              defaultValue=''
              rules={{
                required: true,
                minLength: 6,
              }}
              render={({ field }) => (
                <TextField
                  fullWidth
                  variant='outlined'
                  id='confirmPassword'
                  label='Confirm Password'
                  inputProps={{ type: 'password' }}
                  error={Boolean(errors.confirmPassword)}
                  helperText={
                    errors.confirmPassword
                      ? errors.confirmPassword.type === 'minLength'
                        ? 'Confirm Password must be at least 6 characters'
                        : 'Confirm Password is required'
                      : ''
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
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
      <Button variant='contained'>Text</Button>
    </Layout>
  );
};

export default Register;
