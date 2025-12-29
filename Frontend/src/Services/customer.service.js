import server from "./server";

export const addCustomer = async (payload) => {
  try {
    const res = await server.post("/customers", payload);
    return res.data;
  } catch (error) {
    console.error("Error Adding customer", error);
  }
};
export const updateCustomer = async (customerId, payload) => {
  try {
    const res = await server.put(`/customers/${customerId}`, payload);
    return res.data;
  } catch (error) {
    console.error("Error updating customer", error);
  }
};

export const deleteCustomer = async (customerId) => {
  try {
    const res = await server.put(`/removeCustomer/${customerId}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting customer", error);
  }
};
