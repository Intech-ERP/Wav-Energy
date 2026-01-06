import server from "./server";

export const addLeads = async (payload) => {
  try {
    const res = await server.post("/leads", payload);
    return res.data;
  } catch (error) {
    console.error("Error Adding enquiry", error);
  }
};

export const updateLead = async (id, payload) => {
  console.log("updateLead payload", id, payload);
  try {
    const res = await server.put(`/leads/${id}`, payload);
    return res.data;
  } catch (error) {
    console.error("Error Updating enquiry", error);
  }
};

export const convertToEnquiry = async (id) => {
  try {
    const res = await server.put(`/convertEnquiry/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error Convert to Lead", error);
  }
};

export const convertedLeads = async () => {
  try {
    const res = await server.get("/convertedLead");
    return res.data;
  } catch (error) {
    console.error("Error Getting Converted Leads", error);
  }
};

export const removeConvertedLead = async (id) => {
  try {
    const res = await server.put(`/removeConvertedLead/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error Getting Removing Enquiry", error);
  }
};
