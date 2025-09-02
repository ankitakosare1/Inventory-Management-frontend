import axiosInstance from "../utils/axiosInstance";

// Home data
export const fetchDashboardHome = async () => {
  const res = await axiosInstance.get("/api/dashboard/home");
  return res.data;
};

// Statistics
export const fetchDashboardStatistics = async () => {
  const res = await axiosInstance.get("/api/dashboard/statistics");
  return res.data;
};

// Chart data
export const fetchChartData = async (type = "weekly") => {
  const res = await axiosInstance.get(`/api/dashboard/chart?type=${type}`);
  return res.data;
};

// Top products
export const fetchTopProducts = async () => {
  const res = await axiosInstance.get("/api/dashboard/top-products");
  return res.data;
};


