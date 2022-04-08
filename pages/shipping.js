import React, { useContext } from 'react';
import Layout from '../components/Layout';
import { useRouter } from 'next/router';
import { Store } from '../utils/Store';

const Shipping = () => {
  const router = useRouter();
  const { state } = useContext(Store);
  const { userInfo } = state;

  if (!userInfo) {
    router.push('/login?redirect=/shipping');
  }

  return <Layout title='shipping'>Shipping</Layout>;
};

export default Shipping;
