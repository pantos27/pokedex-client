import { useMutation, useQuery } from '@tanstack/react-query';
import { createApiHeaders } from './apiUtils';

interface ApiOptions {
  headers?: HeadersInit;
  queryKey?: string[];
}

export const useApi = () => {
  const fetchData = async <T>(url: string, options?: ApiOptions): Promise<T> => {
    const headers = options?.headers || createApiHeaders();
    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return response.json();
  };

  const postData = async <T, D>(url: string, data: D, options?: ApiOptions): Promise<T> => {
    const headers = options?.headers || createApiHeaders();
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return response.json();
  };

  const useApiQuery = <T>(url: string, queryKey: string[], options?: ApiOptions) => {
    return useQuery<T>({
      queryKey,
      queryFn: () => fetchData<T>(url, options),
    });
  };

  const useApiMutation = <T, D>() => {
    return useMutation<T, Error, { url: string; data: D; options?: ApiOptions }>({
      mutationFn: ({ url, data, options }) => postData<T, D>(url, data, options),
    });
  };

  return {
    fetchData,
    postData,
    useApiQuery,
    useApiMutation,
  };
};
