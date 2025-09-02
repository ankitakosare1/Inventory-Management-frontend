import axiosInstance from "../utils/axiosInstance";

export const getProfile = async () => {
    const response = await axiosInstance.get("/api/user/profile");
    return response.data;
}

export const updateProfile = async (payload) => {
    //payload : {firstName, lastName, password}
    const response = await axiosInstance.put("/api/user/profile", payload);
    return response.data;
}

export const logout = async () => {
    localStorage.removeItem("token");
}