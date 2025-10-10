import axios from "axios";
let onPremiumExpired = null;

export const setPremiumExpiredHandler = (callback) => {
  onPremiumExpired = callback;
};
const api = axios.create({
 //baseURL: `https://api.latexwriter.com`,
 baseURL: `http://localhost:8080`,
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { data } = error.response;

      if (data.PremiumExpired && typeof onPremiumExpired === "function") {
        onPremiumExpired(); // call your redirect or handler
      }
    }
    return Promise.reject(error);
  }
);

export default api;
