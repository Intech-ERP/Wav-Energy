import { showError } from "./alert";
import server from "./server";

export const addLeadMaster = async (tabValue, data) => {
  try {
    const res = await server.post(`/${tabValue}`, data);
    return res.data;
  } catch (error) {
    console.error("Error Saving Master data", data);
  }
};

export const updateMasterSortOrder = async (id, data, tabValue) => {
  try {
    const res = await server.put(`/update${tabValue}disp_order/${id}`, {
      data: data,
    });
    return res.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    throw error;
  }
};

export const updateLeadMaster = async (data, tabValue) => {
  console.log("tabValue", tabValue);
  try {
    const res = await server.post(`update${tabValue}`, data);
    return res.data;
  } catch (error) {
    showError(error.response.data);
    console.error(`Error Update ${tabValue}`);
  }
};

export const removeMasterData = async (id, tabValue) => {
  try {
    const res = await server.put(`remove${tabValue}/${id}`);
    return res.data;
  } catch (error) {
    showError(error.response.data);
    console.error(`Error Remove ${tabValue}`);
  } 
};
