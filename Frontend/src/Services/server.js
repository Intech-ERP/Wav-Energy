import axios from "axios";

const server = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// server.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (!error.response) {
//       return Promise.reject({
//         type: "SERVER_DOWEN",
//         message: "Unable to connect to server. Please try again later",
//       });
//     } else if (error.response?.data?.success === false) {
//       showError(error.response.data.message);
//     }
//     // return Promise.reject({
//     //   type: "API_ERROR",
//     //   message: error.response.data?.message || "Something went wrong",
//     //   status: error.response.status,
//     // });
//   }
// );

// server.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (!error.response) {
//       // ✅ Network error - show and reject
//       showError("Unable to connect to server. Please try again later");
//       return Promise.reject(error);
//     }

//     if (error.response?.data?.success === false) {
//       // ✅ Backend business error (409, 400, etc.)
//       showError(error.response.data.message);
//       return Promise.reject(error);
//     }

//     // ✅ Other HTTP errors (500, etc.)
//     showError(
//       error.response.data?.message || `Server error: ${error.response.status}`
//     );
//     return Promise.reject(error);
//   }
// );

export default server;
