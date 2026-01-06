import { useEffect, useState, useCallback } from "react";
import { fetchData } from "../Services/fetchData";
import { getToken } from "../utils/token";

export const useFetchData = (url) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getFetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetchData(url);

      const sortedData = response.sort(
        (a, b) => new Date(b.created_date) - new Date(a.created_date)
      );

      setData(sortedData);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to fetch data");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    getFetchData();
  }, [getFetchData]);

  return {
    data,
    setData,
    loading,
    error,
    refetch: getFetchData,
  };
};
