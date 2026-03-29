import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Email, Google } from "@mui/icons-material";
import signinImg from '../Images/Login_Image.jpg';
import { createUser } from "../Service/userApi";

function Signup() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        if (!name || !email || !mobile || !username || !password || !confirmPassword) {
            setError("All fields are required");
            return;
        }

        // Mobile validation: Only numbers allowed and exactly 10 digits
        if (/[^\d]/.test(mobile)) {
            setError("Mobile number must contain only digits");
            return;
        }
        if (mobile.length !== 10) {
            setError("Mobile number must be exactly 10 digits");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        if (!/\d/.test(password)) {
            setError("Password must contain a number");
            return;
        }

        if (!/[a-zA-Z]/.test(password)) {
            setError("Password must contain a letter");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        const userData = {
            fullName: name,
            email,
            mobile,
            username,
            password
        };

        createUser(userData)
            .then((res) => {
                const newUser = res.data.data;
                navigate("/verify-email", { state: { user: newUser } });
            })
            .catch((err) => {
                console.error("Registration failed:", err);
                const msg = err?.response?.data?.message || "Registration failed. Please try again.";
                setError(msg);
            });
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center"
            style={{
                backgroundImage: `url(${signinImg})`,
            }}
        >
            <div className="absolute inset-0 bg-black/60 mt-0 mr-0 mb-[-195px] ml-0"></div>

            <div className="relative w-full max-w-md p-4">
                <div className="text-center mb-6">
                    <h1 className="text-[2.5rem] font-extrabold tracking-tight text-pink-400">IMS</h1>
                    <p className="mt-2 text-xs font-bold text-pink-300 tracking-[0.2em] uppercase">
                        Inventory Management System
                    </p>
                </div>

                <div className="bg-[#111111]/90 backdrop-blur-md rounded-xl shadow-2xl p-8 border border-white/5">
                    {error && (
                        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 text-red-200 rounded-lg text-xs font-medium text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="block text-[10px] font-bold text-pink-400 uppercase tracking-wider">
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="fullName"
                                placeholder="John Doe"
                                value={name}
                                autoComplete="name"
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-[#1A1F2B] text-gray-200 text-sm px-4 py-2.5 rounded-md border border-gray-700/50 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-colors placeholder:text-gray-500"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-[10px] font-bold text-pink-400 uppercase tracking-wider">
                                Username
                            </label>
                            <input
                                type="text"
                                name="username"
                                placeholder="username"
                                value={username}
                                // autoComplete="username"
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-[#1A1F2B] text-gray-200 text-sm px-4 py-2.5 rounded-md border border-gray-700/50 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-colors placeholder:text-gray-500"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-[10px] font-bold text-pink-400 uppercase tracking-wider">
                                Mobile
                            </label>
                            <input
                                type="text"
                                name="mobile"
                                placeholder="1234567890"
                                value={mobile}
                                autoComplete="tel"
                                onChange={(e) => setMobile(e.target.value)}
                                className="w-full bg-[#1A1F2B] text-gray-200 text-sm px-4 py-2.5 rounded-md border border-gray-700/50 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-colors placeholder:text-gray-500"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-[10px] font-bold text-pink-400 uppercase tracking-wider">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                placeholder="[EMAIL_ADDRESS]"
                                value={email}
                                autoComplete="email"
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-[#1A1F2B] text-gray-200 text-sm px-4 py-2.5 rounded-md border border-gray-700/50 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-colors placeholder:text-gray-500"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-[10px] font-bold text-pink-400 uppercase tracking-wider">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                placeholder="password"
                                value={password}
                                autoComplete="new-password"
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-[#1A1F2B] text-gray-200 text-sm px-4 py-2.5 rounded-md border border-gray-700/50 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-colors placeholder:text-gray-500"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-[10px] font-bold text-pink-400 uppercase tracking-wider">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="confirm password"
                                value={confirmPassword}
                                autoComplete="new-password"
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full bg-[#1A1F2B] text-gray-200 text-sm px-4 py-2.5 rounded-md border border-gray-700/50 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-colors placeholder:text-gray-500"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#F34466] hover:bg-[#E03355] text-white text-[11px] font-bold py-3 mt-4 rounded-md shadow-lg transition-all transform hover:-translate-y-0.5"
                        >
                            SIGN UP
                        </button>
                    </form>

                    <div className="flex items-center my-6">
                        <div className="flex-grow border-t border-gray-700"></div>
                        <span className="px-3 text-[10px] font-bold text-gray-500 uppercase">OR</span>
                        <div className="flex-grow border-t border-gray-700"></div>
                    </div>

                    <div className="space-y-3">
                        <button className="w-full flex items-center justify-center space-x-2 bg-[#1C212D] hover:bg-[#252A38] text-gray-300 text-xs font-semibold py-2.5 rounded-md border border-gray-700/50 transition-colors">
                            <Email sx={{ fontSize: 16 }} />
                            <span>Sign up with Email</span>
                        </button>
                        <button className="w-full flex items-center justify-center space-x-2 bg-[#1C212D] hover:bg-[#252A38] text-gray-300 text-xs font-semibold py-2.5 rounded-md border border-gray-700/50 transition-colors">
                            <Google sx={{ fontSize: 16, color: '#DB4437' }} />
                            <span>Sign up with Google</span>
                        </button>
                    </div>

                    <div className="text-center text-xs font-medium text-gray-400 mt-6">
                        Already have an account?
                        <button
                            onClick={() => navigate("/")}
                            className="ml-1 text-[#F34466] hover:text-[#FF6B8B] font-bold transition-colors"
                        >
                            Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;
