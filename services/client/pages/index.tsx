import type { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import buildClient from '../api/buildClient';

export type Ticket = { id: string; title: string; price: string; userId: string };

type PageProps = {
  user: { id: string; email: string } | null;
} & { tickets: Array<Ticket> };

const Home: NextPage<PageProps> = ({ tickets }: PageProps) => {
  return (
    <div>
      <h1>Tickets!</h1>
      <table className="table text-white">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.title}>
              <td>{ticket.title}</td>
              <td>{ticket.price}</td>
              <td>
                <Link href={`/tickets/${ticket.id}`}>See More</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const client = buildClient(context.req);
  const { data } = await client.get('/api/tickets');

  return { props: { tickets: data } };
};

export default Home;
