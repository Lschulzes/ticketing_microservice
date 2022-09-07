import { OrderStatus } from 'common';
import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import buildClient from 'services/client/api/buildClient';
import useRequest from 'services/client/hooks/useRequest';

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

type PageProps = { order: Order };

const OrderPage = ({ order }: PageProps) => {
  const { executeRequest, errors } = useRequest();

  const [secondsLeft, setSecondsLeft] = useState(getSecondsToDate(order.expiresAt));

  const onPurchase = async () => {
    // await executeRequest({
    //   method: 'post',
    //   url: '/api/orders',
    //   body: { ticketId: ticket.id },
    // });
  };

  useEffect(() => {
    if (secondsLeft < 0) return;
    const timer = setInterval(() => setSecondsLeft((left) => left - 1), 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  return (
    <div>
      <h1>{secondsLeft > 0 ? secondsLeft : 'Order Expired'}</h1>

      <button onClick={onPurchase} className="btn btn-primary">
        Purchase
      </button>

      {errors && (
        <div className="mt-4 alert alert-danger">
          <h3>Oops...</h3>

          <ul className="my-0">
            {errors.map((el) => (
              <li key={el.message}>{el.message}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<PageProps> = async (context) => {
  const { orderId } = context?.params as { orderId: string };
  const client = buildClient(context.req);
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { props: { order: data } };
};

export default OrderPage;

const getSecondsToDate = (expiresAt: string) => {
  const [endTime, currentTime] = [new Date(expiresAt).getTime(), new Date().getTime()];
  return Math.trunc((endTime - currentTime) / 1000);
};
