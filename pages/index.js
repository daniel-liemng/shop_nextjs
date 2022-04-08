import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from '@material-ui/core';
import NextLink from 'next/link';

// import { data } from '../utils/data';
import Layout from '../components/Layout';
import db from '../utils/db';
import Product from '../models/Product';
import axios from 'axios';
import { useContext } from 'react';
import { Store } from '../utils/Store';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

const Home = (props) => {
  const { state, dispatch } = useContext(Store);
  const router = useRouter();

  const { products } = props;

  const addToCartHandler = async (product) => {
    const existItem = state.cart.cartItems.find((x) => x._id === product._id);
    const actualQuantity = existItem ? existItem.quantity + 1 : 1;

    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.countInStock < actualQuantity) {
      window.alert('Sorry, product is out of stock');
      return;
    }

    dispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, quantity: actualQuantity },
    });
    router.push('/cart');
  };

  return (
    <Layout>
      <Typography>Products</Typography>
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item md={4} key={product.name}>
            <Card>
              <NextLink href={`/products/${product.slug}`} passHref>
                <CardActionArea>
                  <CardMedia
                    component='img'
                    image={product.image}
                    title={product.name}
                  ></CardMedia>
                  <CardContent>
                    <Typography>{product.name}</Typography>
                  </CardContent>
                </CardActionArea>
              </NextLink>
              <CardActions>
                <Typography>$ {product.price}</Typography>
                <Button
                  size='small'
                  color='primary'
                  onClick={() => addToCartHandler(product)}
                >
                  Add to cart
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Layout>
  );
};

export const getServerSideProps = async () => {
  await db.connectDB();

  const products = await Product.find().lean();

  await db.disconnectDB();

  return {
    props: {
      products: products.map(db.converDocToObj),
    },
  };
};

export default dynamic(() => Promise.resolve(Home), { ssr: false });
