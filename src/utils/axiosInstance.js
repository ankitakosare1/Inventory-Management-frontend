import axios from "axios"

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL || "http://localhost:4000",
    headers: {
        "Content-Type": "application/json",
    },
});

//Attach token from localStorage for authenticated calls
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token"); 
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})

export default axiosInstance;