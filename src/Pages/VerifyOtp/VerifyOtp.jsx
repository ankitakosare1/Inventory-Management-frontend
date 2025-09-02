import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { verifyOtp } from '../../api/auth'

import '../../Styles/EmailVerifyResetPassStyle.css'
import '../../Styles/Login&SignupStyle.css'

import startup from "../../assets/Startup.png"

const VerifyOtp = () => {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (otp.length !== 6) {
            toast.error("OTP must be 6 digits");
            return;
        }

        if (loading) return;

        try {
            setLoading(true);
            const response = await verifyOtp(email, otp);
            toast.success("OTP verified successfully");
            navigate('/reset-password', { state: { email } });
        } catch (err) {
            toast.error("Invalid or expired OTP");
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className='container verify-otp-page'>
            {/* Left Section */}
            <div className='left-side'>
                <div className='login-box left-side-layout'>
                    <h2>Enter Your OTP</h2>
                    <p className='subtitle'>
                        We've sent a 6-digit OTP to your registered mail.
                        <br />
                        Please enter it below to sign in
                    </p>

                    <form onSubmit={handleSubmit}>
                            <label>OTP</label>
                            <input type='text'
                                id='otp'
                                name='otp'
                                value={otp}
                                placeholder='xxxx05'
                                maxLength="6"
                                onChange={(e) => setOtp(e.target.value)}
                                required
                            />

                        <button type="submit" disabled={loading}>
                            {loading ? <span className="spinner"></span> : "Confirm"}
                        </button>

                    </form>
                </div>
            </div>

            {/* Right Section */}
            <div className='login-right'>
                <div className='right-image'>
                    <img src={startup} alt='Women Web Developer' />
                </div>
            </div>
        </div>
    );
};

export default VerifyOtp;
