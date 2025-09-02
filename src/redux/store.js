import { configureStore } from "@reduxjs/toolkit";
import userReducer from './Slices/userSlice'
import productReducer from './Slices/productSlice'
import invoiceReducer from './Slices/invoiceSlice'

const store = configureStore({
    reducer: {
        user: userReducer,
        products: productReducer,
        invoices: invoiceReducer
    }
})

export default store;