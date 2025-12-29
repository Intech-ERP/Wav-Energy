import { useEffect, useState } from "react";
import server from "../Services/server";

export const useFetchCompanyId = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getCompanyIds = async () => {
    try {
      setLoading(true);
      const response = await server.get("/getCompanyId");
      console.log("data", response.data);
      setData(response.data);
    } catch (error) {
      setError(error?.response?.data?.message || "Failed to fetch CompanyIds");
      console.error("Error getting CompanyIds", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCompanyIds();
  }, []);

  return { data, loading, error };
};
