import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { sendOtpEmail } from '../../api/auth'

import '../../Styles/EmailVerifyResetPassStyle.css';
import '../../Styles/Login&SignupStyle.css'

import womenWebDeveloper from "../../assets/WomenWebDeveloper.png"


const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            toast.error("Please enter a valid email address");
            return false;
        }

        setLoading(true);

        try {
            await sendOtpEmail(email);
            toast.success("OTP sent to your email");
            navigate("/verify-otp", { state: { email } });
        } catch (err) {
            toast.error("Failed to send OTP");
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className='container forgot-password-page'>
            {/* Left Section */}
            <div className='left-side'>
                <div className='login-box left-side-layout'>
                    <h2>InventryPro</h2>
                    <p className='subtitle'>
                        Please enter your registered email ID to receive an OTP
                    </p>

                    <form onSubmit={handleSubmit}>
                        <label>E-mail</label>
                        <input type='email'
                            id='email'
                            name='email'
                            value={email}
                            placeholder='Enter your registered email'
                            onChange={(e) => setEmail(e.target.value)}
                            required />

                        <button type='submit' disabled={loading}>
                            {loading ? (
                                <span className="spinner"></span>
                            ) : (
                                "Send Email"
                            )}
                        </button>
                    </form>
                </div>
            </div>

            {/* Right Section */}
            <div className='login-right'>
                <div className='right-image'>
                    <img src={womenWebDeveloper} alt='Women Web Developer' />
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;