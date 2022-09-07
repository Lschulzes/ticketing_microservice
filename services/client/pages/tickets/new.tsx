import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import useRequest from 'services/client/hooks/useRequest';

type FormInputs = {
  title: string;
  price: string;
};

type SignupResponse = {
  id: string;
};

const NewTicket = () => {
  const { push } = useRouter();
  const { register, handleSubmit, watch, setValue } = useForm<FormInputs>();
  const { executeRequest, errors } = useRequest();

  const onSubmit = async (formData: FormInputs) => {
    const { error } = await executeRequest<SignupResponse>({
      url: '/api/tickets',
      method: 'post',
      body: formData,
    });

    if (!error) {
      push('/');
    }
  };

  const onBlurPrice = () => {
    const { price } = watch();
    const value = parseFloat(price);
    if (isNaN(value)) return setValue('price', (0).toFixed(2));

    setValue('price', value.toFixed(2));
  };

  return (
    <div>
      <h1>Create a Ticket</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label>Title</label>
          <input {...register('title', { required: true })} className="form-control" />
        </div>

        <div className="form-group my-2">
          <label>Price</label>
          <input {...register('price', { required: true, onBlur: onBlurPrice })} className="form-control" />
        </div>

        <button type="submit" className="btn btn-primary mt-2">
          Submit
        </button>
      </form>

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

export default NewTicket;
