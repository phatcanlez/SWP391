import axios from "axios";

const api = axios.create({
    baseURL: 'http://103.90.227.65:8080/api/'
});

//lam hanh dong truoc khi call api
const handleBefore = (config) => {
    const token = localStorage.getItem("token")?.replaceAll('"', "");
    config.headers["Authorization"] = `Bearer ${token}`;
    return config;
};

const handleError = (error) => {
    console.log(error);
};

api.interceptors.request.use(handleBefore, handleError);
export default api;