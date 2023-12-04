import { useMutation, useQuery } from 'react-query';
import { Product, UserProduct } from 'types';
import { apiService } from 'services';
import queryClient from 'query-client';

interface UserProductsListItem extends UserProduct {
  productData: Product;
}

export function useList<T>(params: T) {
  const list = () => apiService.get('/user-products', params);

  return useQuery<UserProductsListItem[]>(['user-cart', params], list);
}

export function useAddUserProduct<T>() {
  const addUserProduct = (data: T) => apiService.post('/user-products', data);

  return useMutation<UserProduct, unknown, T>(addUserProduct, {
    onSuccess: () => {
      queryClient.invalidateQueries(['user-cart']);
    },
  });
}

export function useUpdateUserProduct<T>() {
  const updateUserProduct = (id: string, data: T) => apiService.put(`/user-products/${id}`, data);

  return useMutation<UserProduct, unknown, { id: string; data: T }>(
    ({ id, data }) => updateUserProduct(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['user-cart']);
      },
    },
  );
}

export function useRemoveUserProduct() {
  const removeUserProduct = (id: string) => apiService.delete(`/user-products/${id}`);

  return useMutation<{}, unknown, { id: string }>(({ id }) => removeUserProduct(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(['user-cart']);
    },
  });
}

export function useBuyUserProducts() {
  const removeUserProduct = () => apiService.put('/user-products/buy-products');

  return useMutation(removeUserProduct, {
    onSuccess: () => {
      queryClient.invalidateQueries(['user-cart']);
    },
  });
}
