import { createSlice } from "@reduxjs/toolkit";

const invoiceSlice = createSlice({
  name: "invoices",
  initialState: {
    items: [],
    page: 1,
    totalPages: 1,
    total: 0,
    q: "",
    limit: 10,
    stats: {},
    loading: false,
    error: null
  },

  reducers: {
    setInvoices: (s, a) => {
      s.items = a.payload.invoices;
      s.page = a.payload.page;
      s.totalPages = a.payload.totalPages;
      s.total = a.payload.total;
    },
    setInvoiceStats: (s, a) => { s.stats = a.payload; },
    setLoading: (s, a) => { s.loading = a.payload; },
    setError: (s, a) => { s.error = a.payload; },
    setSearch: (s, a) => { s.q = a.payload; },
  }
});

export const { setInvoices, setInvoiceStats, setLoading, setError, setSearch } = invoiceSlice.actions;
export default invoiceSlice.reducer;
