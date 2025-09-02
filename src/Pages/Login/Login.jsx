import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginUser } from '../../api/auth';
import { eyeToggleIcon } from '../../utils/eyeToggleIcon'
import '../../Styles/Login&SignupStyle.css'

import loginPie from "../../assets/Login-Pie.png"
import loginGroupImage from "../../assets/Login-Group-Image.png"

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const validateForm = () => {
        const { email, password } = formData;

        if (!email || !password) {
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

        return true;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm() || loading) {
            return;
        }
        setLoading(true);

        try {
            const res = await loginUser(formData);
            if (res.token) {
                localStorage.setItem("token", res.token);
                toast.success("Login successful");
                setTimeout(() => navigate("/home"), 1500);
            }
            else {
                toast.error("Login failed: No token Received");
            }
        } catch (err) {
            console.error("Login error:", err.response?.data || err.message);
            toast.error("Invalid credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='container'>
            {/* Left Section */}
            <div className='left-side'>
                <div className='login-box'>
                    <h2>Log in to your account</h2>
                    <p className='subtitle'>
                        Welcome back! Please enter your details
                    </p>

                    <form onSubmit={handleSubmit}>
                        {/* Email */}
                        <label>Email</label>
                        <input type='email' name='email' placeholder='Example@email.com' value={formData.email} onChange={handleChange} required />

                        {/* Password */}
                        <label>Password</label>
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

                        <div className='forgot-row'>
                            <Link to="/forgot-password">
                                Forgot Password?
                            </Link>
                        </div>

                        <button type='submit' disabled={loading}>
                            {loading ? <span className="spinner"></span> : "Sign in"}
                        </button>

                    </form>

                    <p className='signup-text'>
                        Don't you have an account?{" "}
                        <Link to="/signup">Sign up</Link>
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
    );
};

export default Login;
