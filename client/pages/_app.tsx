import 'bootstrap/dist/css/bootstrap.css';
import type { AppContext, AppProps } from 'next/app';
import App from 'next/app';
import Head from 'next/head';
import buildClient, { Request } from '../api/buildClient';
import '../styles/globals.css';

type PageProps = {
  user: { id: string; email: string } | null;
};

function MyApp({ Component, pageProps, user }: AppProps & PageProps) {
  return (
    <>
      <Head>s</Head>
      <Component {...pageProps} user={user} />
    </>
  );
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);
  try {
    const client = buildClient(appContext.ctx.req as Request);
    const { data } = await client.get('/api/users/current-user');

    return { ...appProps, user: data.currentUser };
  } catch (error) {
    return { ...appProps, user: null };
  }
};

export default MyApp;
