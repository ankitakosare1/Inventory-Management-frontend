import React, { useState } from 'react'

import '../../Modals/ModalStyle.css'
import './OrderModalStyle.css'

import { orderProduct } from '../../../api/product'
import { toast } from 'react-toastify'

const OrderModal = ({ product, onClose, onOrdered }) => {
    const [qty, setQty] = useState(1);

    const submit = async () => {
        if (qty <= 0) { 
            toast.error("Can't place order for 0 product");
            return;
        }

        try {
            await orderProduct(product._id, qty);
            toast.success("Order Placed");
            onClose();
            onOrdered?.();
        } catch (err) {
            toast.error("Failed to order");
        }
    };

    return (
        <div className='modal-overlay' onClick={onClose}>
            <div className='modal-card' onClick={(e) => e.stopPropagation()}>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>Order: {product.name}</div>
                <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    Enter Quantity:
                    <input
                        type='number'
                        min={product.quantity === 0 ? 0 : 1}
                        max={product.quantity}
                        value={qty}
                        disabled={product.quantity === 0}
                        onChange={(e) => {
                            const val = e.target.value;
                            setQty(val === "" ? "" : parseInt(val, 10));
                        }}
                        className="modal-input"
                    />
                </label>

                <div className="modal-alignment">
                    <button className='btn-cancel' onClick={onClose}>Cancel</button>
                    <button
                        className='btn-order'
                        onClick={() => {
                            if (product.quantity === 0) {
                                toast.error("Can't order, product out of stock");
                                return;
                            }
                            submit();
                        }}
                    >
                        Order
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderModal
