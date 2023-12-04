import { useMutation, useQuery } from 'react-query';
import { Product } from 'types';
import { apiService } from 'services';
import queryClient from 'query-client';

export function useList<T>(params: T) {
  const list = () => apiService.get('/products', params);

  interface ProductListResponse {
    count: number;
    items: Product[];
    totalPages: number;
  }

  return useQuery<ProductListResponse>(['products', params], list);
}

export function useCreateProduct<T>() {
  const createProduct = (data: T) => apiService.post('/products', data);

  return useMutation<Product, unknown, T>(createProduct, {
    onSuccess: (data) => {
      queryClient.setQueryData(['products'], data);
      queryClient.invalidateQueries(['user-products']);
    },
  });
}

export function useRemoveProduct() {
  const removeUserProduct = (id: string) => apiService.delete(`/products/${id}`);

  return useMutation<{}, unknown, { id: string }>(({ id }) => removeUserProduct(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(['user-products']);
      queryClient.invalidateQueries(['products']);
    },
  });
}
