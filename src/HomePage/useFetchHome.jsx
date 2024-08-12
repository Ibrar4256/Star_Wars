import { useState, useEffect, useCallback } from "react";

const useFetch = (initialUrl) => {
  const [url, setUrl] = useState(initialUrl);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      setData(result);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateUrl = (newUrl) => {
    setUrl(newUrl);
  };

  const goToNextPage = useCallback(() => {
    if (data?.next) {
      setUrl(data.next);
    }
  }, [data]);

  const goToPreviousPage = useCallback(() => {
    if (data?.previous) {
      setUrl(data.previous);
    }
  }, [data]);

  return { data, error, loading, goToNextPage, goToPreviousPage, updateUrl };
};

export default useFetch;
