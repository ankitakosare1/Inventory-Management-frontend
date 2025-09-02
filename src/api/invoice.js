import axiosInstance from "../utils/axiosInstance";

export const fetchInvoices = async ({ page = 1, limit = 10, q = "" } = {}) => {
  const res = await axiosInstance.get(`/api/invoices`, {params: { page, limit, q }});
  return res.data;
};

export const fetchInvoiceStats = async () => {
  const res = await axiosInstance.get("/api/invoices/stats");
  return res.data;
};

export const markInvoicePaid = async (id) => {
  const res = await axiosInstance.post(`/api/invoices/${id}/paid`);
  return res.data;
};

export const deleteInvoice = async (id) => {
  const res = await axiosInstance.delete(`/api/invoices/${id}`);
  return res.data;
};

export const fetchInvoiceById = async (id) => {
  const res = await axiosInstance.get(`/api/invoices/${id}`);
  return res.data;
};

export const incrementInvoiceProcessed = async (id) => {
  const res = await axiosInstance.put(`/api/invoices/${id}/increment`);
  return res.data;
};
