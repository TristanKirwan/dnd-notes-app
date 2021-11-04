import '../styles/reset.css';
import '../styles/globals.scss';
import Head from 'next/head';
import { StoreProvider } from '../store/provider'
import Navigation from '../components/Navbar/navbar'

function MyApp({ Component, pageProps }) {
  return <>
   <Head>
    <title>DnD Notes App</title>
    <meta name="description" content="An app that allows friends to create and share notes for Dungeons and Dragons to aid in their adventures." />
    <link rel="icon" href="/favicon.ico" />
    <link 
      href="/Inter.var.woff2" 
      as="font"
      crossOrigin="anonymous"
    />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" integrity="sha512-1ycn6IcaQQ40/MKBW2W4Rhis/DbILU74C1vSrLJxCq57o941Ym01SwNsOMqvEBFlcgUa6xLiPY/NS5R+E6ztJQ==" crossOrigin="anonymous" referrerpolicy="no-referrer" />
  </Head>
  <StoreProvider>
    <Navigation />
    <Component {...pageProps} />
  </StoreProvider>
  </>
}

export default MyApp
