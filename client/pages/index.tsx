import type { GetServerSideProps, NextPage } from 'next';
import buildClient from '../api/buildClient';

type PageProps = {
  user: { id: string; email: string } | null;
};

const Home: NextPage<PageProps> = ({ user }: PageProps) => {
  return <h3>Hello {user?.email}!</h3>;
};

export const getServerSideProps: GetServerSideProps<PageProps> = async ({ req }) => {
  try {
    const client = buildClient(req);
    const { data } = await client.get('/api/users/current-user');

    return { props: { user: data.currentUser } };
  } catch (error) {
    return { props: { user: null } };
  }
};

export default Home;
