import { useState } from "react";
import server from "./server";
import { showError, showSuccess } from "./alert";

export const useGenerateExcel = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateExcel = async (payload) => {
    try {
      setLoading(true);
      const response = await server.post("/generateExcel", payload, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Lead_Enquiry_Report.xlsx";
      link.click();

      window.URL.revokeObjectURL(url);

      showSuccess("Report generated successfully.");
    } catch (err) {
      if (err.response && err.response.data) {
        try {
          const text = await err.response.data.text();
          const json = JSON.parse(text);
          showError(json.message || "Failed to generate report");
          //   setError(json.message || "Failed to generate report");
        } catch {
          setError("Unexpected error occurred");
        }
      } else {
        setError("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return { generateExcel, loading, error };
};
