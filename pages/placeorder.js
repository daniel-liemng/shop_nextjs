import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Link,
  Button,
  List,
  ListItem,
  Card,
  CircularProgress,
} from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Layout from '../components/Layout';
import { Store } from '../utils/Store';
import NextLink from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/router';
import CheckoutWizard from '../components/CheckoutWizard';
import { useSnackbar } from 'notistack';
import { getError } from '../utils/error';
import Cookies from 'js-cookie';

const PlaceOrderScreen = () => {
  const sectionStyle = {
    marginTop: 5,
    marginBottom: 5,
  };

  const router = useRouter();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { state, dispatch } = useContext(Store);
  const {
    userInfo,
    cart: { cartItems, shippingAddress, paymentMethod },
  } = state;

  const [loading, setLoading] = useState(false);

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;

  const itemsPrice = round2(
    cartItems.reduce((a, c) => a + c.price * c.quantity, 0),
  );

  const taxPrice = round2(itemsPrice * 0.13);

  const shippingPrice = round2(itemsPrice > 200 ? 0 : 15);

  const totalPrice = round2(itemsPrice + taxPrice + shippingPrice);

  useEffect(() => {
    if (!paymentMethod) {
      router.push('/payment');
    }
    if (cartItems.length === 0) {
      router.push('/cart');
    }
  }, []);

  const placeOrderHandler = async () => {
    closeSnackbar();
    try {
      setLoading(true);

      const { data } = await axios.post(
        '/api/orders',
        {
          orderItems: cartItems,
          shippingAddress,
          paymentMethod,
          itemsPrice,
          taxPrice,
          shippingPrice,
          totalPrice,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        },
      );

      dispatch({ type: 'CLEAR_CART' });
      Cookies.remove('cartItems');
      setLoading(false);
      // redirect to order detail page
      router.push(`/order/${data._id}`);
    } catch (error) {
      setLoading(false);
      enqueueSnackbar(getError(error), { variant: 'error' });
    }
  };

  return (
    <Layout title='Shopping Cart'>
      <CheckoutWizard activeStep={3}></CheckoutWizard>
      <Typography component='h3' variant='h3' style={{ marginTop: 5 }}>
        Place Order
      </Typography>
      <Grid container spacing={1}>
        <Grid item xs={12} md={9}>
          <Card sx={sectionStyle}>
            <List>
              <ListItem>
                <Typography component='h2' variant='h2'>
                  Shipping Address
                </Typography>
              </ListItem>
              <ListItem>
                <Typography>
                  {shippingAddress.fullName}, {shippingAddress.address},{' '}
                  {shippingAddress.city}, {shippingAddress.postalCode},{' '}
                  {shippingAddress.country}
                </Typography>
              </ListItem>
            </List>
          </Card>

          <Card sx={sectionStyle}>
            <List>
              <ListItem>
                <Typography component='h2' variant='h2'>
                  Payment Method
                </Typography>
              </ListItem>
              <ListItem>
                <Typography>{paymentMethod}</Typography>
              </ListItem>
            </List>
          </Card>

          <Card sx={sectionStyle}>
            <List>
              <ListItem>
                <Typography component='h2' variant='h2'>
                  Order Items
                </Typography>
              </ListItem>
              <ListItem>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Image</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell align='right'>Quantity</TableCell>
                        <TableCell align='right'>Price</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {cartItems.map((item) => (
                        <TableRow key={item._id}>
                          <TableCell>
                            <NextLink href={`/products/${item.slug}`} passHref>
                              <Link>
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  width={50}
                                  height={50}
                                />
                              </Link>
                            </NextLink>
                          </TableCell>

                          <TableCell>
                            <NextLink href={`/products/${item.slug}`} passHref>
                              <Link>
                                <Typography>{item.name}</Typography>
                              </Link>
                            </NextLink>
                          </TableCell>

                          <TableCell align='right'>
                            <Typography>{item.quantity}</Typography>
                          </TableCell>

                          <TableCell align='right'>
                            <Typography>$ {item.price}</Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </ListItem>
            </List>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={sectionStyle}>
            <List>
              <ListItem>
                <Typography variant='h2'>Order Summary</Typography>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Items</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>$ {itemsPrice}</Typography>
                  </Grid>
                </Grid>
              </ListItem>

              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Tax</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>$ {taxPrice}</Typography>
                  </Grid>
                </Grid>
              </ListItem>

              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Shipping</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>
                      $ {shippingPrice} (
                      {shippingPrice === 0
                        ? 'Free Shipping'
                        : 'Shipping fee is applied'}
                      )
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>

              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>
                      <strong>Total</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>
                      <strong>$ {totalPrice}</strong>
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Button
                  onClick={placeOrderHandler}
                  variant='contained'
                  color='primary'
                  fullWidth
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={30} /> : 'Place Order'}
                </Button>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default dynamic(() => Promise.resolve(PlaceOrderScreen), { ssr: false });
