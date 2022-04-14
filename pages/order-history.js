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
} from '@mui/material';
import { Store } from '../utils/Store';
import axios from 'axios';
import { getError } from '../utils/error';
import Layout from '../components/Layout';
import NextLink from 'next/link';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, orders: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function OrderHistoryScreen() {
  const sectionStyle = {
    marginTop: 5,
    marginBottom: 5,
  };

  const router = useRouter();
  const { state } = useContext(Store);

  const { userInfo } = state;

  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    orders: [],
    error: '',
  });

  useEffect(() => {
    if (!userInfo) {
      router.push('/login');
    }

    const fetchOrders = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });

        const { data } = await axios.get(`/api/orders/history`, {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    fetchOrders();
  }, []);
  return (
    <Layout title='Order History'>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <Card sx={sectionStyle}>
            <List>
              <ListItem disablePadding>
                <NextLink href='/profile' passHref>
                  <ListItemButton component='a'>
                    <ListItemText primary='User Profile'></ListItemText>
                  </ListItemButton>
                </NextLink>
              </ListItem>

              <ListItem disablePadding>
                <NextLink href='/order-history' passHref>
                  <ListItemButton selected component='a'>
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
                  Order History
                </Typography>
              </ListItem>

              <ListItem>
                {loading ? (
                  <CircularProgress />
                ) : error ? (
                  <Typography color='error'>{error}</Typography>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            <Typography>ID</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>DATE</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>TOTAL</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>PAID</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>DELIVERED</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>ACTION</Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orders.map((order) => (
                          <TableRow key={order._id}>
                            <TableCell>{order._id.substring(20, 24)}</TableCell>
                            <TableCell>{order.createdAt}</TableCell>
                            <TableCell>{order.totalPrice}</TableCell>
                            <TableCell>
                              {order.isPaid
                                ? `Paid at ${order.paidAt}`
                                : 'Not Paid'}
                            </TableCell>
                            <TableCell>
                              {order.isDelivered
                                ? `Delivered at ${order.deliveredAt}`
                                : 'Not Delivered'}
                            </TableCell>
                            <TableCell>
                              <NextLink href={`/order/${order._id}`} passHref>
                                <Button variant='contained' color='primary'>
                                  Details
                                </Button>
                              </NextLink>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}

export default OrderHistoryScreen;
