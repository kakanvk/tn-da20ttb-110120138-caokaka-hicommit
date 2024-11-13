import axios from "axios";

const axiosInstance = axios.create({
    withCredentials: true,
    baseURL: (import.meta as any).env.VITE_HICOMMIT_API_HOST
});

export { axiosInstance }