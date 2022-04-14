import React, { useEffect, useContext, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

import { Store } from '../utils/Store';
import Layout from '../components/Layout';
import CheckoutWizard from '../components/CheckoutWizard';
import {
  Button,
  FormControl,
  FormControlLabel,
  List,
  ListItem,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import { useSnackbar } from 'notistack';

const Payment = () => {
  const { state, dispatch } = useContext(Store);
  const router = useRouter();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const {
    cart: { shippingAddress },
  } = state;

  const [paymentMethod, setPaymentMethod] = useState('');

  useEffect(() => {
    if (!shippingAddress.address) {
      router.push('/shipping');
    } else {
      setPaymentMethod(Cookies.get('paymentMethod') || '');
    }
  }, []);

  const submitPaymentHandler = (e) => {
    closeSnackbar();
    e.preventDefault();

    if (!paymentMethod) {
      enqueueSnackbar('Payment method is required', { variant: 'error' });
    } else {
      dispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethod });
      Cookies.set('paymentMethod', paymentMethod);
      router.push('/placeorder');
    }
  };

  const formStyle = {
    maxWidth: 800,
    margin: '0 auto',
  };

  return (
    <Layout title={'Payment Method'}>
      <CheckoutWizard activeStep={2}></CheckoutWizard>
      <form sx={formStyle} onSubmit={submitPaymentHandler}>
        <Typography variant='h3' component='h3'>
          Payment Method
        </Typography>
        <List>
          <ListItem>
            <FormControl component='fieldset'>
              <RadioGroup
                aria-label='Payment Method'
                name='paymentMethod'
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <FormControlLabel
                  control={<Radio />}
                  value='PayPal'
                  label='PayPal'
                />
                <FormControlLabel
                  control={<Radio />}
                  value='Stripe'
                  label='Stripe'
                />
                <FormControlLabel
                  control={<Radio />}
                  value='Cash'
                  label='Cash'
                />
              </RadioGroup>
            </FormControl>
          </ListItem>

          <ListItem>
            <Button fullWidth type='submit' variant='contained' color='primary'>
              Continue
            </Button>
          </ListItem>

          <ListItem>
            <Button
              fullWidth
              type='button'
              variant='contained'
              color='secondary'
              onClick={() => router.push('/shipping')}
            >
              Back
            </Button>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
};

export default Payment;
