import { useState, useCallback } from "react";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
            ...headers,
          },
          body: body ? JSON.stringify(body) : null,
        });
        console.log(response);
        if (!response.ok) {
          const errorMessage = `HTTP Error: ${response.status} ${response.statusText}`;
          const error = new Error(errorMessage);
          error.status = response.status;
          console.log(error);
          throw error;
        }
        const contentType = response.headers.get("content-type");

        if (contentType) {
          const responseData = await response.json();
          setIsLoading(false);
          return responseData;
        } else {
          setIsLoading(false);
          return {};
        }
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    },
    []
  );

  return { isLoading, error, sendRequest, setError };
};
