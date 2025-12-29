import server from "./server";

export const addCustomerContact = async (payload) => {
  try {
    const res = await server.post("/contacts", payload);
    return res.data;
  } catch (error) {
    console.error("Error Adding contact", error);
  }
};

export const getContactsById = async (company_id) => {
  try {
    const res = await server.get(`/getContacts/${company_id}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching contacts", error);
  }
};

export const updateContact = async (contact_id, data) => {
  try {
    const res = await server.put(`/updateContact/${contact_id}`, data);
    return res.data;
  } catch (error) {
    console.error("Error Updating contact", error);
  }
};

export const deleteContact = async (contact_id) => {
  try {
    const res = await server.put(`/removeContact/${contact_id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting contact", error);
  }
};
