import React, { useEffect, useState } from 'react'

import Sidebar from '../../Components/Sidebar/Sidebar'
import { getProfile, updateProfile, logout as apiLogout } from "../../api/userProfile";

import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../../redux/Slices/userSlice';
import { toast } from 'react-toastify';
import trashIcon from "../../assets/TrashIcon.png"

import './SettingPageStyle.css'
import MobileBottomNav from '../../Components/MobileBottomNav/MobileBottomView';

const SettingPage = () => {
    const [tab, setTab] = useState("edit"); // edit | account
    const [loading, setLoading] = useState(false);
    const [openAccountDropdown, setOpenAccountDropdown] = useState(null);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);

    //Local Form States
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    //Fetch Profile
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getProfile();
                if (data?.user) {
                    dispatch(setUser(data.user));
                    setFirstName(data.user.firstName || "");
                    setLastName(data.user.lastName || "");
                    setEmail(data.user.email || "");
                }
            } catch (err) {
                console.error("Error fetching profile:", err);
            }
        };
        fetchProfile();
    }, [dispatch]);

    useEffect(() => {
        const onDocClick = (e) => {
            if (!e.target.closest('.account-dropdown')) {
                setOpenAccountDropdown(null);
            }
        };
        document.addEventListener('click', onDocClick);
        return () => document.removeEventListener('click', onDocClick);
    }, []);

    const handleSave = async () => {
        if (!firstName.trim()) {
            toast.error("First name cannot be empty");
            return;
        }
        if (!lastName.trim()) {
            toast.error("Last name cannot be empty");
            return;
        }
        if (password && password.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }
        if (password && password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            const payload = {
                firstName,
                lastName,
                ...(password ? { password } : {})  // only send password if entered
            };

            const updated = await updateProfile(payload);

            if (updated?.user) {
                dispatch(setUser(updated.user));
                setPassword("");
                setConfirmPassword("");
                toast.success("Profile updated successfully!");
            }
        } catch (err) {
            console.error("Update failed:", err);
            toast.error("Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await apiLogout();
        navigate("/");
    }

    return (
        <div className='settings-page'>
            <Sidebar />
            <div className='settings-content'>
                <p className='settings-heading'>Setting</p>
                <div className='divider-from-sidebar' />
                <div className='setting-layout'>
                    <div className='tabs'>
                        <button className={`tab ${tab === 'edit' ? "active" : ""}`} onClick={() => setTab("edit")}>Edit Profile</button>
                        <button className={`tab ${tab === 'account' ? "active" : ""}`} onClick={() => setTab("account")}>Account management</button>
                    </div>

                    <div className='tab-body'>
                        {
                            tab === "edit" && (
                                <div className='edit-profile'>
                                    <div className='form-row'>
                                        <label>First Name</label>
                                        <input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                                    </div>

                                    <div className='form-row'>
                                        <label>Last Name</label>
                                        <input value={lastName} onChange={(e) => setLastName(e.target.value)} />
                                    </div>

                                    <div className='form-row'>
                                        <label>Email</label>
                                        <input value={email} readOnly className='disabled-input' />
                                    </div>

                                    <div className='form-row'>
                                        <label>Password</label>
                                        <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" />
                                    </div>

                                    <div className='form-row'>
                                        <label>Confirm Password</label>
                                        <input type='password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="At least 8 characters" />
                                    </div>

                                    <div className='save-row'>
                                        <button className='save-btn' onClick={handleSave} disabled={loading}>{loading ? "Saving..." : "Save"}</button>
                                    </div>
                                </div>
                            )
                        }

                        {
                            tab === "account" && (
                                <div className='account-management'>
                                    <div className='account-section'>
                                        <h3>Identity verification</h3>
                                        <p>Verified</p>
                                    </div>

                                    <div className='account-section'>
                                        <h3>Add Account</h3>

                                        {/* Account 1 (index 0) */}
                                        <div className='account-item'>
                                            <input type='radio' disabled name='account' />
                                            <span className='account-email'>Account01_@gmail.com</span>

                                            {/* NEW: dropdown trigger + popup */}
                                            <div className='account-dropdown'>
                                                <button
                                                    type='button'
                                                    className='caret-btn'
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setOpenAccountDropdown(openAccountDropdown === 0 ? null : 0);
                                                    }}
                                                    aria-label='Toggle account actions'
                                                >
                                                    {openAccountDropdown === 0 ? '˄' : '˅'}
                                                </button>

                                                {openAccountDropdown === 0 && (
                                                    <div className='dropdown-card'>
                                                        <button type='button' className='dropdown-item'>
                                                            <img src={trashIcon} alt='delete' className='trash-icon' />
                                                            <span className='delete-text'>Delete</span>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Account 2 (index 1) */}
                                        <div className='account-item'>
                                            <input type='radio' disabled name='account' />
                                            <span className='account-email'>Account02_@gmail.com</span>

                                            {/* NEW: dropdown trigger + popup */}
                                            <div className='account-dropdown'>
                                                <button
                                                    type='button'
                                                    className='caret-btn'
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setOpenAccountDropdown(openAccountDropdown === 1 ? null : 1);
                                                    }}
                                                    aria-label='Toggle account actions'
                                                >
                                                    {openAccountDropdown === 1 ? '˄' : '˅'}
                                                </button>

                                                {openAccountDropdown === 1 && (
                                                    <div className='dropdown-card'>
                                                        <button type='button' className='dropdown-item'>
                                                            <img src={trashIcon} alt='delete' className='trash-icon' />
                                                            <span className='delete-text'>Delete</span>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                        </div>
                                    </div>

                                    <div className='save-row'>
                                        <button className='logout-btn' onClick={handleLogout}>Log Out</button>
                                    </div>
                                </div>
                            )
                        }

                    </div>
                </div>
            </div>

            <div className="settings-mobile-nav">
                <MobileBottomNav />
            </div>

        </div>
    )
}

export default SettingPage
