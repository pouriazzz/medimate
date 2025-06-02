import '../styles/globals.css';
import { PlasmicRootProvider } from '@plasmicapp/loader-react';
import { PLASMIC } from '../plasmic-init';

function MyApp({ Component, pageProps }) {
  return (
    <PlasmicRootProvider loader={PLASMIC}>
      <Component {...pageProps} />
    </PlasmicRootProvider>
  );
}

export default MyApp; 