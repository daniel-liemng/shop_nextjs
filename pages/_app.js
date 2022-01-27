import { useEffect } from 'react';

import '../styles/globals.css';
import { StoreProvider } from '../utils/Store';

// import Layout from '../components/Layout';

function MyApp({ Component, pageProps }) {
  // Fix SSR - MUI styles
  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <StoreProvider>
      <Component {...pageProps} />
    </StoreProvider>
  );
}

export default MyApp;
