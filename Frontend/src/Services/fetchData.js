import { useState } from "react";
import server from "./server";
import { getToken } from "../utils/token";

export const fetchData = async (url) => {
  try {
    const token = getToken();
    const res = await server.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = res.data?.data;
    console.log("fetched datas", data);
    return data;
  } catch (error) {
    console.error("Error Fetching Data", error);
  }
};
