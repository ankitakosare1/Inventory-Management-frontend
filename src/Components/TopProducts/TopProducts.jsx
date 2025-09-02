import React, { useEffect, useState } from "react";
import { fetchTopProducts } from "../../api/dashboard";

import horizontalBar from '../../assets/HorizontalBar.png'

import './TopProductsStyle.css'

const TopProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await fetchTopProducts();
        setProducts(data.slice(0, 3));
      } catch (err) {
        console.error("Failed to fetch top products:", err);
      }
    };
    getProducts();
  }, []);

  return (
    <div className="top-products-card">
      <h3>Top Products</h3>
      <ul>
        {products.map((p) => (
          <li key={p.id} className="product-item">
            <span className="product-name">{p.name}</span>
            <div className="product-images">
              <img src={p.image || ""} className="product-image" />
              <img src={horizontalBar} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopProducts;

