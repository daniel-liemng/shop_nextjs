import React, { useContext, useEffect, useReducer } from 'react';
import { Store } from '../../utils/Store';
import { useRouter } from 'next/router';
import axios from 'axios';
import { getError } from '../../utils/error';
import Layout from '../../components/Layout';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import NextLink from 'next/link';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, summary: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const AdminDashboardScreen = () => {
  const sectionStyle = {
    marginTop: 5,
    marginBottom: 5,
  };

  const { state } = useContext(Store);
  const { userInfo } = state;

  const router = useRouter();

  const [{ loading, error, summary }, dispatch] = useReducer(reducer, {
    loading: true,
    summary: { salesData: [] },
    error: '',
  });

  useEffect(() => {
    if (!userInfo) {
      return router.push('/login');
    }

    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/admin/summary`, {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    fetchData();
  }, []);

  const data = {
    labels: summary.salesData.map((x) => x._id),
    datasets: [
      {
        label: 'Sales',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        data: summary.salesData.map((x) => x.totalSales),
      },
    ],
  };

  const options = {
    legend: { display: true, positin: 'right' },
  };

  return (
    <Layout title='Admin Dashboard'>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <Card sx={sectionStyle}>
            <List>
              <ListItem disablePadding>
                <NextLink href='/admin/dashboard' passHref>
                  <ListItemButton selected component='a'>
                    <ListItemText primary='Admin Dashboard'></ListItemText>
                  </ListItemButton>
                </NextLink>
              </ListItem>

              <ListItem disablePadding>
                <NextLink href='/admin/orders' passHref>
                  <ListItemButton component='a'>
                    <ListItemText primary='Orders'></ListItemText>
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
                {loading ? (
                  <CircularProgress />
                ) : error ? (
                  <Typography color='error'>{error}</Typography>
                ) : (
                  <Grid container spacing={4}>
                    <Grid item md={3}>
                      <Card raised>
                        <CardContent>
                          <Typography variant='h1' component='h1'>
                            $ {summary.ordersPrice}
                          </Typography>
                          <Typography>Sales</Typography>
                        </CardContent>
                        <CardActions>
                          <NextLink href={`/admin/orders`} passHref>
                            <Button
                              size='small'
                              color='primary'
                              variant='outlined'
                            >
                              View sales
                            </Button>
                          </NextLink>
                        </CardActions>
                      </Card>
                    </Grid>

                    <Grid item md={3}>
                      <Card raised>
                        <CardContent>
                          <Typography variant='h1' component='h1'>
                            {summary.ordersCount}
                          </Typography>
                          <Typography>Orders</Typography>
                        </CardContent>
                        <CardActions>
                          <NextLink href={`/admin/orders`} passHref>
                            <Button
                              size='small'
                              color='primary'
                              variant='outlined'
                            >
                              View orders
                            </Button>
                          </NextLink>
                        </CardActions>
                      </Card>
                    </Grid>

                    <Grid item md={3}>
                      <Card raised>
                        <CardContent>
                          <Typography variant='h1' component='h1'>
                            {summary.productsCount}
                          </Typography>
                          <Typography>Products</Typography>
                        </CardContent>
                        <CardActions>
                          <NextLink href={`/admin/products`} passHref>
                            <Button
                              size='small'
                              color='primary'
                              variant='outlined'
                            >
                              View products
                            </Button>
                          </NextLink>
                        </CardActions>
                      </Card>
                    </Grid>

                    <Grid item md={3}>
                      <Card raised>
                        <CardContent>
                          <Typography variant='h1' component='h1'>
                            {summary.usersCount}
                          </Typography>
                          <Typography>Users</Typography>
                        </CardContent>
                        <CardActions>
                          <NextLink href={`/admin/users`} passHref>
                            <Button
                              size='small'
                              color='primary'
                              variant='outlined'
                            >
                              View users
                            </Button>
                          </NextLink>
                        </CardActions>
                      </Card>
                    </Grid>
                  </Grid>
                )}
              </ListItem>

              <ListItem>
                <Typography component='h1' variant='h1'>
                  Sales Chart
                </Typography>
              </ListItem>

              <ListItem>
                <Bar options={options} data={data}></Bar>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default AdminDashboardScreen;
