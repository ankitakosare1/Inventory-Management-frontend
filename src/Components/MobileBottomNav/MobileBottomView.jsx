import React from "react";
import { useNavigate } from "react-router-dom";

import homeIcon from "../../assets/HomeImage.png";
import productIcon from "../../assets/Product Icon.png";
import invoiceIcon from "../../assets/Invoice Icon.png";
import statisticIcon from "../../assets/Statistics Icon.png";

import "./MobileBottomNavStyle.css";

const MobileBottomNav = () => {
  const navigate = useNavigate();

  return (
    <div className="mobile-bottom-nav">
      <img src={homeIcon} alt="Home" onClick={() => navigate("/home")} />
      <img src={productIcon} alt="Product" onClick={() => navigate("/product")} />
      <img src={invoiceIcon} alt="Invoice" onClick={() => navigate("/invoice")} />
      <img src={statisticIcon} alt="Statistics" onClick={() => navigate("/statistics")} />
    </div>
  );
};

export default MobileBottomNav;
