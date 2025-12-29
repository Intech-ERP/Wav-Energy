import server from "./server";

export const LeadGenerate = async (data) => {
  try {
    const response = await server.post("/leads", data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const updateLead = async (id, data) => {
  try {
    const response = await server.put(`/updateLead/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error Updating Lead", error);
  }
};

export const removeLeads = async (id) => {
  try {
    const response = await server.put(`/removeLead/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error removing Lead");
  }
};
