import React, { useRef, useState } from 'react';
import "./IndividualProductStyle.css";
import Sidebar from '../../../Components/Sidebar/Sidebar';
import { createProduct } from '../../../api/product';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import searchIcon from '../../../assets/SearchIcon.png'

const IndividualProduct = () => {
    const nav = useNavigate();
    const [preview, setPreview] = useState(null);
    const fileRef = useRef();

    const [form, setForm] = useState({
        name: "",
        productId: "",
        category: "",
        price: "",
        quantity: "",
        unit: "",
        expiryDate: "",
        threshold: ""
    });

    const update = (k, v) => setForm((s) => ({ ...s, [k]: v }));

    const onDiscard = () => {
        setForm({ name: "", productId: "", category: "", price: "", quantity: "", unit: "", expiryDate: "", threshold: "" });
        setPreview(null);
        if (fileRef.current) fileRef.current.value = "";
    };

    const onSubmit = async () => {
        // All Fields mandatory fields
        for (let [k, v] of Object.entries(form)) {
            if (!v || v.toString().trim() === "") {
                toast.error("All fields are required");
                return;
            }
        }

        // Check for negative numbers
        if (Number(form.price) < 0) {
            toast.error("Price cannot be negative");
            return;
        }
        if (Number(form.quantity) < 0) {
            toast.error("Quantity cannot be negative");
            return;
        }
        if (Number(form.threshold) < 0) {
            toast.error("Threshold value cannot be negative");
            return;
        }

        const fd = new FormData();

        Object.entries(form).forEach(([k, v]) => {
                fd.append(k, v);
        });

        if (fileRef.current?.files?.[0]) fd.append("image", fileRef.current.files[0]);

        try {
            await createProduct(fd);
            toast.success("Product added");
            nav("/product");
        } catch (err) {
            toast.error("Failed to add product");
        }
    };

    return (
        <div className='product-new-page'>
            <Sidebar />

            <div className='product-new-content'>
                <div className='product-new-header'>
                    <p className='product-heading'>Product</p>
                    <div className='search-wrap'>
                        <span className='search-icon'> <img src={searchIcon} alt='SearchIcon' /> </span>
                        <input className='search-input' placeholder='Search here...' disabled />
                    </div>
                </div>

                <div className='divider-from-sidebar' />

                {/* Breadcrumb-like title */}
                <div className='crumbs-row'>
                    <div className='crumbs'>
                        <span className='crumb-link' onClick={() => nav("/product")}>Add Product</span>
                        &nbsp;&gt;&nbsp;
                        <span className='dim'>Individual Product</span>
                    </div>
                    <div className='close-btn' onClick={() => nav("/product")}>
                        &times;
                    </div>
                </div>


                <div className='form-card-layout'>
                    <p className='new-product'>New Product</p>
                    <div className='form-card'>

                        {/* Image Uploader + Text Beside */}
                        <div className='image-upload-wrap'>
                            <div className='image-box' onClick={() => fileRef.current?.click()}>
                                {
                                    preview ? (<img src={preview} alt='preview' />) : null
                                }
                            </div>
                            <div className='image-text' onClick={() => fileRef.current?.click()}>
                                <span className='drag-text'>Drag image here</span>
                                <span className='or-text'>or</span>
                                <span className='browse-text'>Browse image</span>
                            </div>
                            <input ref={fileRef} type='file' accept='image/' style={{ display: "none" }} onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const url = URL.createObjectURL(file);
                                setPreview(url);
                            }} />
                        </div>

                        {/* Form Fields */}
                        <div className='form-fields'>
                            <label>
                                <span>Product Name</span>
                                <input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder='Enter product name' />
                            </label>

                            <label>
                                <span>Product ID</span>
                                <input value={form.productId} onChange={(e) => update("productId", e.target.value)} placeholder='Enter product ID' />
                            </label>

                            <label>
                                <span>Category</span>
                                <input value={form.category} onChange={(e) => update("category", e.target.value)} placeholder='Select product category' />
                            </label>

                            <label>
                                <span>Price</span>
                                <input type='number' value={form.price} onChange={(e) => update("price", e.target.value)} placeholder='Enter price' />
                            </label>

                            <label>
                                <span>Quantity</span>
                                <input type='number' value={form.quantity} onChange={(e) => update("quantity", e.target.value)} placeholder='Enter product quantity' />
                            </label>

                            <label>
                                <span>Unit</span>
                                <input value={form.unit} onChange={(e) => update("unit", e.target.value)} placeholder='Enter Product unit' />
                            </label>

                            <label>
                                <span>Expiry Date</span>
                                <input type='date' value={form.expiryDate} onChange={(e) => update("expiryDate", e.target.value)} placeholder='Enter expiry date' />
                            </label>

                            <label>
                                <span>Threshold Value</span>
                                <input type='number' value={form.threshold} onChange={(e) => update("threshold", e.target.value)} placeholder='Enter threshold value' />
                            </label>
                        </div>

                        <div className='actions-row'>
                            <button className='btn-discard' onClick={onDiscard}>Discard</button>
                            <button className='btn-add' onClick={onSubmit}>Add Product</button>
                        </div>

                    </div>


                </div>

            </div>

        </div>
    );
};

export default IndividualProduct
