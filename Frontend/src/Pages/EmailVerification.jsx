import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Email, CheckCircleOutline } from '@mui/icons-material';
import signinImg from '../Images/Login_Image.jpg';
import { verifyOTP } from '../Service/userApi';

const EmailVerification = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = location.state?.user;
    const [otp, setOtp] = React.useState(['', '', '', '']);
    const [error, setError] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const inputRefs = [React.useRef(), React.useRef(), React.useRef(), React.useRef()];

    const handleChange = (index, value) => {
        if (isNaN(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        if (value && index < 3) {
            inputRefs[index + 1].current.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs[index - 1].current.focus();
        }
    };

    const handleVerify = async () => {
        if (!user?.email) {
            setError("Email not found. Please try signing up again.");
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await verifyOTP({
                email: user.email,
                otp: otp.join('')
            });

            if (response.data.success) {
                localStorage.setItem("user", JSON.stringify({
                    _id: user._id,
                    fullName: user.fullName || "User",
                    email: user.email,
                    mobile: user.mobile || "",
                    username: user.username || "",
                    role: "Customer"
                }));
                navigate('/dashboard');
            }
        } catch (err) {
            console.error("Verification error:", err);
            const message = err.response?.data?.message || "Something went wrong. Please try again.";
            if (message === "Invalid OTP") {
                setError("please enter valid otp");
            } else {
                setError(message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center"
            style={{
                backgroundImage: `url(${signinImg})`,
            }}
        >
            <div className="absolute inset-0 bg-black/60 mt-0 mr-0 mb-0 ml-0"></div>

            <div className="relative w-full max-w-md p-4">
                <div className="text-center mb-6">
                    <h1 className="text-[2.5rem] font-extrabold tracking-tight text-pink-400">IMS</h1>
                    <p className="mt-2 text-xs font-bold text-pink-300 tracking-[0.2em] uppercase">
                        Inventory Management System
                    </p>
                </div>

                <div className="bg-[#111111]/90 backdrop-blur-md rounded-xl shadow-2xl p-8 border border-white/5 text-center">
                    <div className="mb-6 flex justify-center">
                        <div className="bg-pink-500/20 p-4 rounded-full border border-pink-500/50">
                            <Email sx={{ fontSize: 40, color: '#F34466' }} />
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-2">Verify your Email</h2>
                    <p className="text-gray-400 text-sm mb-6">
                        We've sent a 4-digit code to your email. Enter it below to verify.
                    </p>

                    {error && (
                        <div className="mb-4 p-2 bg-red-500/10 border border-red-500/50 rounded text-red-500 text-xs font-bold">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-center gap-4 mb-8">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={inputRefs[index]}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="w-12 h-14 text-center text-2xl font-bold bg-white/5 border border-white/10 rounded-lg text-white focus:border-pink-500 focus:outline-none transition-all"
                            />
                        ))}
                    </div>

                    <button
                        onClick={handleVerify}
                        disabled={otp.some(d => !d) || loading}
                        className={`w-full text-white text-[11px] font-bold py-3 rounded-md shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 ${otp.some(d => !d) || loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#F34466] hover:bg-[#E03355]'
                            }`}
                    >
                        {loading ? (
                            <span className="animate-pulse">VERIFYING...</span>
                        ) : (
                            <>
                                <CheckCircleOutline sx={{ fontSize: 16 }} />
                                <span>VERIFY</span>
                            </>
                        )}
                    </button>

                    <div className="text-center text-xs font-medium text-gray-400 mt-6">
                        Didn't receive any email?
                        <button className="ml-1 text-[#F34466] hover:text-[#FF6B8B] font-bold transition-colors">
                            Resend
                        </button>
                    </div>

                    <div className="mt-4">
                        <button
                            onClick={() => navigate("/")}
                            className="text-gray-500 hover:text-gray-300 text-xs font-bold transition-colors uppercase tracking-wider"
                        >
                            Back to Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailVerification;
