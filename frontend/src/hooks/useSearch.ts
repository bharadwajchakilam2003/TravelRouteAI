import { useState, useCallback } from 'react';
import { searchAPI, SearchParams } from '../services/api';

interface SearchState {
  loading: boolean;
  error: string | null;
  results: any;
}

export function useSearch() {
  const [state, setState] = useState<SearchState>({
    loading: false,
    error: null,
    results: null,
  });

  const search = useCallback(async (params: SearchParams) => {
    setState({ loading: true, error: null, results: null });
    try {
      const results = await searchAPI.search(params);
      setState({ loading: false, error: null, results });
      return results;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Search failed. Please try again.';
      setState({ loading: false, error: message, results: null });
      throw error;
    }
  }, []);

  const clearResults = useCallback(() => {
    setState({ loading: false, error: null, results: null });
  }, []);

  return { ...state, search, clearResults };
}
