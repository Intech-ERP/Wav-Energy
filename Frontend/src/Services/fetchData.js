import { useState } from "react";
import server from "./server";

export const fetchData = async (url) => {
  try {
    const res = await server.get(url);
    const data = res.data?.data;
    console.log("fetched datas", data);
    return data;
  } catch (error) {
    console.error("Error Fetching Data", error);
  }
};
