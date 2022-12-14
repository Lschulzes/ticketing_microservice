import 'bootstrap/dist/css/bootstrap.css';
import type { AppContext, AppProps } from 'next/app';
import App from 'next/app';
import buildClient, { Request } from '../api/buildClient';
import Header from '../components/Header';
import '../styles/globals.css';

export type BaseUser = { id: string; email: string };

export type PageProps = {
  user: BaseUser | null;
};

function MyApp({ Component, pageProps, user }: AppProps & PageProps) {
  return (
    <>
      <Header user={user} />
      <div className="container">
        <Component {...pageProps} user={user} />
      </div>
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
