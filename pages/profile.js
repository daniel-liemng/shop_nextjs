import React, { useContext, useEffect, useReducer } from 'react';
import { useRouter } from 'next/router';
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  List,
  ListItem,
  Card,
  CircularProgress,
  Button,
  ListItemText,
  ListItemButton,
  TextField,
} from '@mui/material';
import { Store } from '../utils/Store';
import axios from 'axios';
import { getError } from '../utils/error';
import Layout from '../components/Layout';
import NextLink from 'next/link';
import { Controller, useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import Cookies from 'js-cookie';

const ProfileScreen = () => {
  const sectionStyle = {
    marginTop: 5,
    marginBottom: 5,
  };

  const router = useRouter();
  const { state, dispatch } = useContext(Store);

  const { userInfo } = state;

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  useEffect(() => {
    if (!userInfo) {
      return router.push('/login');
    }

    setValue('name', userInfo.name);
    setValue('email', userInfo.email);
  }, []);

  const updateProfileSubmitHandler = async ({
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
      const { data } = await axios.put(
        '/api/users/profile',
        {
          name,
          email,
          password,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        },
      );
      dispatch({ type: 'USER_LOGIN', payload: data });
      Cookies.set('userInfo', JSON.stringify(data));

      enqueueSnackbar('Profile updated', { variant: 'success' });
    } catch (err) {
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };
  return (
    <Layout title='Profile'>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <Card sx={sectionStyle}>
            <List>
              <ListItem disablePadding>
                <NextLink href='/profile' passHref>
                  <ListItemButton selected component='a'>
                    <ListItemText primary='User Profile'></ListItemText>
                  </ListItemButton>
                </NextLink>
              </ListItem>

              <ListItem disablePadding>
                <NextLink href='/order-history' passHref>
                  <ListItemButton component='a'>
                    <ListItemText primary='Order History'></ListItemText>
                  </ListItemButton>
                </NextLink>
              </ListItem>
            </List>
          </Card>
        </Grid>

        <Grid item xs={12} md={9}>
          <Card sx={sectionStyle}>
            <List>
              <ListItem>
                <Typography
                  component='h1'
                  variant='h1'
                  style={{ marginTop: 5 }}
                >
                  Profile
                </Typography>
              </ListItem>

              <form
                onSubmit={handleSubmit(updateProfileSubmitHandler)}
                sx={formStyle}
              >
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
                        inputProps={{ type: 'text' }}
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
                      validate: (value) =>
                        value === '' ||
                        value.length > 5 ||
                        'Password length is more than 5',
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
                            ? 'Password must be at least 6 characters'
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
                      validate: (value) =>
                        value === '' ||
                        value.length > 5 ||
                        'Confirm password length is more than 5',
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
                            ? 'Confirm Password must be at least 6 characters'
                            : ''
                        }
                        {...field}
                      ></TextField>
                    )}
                  ></Controller>
                </ListItem>

                <ListItem>
                  <Button
                    fullWidth
                    variant='contained'
                    color='primary'
                    type='submit'
                  >
                    Update
                  </Button>
                </ListItem>
              </form>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default ProfileScreen;
