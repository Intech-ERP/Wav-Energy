import server from "./server";

export const generateEnquiry = async (data) => {
  try {
    const response = await server.post("/enquiries", data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const updateEnquiry = async (id, data) => {
  try {
    const response = await server.put(`/updateEnquiry/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error Updating Lead", error);
  }
};

export const removeEnquiry = async (id) => {
  try {
    const response = await server.put(`/removeEnquiry/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error removing Lead");
  }
};
