import { set } from "react-hook-form";
import server from "./server";
import { setToken } from "../utils/token";

export const login = async (credentials) => {
  const response = await server.post("/login", credentials);

  const { accessToken, user } = response.data;

  setToken(accessToken);

  return user;
};
