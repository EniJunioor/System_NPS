import { useState, useCallback } from 'react';

export interface ErrorState {
  message: string;
  code?: string;
  details?: any;
}

export const useError = () => {
  const [error, setError] = useState<ErrorState | null>(null);

  const setErrorMessage = useCallback((message: string, code?: string, details?: any) => {
    setError({ message, code, details });
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleError = useCallback((error: any) => {
    let message = 'Erro inesperado';
    let code: string | undefined;
    let details: any = undefined;

    if (error.response?.data?.error) {
      message = error.response.data.error;
      code = error.response.status?.toString();
      details = error.response.data;
    } else if (error.message) {
      message = error.message;
    } else if (typeof error === 'string') {
      message = error;
    }

    setError({ message, code, details });
  }, []);

  const withErrorHandling = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    customErrorMessage?: string
  ): Promise<T | null> => {
    try {
      clearError();
      const result = await asyncFn();
      return result;
    } catch (error: any) {
      if (customErrorMessage) {
        setErrorMessage(customErrorMessage);
      } else {
        handleError(error);
      }
      return null;
    }
  }, [clearError, handleError, setErrorMessage]);

  return {
    error,
    setErrorMessage,
    clearError,
    handleError,
    withErrorHandling,
  };
}; 