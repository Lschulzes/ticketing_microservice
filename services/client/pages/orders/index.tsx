import { OrderStatus } from 'common';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import buildClient from 'services/client/api/buildClient';
import { BaseUser } from '../_app';

export type Order = {
  id: string;
  expiresAt: string;
  status: OrderStatus;
  userId: string;
  version: number;
  ticket: {
    title: string;
    price: number;
    version: number;
    id: string;
  };
};

type PageProps = { orders: Array<Order> };

const OrderPage = ({ orders }: PageProps & { user: BaseUser }) => {
  return (
    <div>
      <ul>
        {orders.map((order) => (
          <Link key={order.id} href={`/orders/${order.id}`}>
            <li style={{ cursor: 'pointer' }}>
              {order.ticket.title} - {order.status} - Click to see more
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<PageProps> = async (context) => {
  const client = buildClient(context.req);
  const { data } = await client.get(`/api/orders`);

  return { props: { orders: data } };
};

export default OrderPage;
