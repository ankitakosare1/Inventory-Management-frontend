import React from "react";
import "./ProductDetailsModal.css";
import { formatDate } from "../../utils/date";

const ProductDetailsModal = ({ product, onClose }) => {
  if (!product) return null;

  return (
    <div className="product-details-modal mobile-only">
      <div className="modal-overlay" onClick={onClose}></div>

      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>

        <h3 className="modal-title">Product Details</h3>

        <div className="detail-row">
          <span className="detail-label">Name</span>
          <span className="detail-value">{product.name}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Price</span>
          <span className="detail-value">₹{product.price}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Quantity</span>
          <span className="detail-value">
            {product.quantity} {product.unit}
          </span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Threshold Value</span>
          <span className="detail-value">
            {product.threshold} {product.unit}
          </span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Expiry Date</span>
          <span className="detail-value">{formatDate(product.expiryDate)}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;
