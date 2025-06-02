import '../styles/globals.css';
import { PlasmicRootProvider } from '@plasmicapp/loader-react';
import { PLASMIC } from '../plasmic-init';
import { Vazirmatn } from 'next/font/google';

const vazirmatn = Vazirmatn({
  subsets: ['arabic'],
  display: 'swap',
  variable: '--font-vazirmatn',
});

function MyApp({ Component, pageProps }) {
  return (
    <PlasmicRootProvider loader={PLASMIC}>
      <main className={`${vazirmatn.variable} font-sans`}>
        <Component {...pageProps} />
      </main>
    </PlasmicRootProvider>
  );
}

export default MyApp; 