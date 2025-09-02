import React from "react";
import { useNavigate } from "react-router-dom";

import loginPie from "../../assets/Login-Pie.png";
import settingIcon from "../../assets/Setting Icon.png";

import "./MobileTopBarStyle.css";

const MobileTopBar = () => {
  const navigate = useNavigate();

  return (
    <div className="mobile-topbar">
      <img
        src={loginPie}
        alt="Login Pie"
        className="topbar-logo"
      />
      <img
        src={settingIcon}
        alt="Settings"
        className="topbar-setting"
        onClick={() => navigate("/setting")}
      />
    </div>
  );
};

export default MobileTopBar;
