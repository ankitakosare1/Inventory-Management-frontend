import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { signupUser } from '../../api/auth';

import { eyeToggleIcon } from '../../utils/eyeToggleIcon';
import '../../Styles/Login&SignupStyle.css'
import './SignupStyle.css'

import loginPie from "../../assets/Login-Pie.png"
import loginGroupImage from "../../assets/Login-Group-Image.png"

const Signup = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        const { name, email, password, confirmPassword } = formData;

        if (!name || !email || !password || !confirmPassword) {
            toast.error("All fields are required");
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email address");
            return false;
        }

        if (password.length < 8) {
            toast.error("Password must be at least 8 characters long");
            return false;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm() || loading) return;

        setLoading(true);
        try {
            await signupUser(formData);
            toast.success("Signup successful");
            setTimeout(() => navigate("/"), 1500);
        } catch (err) {
            toast.error(err.response?.data?.error || "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='container'>
            {/* Left Form Section */}
            <div className='left-side signup-left'>
                <div className='signup-box login-box'>
                    <h2>Create an account</h2>
                    <p className='subtitle'>Start inventory management</p>

                    <form onSubmit={handleSubmit}>
                        {/* Name */}
                        <label>Name</label>
                        <input type='text' name='name' placeholder='Name' value={formData.name} onChange={handleChange} required />

                        {/* Email */}
                        <label>Email</label>
                        <input type='email' name='email' placeholder='Example@email.com' value={formData.email} onChange={handleChange} required />

                        {/* Password */}
                        <label>Create Password</label>
                        <div className='password-wrapper'>
                            <input type={showPassword ? "text" : "password"}
                                name='password'
                                placeholder='at least 8 characters'
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <span className='eye-icon' onClick={() => setShowPassword(!showPassword)}>
                                {eyeToggleIcon(showPassword)}
                            </span>
                        </div>

                        {/* Confirm Password */}
                        <label>Confirm Password</label>
                        <div className='password-wrapper'>
                            <input type={showConfirmPassword ? "text" : "password"}
                                name='confirmPassword'
                                placeholder='at least 8 characters'
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                            <span className='eye-icon' onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                {eyeToggleIcon(showConfirmPassword)}
                            </span>
                        </div>

                        <button type='submit' disabled={loading}>
                            {loading ? <span className="spinner"></span> : "Sign up"}
                        </button>
                    </form>

                    <p className='signup-text'>
                        Do you have an account?{" "}
                        <Link to="/">Sign in</Link>
                    </p>
                </div>
            </div>

            {/* Right Section */}
            <div className='login-right'>
                <div className="heading-row">
                    <div className="heading-text">
                        <h1>Welcome to</h1>
                        <h1>InventryPro</h1>
                    </div>
                    <div className='pie-image'>
                        <img src={loginPie} alt='Login Pie' />
                    </div>
                </div>
                <div className='group-image'>
                    <img src={loginGroupImage} alt='Login Group Image' />
                </div>
            </div>
        </div>
    )
}

export default Signup
