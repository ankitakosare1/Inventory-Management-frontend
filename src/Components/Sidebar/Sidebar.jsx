import React, {useEffect} from 'react';
import "./SidebarStyle.css";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';

import { setUser } from '../../redux/Slices/userSlice';
import { getProfile } from '../../api/userProfile';

import loginPie from "../../assets/Login-Pie.png"
import homeImage from "../../assets/HomeImage.png"
import productIcon from "../../assets/Product Icon.png"
import invoiceIcon from "../../assets/Invoice Icon.png"
import statisticsIcon from "../../assets/Statistics Icon.png"
import settingIcon from "../../assets/Setting Icon.png"

const Sidebar = () => {
    const user = useSelector((state) => state.user.user);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchUser = async () => {
            if (!user) {
                try {
                    const data = await getProfile();
                    if (data?.user) {
                        dispatch(setUser(data.user));
                    }
                } catch (err) {
                    console.error("Sidebar: failed to fetch user", err);
                }
            }
        };
        fetchUser();
    }, [user, dispatch]);

    return (
        <aside className='app-sidebar'>
            <div>
                <div className='sidebar-top'>
                    <div className='logo-circle'>
                        <img src={loginPie} alt='Login Pie' />
                    </div>
                    <div className='separator-line'></div>
                </div>

                <nav className='sidebar-nav'>
                    <NavLink to="/home" className={({ isActive }) => "nav-item " + (isActive ? "active" : "")}>
                        <img src={homeImage} alt='Home' />
                        <span>Home</span>
                    </NavLink>
                    <NavLink to="/product" className={({ isActive }) => "nav-item " + (isActive ? "active" : "")}>
                        <img src={productIcon} alt='Product' />
                        <span>Product</span>
                    </NavLink>
                    <NavLink to="/invoice" className={({ isActive }) => "nav-item " + (isActive ? "active" : "")}>
                        <img src={invoiceIcon} alt='Invoice' />
                        <span>Invoice</span>
                    </NavLink>
                    <NavLink to="/statistics" className={({ isActive }) => "nav-item " + (isActive ? "active" : "")}>
                        <img src={statisticsIcon} alt='Statistics' />
                        <span>Statistics</span>
                    </NavLink>
                    <NavLink to="/setting" className={({ isActive }) => "nav-item " + (isActive ? "active" : "")}>
                        <img src={settingIcon} alt='Setting' />
                        <span>Setting</span>
                    </NavLink>
                </nav>
            </div>



            <div className='sidebar-footer'>
                <div className='separator-line-footer'></div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div className='profile-dot' />
                    <div className='profile-name'>{user?.firstName || ""}</div>
                </div>
            </div>
        </aside>

    )
}

export default Sidebar
