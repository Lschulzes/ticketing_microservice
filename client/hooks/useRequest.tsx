import axios, { AxiosStatic } from 'axios';
import { useState } from 'react';

type ErrosResponse = Array<{ message: string; field?: string }>;

type Props = {
  url: string;
  method: keyof AxiosStatic;
};

export function useRequest<T>({ url, method }: Props) {
  const [errors, setErrors] = useState<ErrosResponse | null>(null);

  const executeRequest = async (body: any): Promise<T | { error: true }> => {
    try {
      axios.call(method, '/api/users/signup');
      const { data } = await (axios as any)[method](url, body);
      setErrors(null);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errors = (error.response?.data as { errors: ErrosResponse }).errors;
        setErrors(errors);
      }

      return { error: true };
    }
  };

  return { executeRequest, errors };
}

export default useRequest;
