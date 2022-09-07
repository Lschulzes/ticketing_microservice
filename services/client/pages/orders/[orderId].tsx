import { OrderStatus } from 'common';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import StripeCheckout, { Token } from 'react-stripe-checkout';
import buildClient from 'services/client/api/buildClient';
import useRequest from 'services/client/hooks/useRequest';
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

type PageProps = { order: Order };

const OrderPage = ({ order, user }: PageProps & { user: BaseUser }) => {
  const { executeRequest, errors } = useRequest();
  const { reload } = useRouter();

  const [secondsLeft, setSecondsLeft] = useState(getSecondsToDate(order.expiresAt));

  const onPurchase = async (token: Token) => {
    const { error } = await executeRequest({
      method: 'post',
      url: '/api/payments',
      body: { token: token.id, orderId: order.id },
    });
    if (!error) {
      reload();
    }
  };
  useEffect(() => {
    if (secondsLeft < 0) return;
    const timer = setInterval(() => setSecondsLeft((left) => left - 1), 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  return (
    <div>
      {order.status === OrderStatus.Completed ? (
        <>
          <h1>Tickets Successfully Bought!</h1>
        </>
      ) : (
        <>
          <h1>Time left to pay: {secondsLeft > 0 ? secondsLeft : 'Order Expired'}</h1>
          <StripeCheckout
            stripeKey={process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || ''}
            token={onPurchase}
            amount={order.ticket.price * 100}
            email={user.email}
          />
        </>
      )}

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
