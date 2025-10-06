import { useState, useEffect, useCallback } from 'react';
import api from '@/api/axiosConfig';

export const useFetch = (url, dependencies = []) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!url) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const response = await api.get(url);
      setData(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, ...dependencies]); // Include dependencies in the dependency array

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
};
