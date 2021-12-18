import { useEffect } from 'react';

import '../styles/globals.css';

// import Layout from '../components/Layout';

function MyApp({ Component, pageProps }) {
  // Fix SSR - MUI styles
  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
