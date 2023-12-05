import { useMutation } from 'react-query';
import { apiService } from 'services';

export function useCreatePayment<T>() {
  const createPayment = (data: T) => apiService.post('/payments', data);

  interface CreatePaymentResponse {
    sessionUrl: string;
  }

  return useMutation<CreatePaymentResponse, unknown, T>(createPayment);
}
