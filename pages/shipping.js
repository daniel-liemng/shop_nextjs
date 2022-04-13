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
import { Store } from '../utils/Store';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { useForm, Controller } from 'react-hook-form';
import CheckoutWizard from '../components/checkoutWizard';

const Shipping = () => {
  const formStyle = {
    maxWidth: 800,
    margin: '0 auto',
  };

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();

  const router = useRouter();

  const { state, dispatch } = useContext(Store);
  const {
    userInfo,
    cart: { shippingAddress },
  } = state;

  useEffect(() => {
    if (!userInfo) {
      router.push('/login?redirect=/shipping');
    }
    setValue('fullName', shippingAddress.fullName);
    setValue('address', shippingAddress.address);
    setValue('city', shippingAddress.city);
    setValue('postalCode', shippingAddress.postalCode);
    setValue('country', shippingAddress.country);
  }, []);

  const shippingSubmitHandler = async ({
    fullName,
    address,
    city,
    postalCode,
    country,
  }) => {
    dispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: {
        fullName,
        address,
        city,
        postalCode,
        country,
      },
    });
    Cookies.set(
      'shippingAddress',
      JSON.stringify({
        fullName,
        address,
        city,
        postalCode,
        country,
      }),
    );
    router.push('/payment');
  };

  return (
    <Layout title='Shipping'>
      <CheckoutWizard activeStep={1} />
      <form onSubmit={handleSubmit(shippingSubmitHandler)} sx={formStyle}>
        <Typography component={'h1'} variant='h1'>
          Shipping Address
        </Typography>
        <List>
          <ListItem>
            <Controller
              name='fullName'
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
                  id='fullName'
                  label='Full Name'
                  inputProps={{ type: 'text' }}
                  error={Boolean(errors.fullName)}
                  helperText={
                    errors.fullName
                      ? errors.fullName.type === 'minLength'
                        ? 'Full name is at least 3 characters'
                        : 'Full name is required'
                      : ''
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>

          <ListItem>
            <Controller
              name='address'
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
                  id='address'
                  label='Address'
                  inputProps={{ type: 'text' }}
                  error={Boolean(errors.address)}
                  helperText={
                    errors.address
                      ? errors.address.type === 'minLength'
                        ? 'Address is at least 3 characters'
                        : 'Address is required'
                      : ''
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>

          <ListItem>
            <Controller
              name='city'
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
                  id='city'
                  label='City'
                  inputProps={{ type: 'text' }}
                  error={Boolean(errors.city)}
                  helperText={
                    errors.city
                      ? errors.city.type === 'minLength'
                        ? 'City is at least 3 characters'
                        : 'City is required'
                      : ''
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>

          <ListItem>
            <Controller
              name='postalCode'
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
                  id='postalCode'
                  label='Postal Code'
                  inputProps={{ type: 'text' }}
                  error={Boolean(errors.postalCode)}
                  helperText={
                    errors.postalCode
                      ? errors.postalCode.type === 'minLength'
                        ? 'Postal code is at least 3 characters'
                        : 'Postal code is required'
                      : ''
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>

          <ListItem>
            <Controller
              name='country'
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
                  id='country'
                  label='Country'
                  inputProps={{ type: 'text' }}
                  error={Boolean(errors.country)}
                  helperText={
                    errors.country
                      ? errors.country.type === 'minLength'
                        ? 'Country is at least 3 characters'
                        : 'Country is required'
                      : ''
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>

          <ListItem>
            <Button fullWidth variant='contained' color='primary' type='submit'>
              Continue
            </Button>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
};

export default Shipping;
