import server from "./server";

export const addEnquiry = async (payload) => {
  try {
    const res = await server.post("/enquiries", payload);
    return res.data;
  } catch (error) {
    console.error("Error Adding enquiry", error);
  }
};

export const updateEnquiry = async (id, payload) => {
  console.log("updateEnquiry payload", id, payload);
  try {
    const res = await server.put(`/enquiries/${id}`, payload);
    return res.data;
  } catch (error) {
    console.error("Error Updating enquiry", error);
  }
};

export const convertToLead = async (id) => {
  try {
    const res = await server.put(`/convertLead/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error Convert to Lead", error);
  }
};

export const convertedEnquiry = async () => {
  try {
    const res = await server.get("/convertedEnquiry");
    return res.data;
  } catch (error) {
    console.error("Error Getting Converted Enquiries", error);
  }
};
