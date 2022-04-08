import React from 'react';
import Layout from '../components/Layout';
import { useRouter } from 'next/router';

const Shipping = () => {
  const router = useRouter();

  router.push('/login');
  return <Layout title='shipping'>Shipping</Layout>;
};

export default Shipping;
