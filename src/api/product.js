import axiosInstance from "../utils/axiosInstance";

// LIST products (search + pagination)
export const fetchProducts = async ({ page = 1, limit = 10, q = "" } = {}) => {
  const res = await axiosInstance.get(`/api/products`, { params: { page, limit, q } });
  return res.data;
};

// DASHBOARD stats (last 7 days)
export const fetchProductStats = async () => {
  const res = await axiosInstance.get(`/api/products/stats`);
  return res.data;
};

// CREATE single product (multipart)
export const createProduct = async (formData) => {
  const res = await axiosInstance.post(`/api/products`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return res.data;
};

// ORDER a product (decrement qty)
export const orderProduct = async (productId, qty) => {
  const res = await axiosInstance.post(`/api/products/${productId}/order`, { qty });
  return res.data;
};

// BULK UPLOAD products (CSV)
export const bulkUploadProducts = async (formData) => {
  const res = await axiosInstance.post(`/api/products/bulk-upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return res.data;
};