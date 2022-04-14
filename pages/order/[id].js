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
  List,
  ListItem,
  Card,
  CircularProgress,
} from '@mui/material';
import { useContext, useEffect, useReducer } from 'react';
import dynamic from 'next/dynamic';
import Layout from '../../components/Layout';
import { Store } from '../../utils/Store';
import NextLink from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/router';
import CheckoutWizard from '../../components/CheckoutWizard';
// import { useSnackbar } from 'notistack';
import { getError } from '../../utils/error';
// import Cookies from 'js-cookie';

// useReducer
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const OrderScreen = ({ params }) => {
  const sectionStyle = {
    marginTop: 5,
    marginBottom: 5,
  };

  const orderId = params.id;

  const router = useRouter();
  // const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{ loading, error, order }, dispatch] = useReducer(reducer, {
    loading: true,
    order: {},
    error: '',
  });

  const {
    shippingAddress,
    paymentMethod,
    orderItems,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isDelivered,
    isPaid,
    deliveredAt,
    paidAt,
  } = order;

  useEffect(() => {
    if (!userInfo) {
      return router.push('/login');
    }

    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });

        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        });

        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    if (!order._id || (order._id && order._id !== orderId)) {
      fetchOrder();
    }
  }, [order]);

  return (
    <Layout title={`Order ${orderId}`}>
      <CheckoutWizard activeStep={3}></CheckoutWizard>
      <Typography component='h3' variant='h3' style={{ marginTop: 5 }}>
        Order {orderId}
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color='error'>{error}</Typography>
      ) : (
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
                <ListItem>
                  <Typography>
                    Status:{' '}
                    {isDelivered
                      ? `Delivered at ${deliveredAt}`
                      : `Not delivered`}
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
                <ListItem>
                  <Typography>
                    Status: {isPaid ? `Paid at ${paidAt}` : `Not paid`}
                  </Typography>
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
                        {orderItems.map((item) => (
                          <TableRow key={item._id}>
                            <TableCell>
                              <NextLink
                                href={`/products/${item.slug}`}
                                passHref
                              >
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
                              <NextLink
                                href={`/products/${item.slug}`}
                                passHref
                              >
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
              </List>
            </Card>
          </Grid>
        </Grid>
      )}
    </Layout>
  );
};

export const getServerSideProps = async ({ params }) => {
  return {
    props: {
      params,
    },
  };
};

export default dynamic(() => Promise.resolve(OrderScreen), { ssr: false });
