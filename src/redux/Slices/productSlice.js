import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: [],
    page: 1,
    totalPages: 1,
    total: 0,
    q: "",
    limit: 10,
    stats: null,
    loading: false,
    error: null,
};

const productSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        setSearch: (state, action) => {
            state.q = action.payload;
        },
        setProducts: (state, action) => {
            state.items = action.payload.products;
            state.page = action.payload.page;
            state.totalPages = action.payload.totalPages;
            state.total = action.payload.total;
        },
        setStats: (state, action) => {
            state.stats = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const { 
    setSearch,
    setProducts,
    setStats,
    setLoading,
    setError
} = productSlice.actions;
export default productSlice.reducer;