import { useForm } from 'react-hook-form';
import useRequest from '../../hooks/useRequest';

type FormInputs = {
  email: string;
  password: string;
};

const SignupPage = () => {
  const { register, handleSubmit } = useForm<FormInputs>();
  const { executeRequest, errors } = useRequest({ url: '/api/users/signup', method: 'post' });

  const onSubmit = async (formData: FormInputs) => {
    const data = await executeRequest(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="container py-4">
      <h1>Create an Account</h1>

      <div className="form-group">
        <label htmlFor="email-password">Email Address</label>
        <input id="email-password" {...register('email', { required: true })} type="text" className="form-control" />
      </div>

      <div className="form-group my-3">
        <label htmlFor="form-password">Password</label>
        <input
          id="form-password"
          {...register('password', { required: true })}
          type="password"
          className="form-control"
        />
      </div>

      {errors && (
        <div className="alert alert-danger">
          <h3>Oops...</h3>

          <ul className="my-0">
            {errors.map((el) => (
              <li key={el.field}>{el.message}</li>
            ))}
          </ul>
        </div>
      )}

      <button type="submit" className="btn btn-primary">
        Sign Up
      </button>
    </form>
  );
};

export default SignupPage;
