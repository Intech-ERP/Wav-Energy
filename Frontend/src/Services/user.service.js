import { showError, showSuccess } from "./alert";
import server from "./server";

export const addUser = async (user) => {
  try {
    const response = await server.post("/user", user);
    return response.data;
  } catch (error) {
    showError(error?.response?.data?.message || "User Adding Failed");
    console.error("Error Adding User", error);
  }
};

export const updateUser = async (id, user) => {
  try {
    const response = await server.put(`/updateUser/${id}`, user);
    return response.data;
  } catch (error) {
    console.error("Error Updating User", error);
  }
};

export const removeUser = async (id) => {
  try {
    const response = await server.put(`/removeUser/${id}`);
    console.log("remove Response", response);
    if (response.data) {
      showSuccess(response.data.message || "User Removed Successfully!");
    }
    return response.data;
  } catch (error) {
    showError(error?.response?.data?.message || "User Removing Failed");
    console.error("Error Removing User", error);
  }
};
