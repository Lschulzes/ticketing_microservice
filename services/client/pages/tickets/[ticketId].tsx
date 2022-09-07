import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import buildClient from 'services/client/api/buildClient';
import useRequest from 'services/client/hooks/useRequest';
import { Ticket } from '..';

type PageProps = { ticket: Ticket };

const Ticket = ({ ticket }: PageProps) => {
  const { executeRequest, errors } = useRequest();
  const { push } = useRouter();

  const onPurchase = async () => {
    const { data, error } = await executeRequest<{ id: string }>({
      method: 'post',
      url: '/api/orders',
      body: { ticketId: ticket.id },
    });

    if (!error && data) {
      push(`/orders/${data.id}`);
    }
  };

  return (
    <div>
      <h1>{ticket.title}</h1>
      <h4>Price: {ticket.price}</h4>
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
  const { ticketId } = context?.params as { ticketId: string };
  const client = buildClient(context.req);
  const { data } = await client.get(`/api/tickets/${ticketId}`);

  return { props: { ticket: data } };
};

export default Ticket;
