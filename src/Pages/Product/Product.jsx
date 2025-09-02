import React, { useEffect, useMemo, useState } from 'react';
import './ProductStyle.css'
import AddProductModal from '../../Components/Modals/AddProductModal/AddProductModal'
import OrderModal from '../../Components/Modals/OrderModal/OrderModal'

import Sidebar from '../../Components/Sidebar/Sidebar'
import searchIcon from '../../assets/SearchIcon.png'
import { formatDate } from '../../utils/date';

import { useDispatch, useSelector } from 'react-redux';
import { setSearch, setProducts, setStats, setLoading, setError } from '../../redux/Slices/productSlice';
import { fetchProducts, fetchProductStats, createProduct, orderProduct } from '../../api/product';

import MobileTopBar from '../../Components/MobileTopBar/MobileTopBar'
import MobileBottomNav from '../../Components/MobileBottomNav/MobileBottomView'
import ProductDetailsModal from '../../Components/ProductDetailsModal/ProductDetailsModal'

const Product = () => {
    const dispatch = useDispatch();
    const { items, page, totalPages, q, limit, stats, loading } = useSelector((s) => s.products);
    const [showAdd, setShowAdd] = useState(false);
    const [activeOrder, setActiveOrder] = useState(null);
    const [productDetails, setProductDetails] = useState(null);

    const loadStats = async () => {
        try {
            const data = await fetchProductStats();
            dispatch(setStats(data));
        } catch (err) {
            dispatch(setError("Failed to load stats"));
            console.log("Failed to load Stats");
        }
    }

    const loadProducts = async (params) => {
        dispatch(setLoading(true));
        try {
            const data = await fetchProducts(params);
            dispatch(setProducts(data));
        } catch (err) {
            dispatch(setError("Failed to load Products"));
            console.log("Failed to load Products");
        } finally {
            dispatch(setLoading(false));
        }
    };

    useEffect(() => {
        loadStats();
    }, []);

    useEffect(() => {
        loadProducts({ page, limit, q });
    }, [page, limit, q]);

    //Page controls
    const prevDisabled = useMemo(() => page <= 1, [page]);
    const nextDisabled = useMemo(() => page >= totalPages, [page, totalPages]);

    return (
        <div className='product-page'>
            <Sidebar />

            <div className="mobile-only">
                <MobileTopBar />
            </div>

            <div className='product-content'>
                {/* Heading + Search */}
                <div className='product-header'>
                    <p className='product-heading'>Product</p>

                    <div className='search-wrap'>
                        <span className='search-icon'> <img src={searchIcon} alt='SearchIcon' /> </span>
                        <input className='search-input'
                            placeholder='Search here...'
                            value={q}
                            onChange={(e) => dispatch(setSearch(e.target.value))} />
                    </div>
                </div>

                <div className='divider-from-sidebar' />

                {/* Inventory Card */}
                <div className='overall-card'>
                    <p className='card-heading'>Overall Inventory</p>
                    <div className='card-row'>

                        <div className='metric'>
                            <div className='metric-title'>Categories</div>
                            <div className='metric-value'>
                                {stats?.categoriesAvgLast7Days ?? 0}
                            </div>
                            <div className='metric-sub'>
                                Last 7 days
                            </div>
                        </div>

                        <div className='v-sep' />

                        <div className='metric'>
                            <div className='metric-title'>Total Products</div>
                            <div className='metric-flex'>
                                <div>
                                    <div className='metric-value'>
                                        {stats?.totalProductsLast7Days ?? 0}
                                    </div>
                                    <div className='metric-sub'>
                                        Last 7 days
                                    </div>
                                </div>

                                <div>
                                    <div className='metric-value'>
                                        ₹{(stats?.revenueLast7Days ?? 0).toLocaleString()}
                                    </div>
                                    <div className='metric-sub'>
                                        Revenue
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='v-sep' />

                        <div className='metric'>
                            <div className='metric-title'>Top Selling</div>
                            <div className='metric-flex'>
                                <div>
                                    <div className='metric-value'>
                                        {stats?.topSelling?.count ?? 5}
                                    </div>
                                    <div className='metric-sub'>
                                        Last 7 days
                                    </div>
                                </div>

                                <div>
                                    <div className='metric-value'>
                                        ₹{(stats?.topSelling?.cost ?? 0).toLocaleString()}
                                    </div>
                                    <div className='metric-sub'>
                                        Cost
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='v-sep' />

                        <div className='metric'>
                            <div className='metric-title'>Low Stocks</div>
                            <div className='metric-flex'>
                                <div>
                                    <div className='metric-value'>
                                        {stats?.lowStocks?.ordered ?? 0}
                                    </div>
                                    <div className='metric-sub'>
                                        Ordered
                                    </div>
                                </div>

                                <div>
                                    <div className='metric-value'>
                                        {stats?.lowStocks?.notInStock ?? 0}
                                    </div>
                                    <div className='metric-sub'>
                                        Not in stock
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Product Table */}
                <div className='table-card'>
                    <div className='table-head-row'>
                        <div className='table-title'>Products</div>
                        <button className='add-btn' onClick={() => setShowAdd(true)}>Add Product</button>
                    </div>

                    <div className='table-scroll'>
                        <table className='product-table'>
                            <thead>
                                <tr>
                                    <th>Products</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Threshold Value</th>
                                    <th>Expiry Date</th>
                                    <th>Availability</th>
                                </tr>
                            </thead>

                            <tbody>
                                {
                                    items.map((p) => (
                                        <tr key={p._id}>
                                            <td>
                                                <button
                                                    className='link-like'
                                                    onClick={() => setActiveOrder(p)}>
                                                    {p.name}
                                                </button>
                                            </td>

                                            <td>
                                                ₹{p.price}
                                            </td>

                                            <td>
                                                {p.quantity} {p.unit}
                                            </td>

                                            <td>
                                                {p.threshold} {p.unit}
                                            </td>

                                            <td>
                                                {formatDate(p.expiryDate)}
                                            </td>

                                            <td>
                                                <span className={`availability ${p.status}`}>
                                                    {p.status === "in_stock" && "In - stock"}
                                                    {p.status === "low_stock" && "Low - stock"}
                                                    {p.status === "out_of_stock" && "Out of stock"}
                                                    {p.status === "expired" && "Expired"}
                                                </span>
                                                <span
                                                    className="info-icon"
                                                    onClick={() => setProductDetails(p)}
                                                >
                                                    i
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                }
                                {
                                    !loading && items.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="empty-cell">
                                                No Products found
                                            </td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className='pager-row'>
                        <button
                            className='pager-btn'
                            disabled={prevDisabled}
                            onClick={() => loadProducts({ page: page - 1, limit, q })}
                        >
                            Previous
                        </button>

                        <div className='pager-info'>
                            Page {page} of {totalPages}
                        </div>

                        <button
                            className='pager-btn'
                            disabled={nextDisabled}
                            onClick={() => loadProducts({ page: page + 1, limit, q })}
                        >
                            Next
                        </button>
                    </div>

                </div>
            </div>

            {/* Mobile BottomNav */}
            <div className="mobile-only">
                <MobileBottomNav />
            </div>

            {
                showAdd && <AddProductModal onClose={() => setShowAdd(false)} />
            }

            {
                activeOrder && (
                    <OrderModal
                        product={activeOrder}
                        onClose={() => setActiveOrder(null)}
                        onOrdered={async () => {
                            await loadProducts({ page, limit, q });
                            await loadStats();
                        }}
                    />
                )
            }

            {/* Product Details Modal */}
            {productDetails && (
                <ProductDetailsModal
                    product={productDetails}
                    onClose={() => setProductDetails(null)}
                />
            )}
        </div>
    );
};

export default Product;
