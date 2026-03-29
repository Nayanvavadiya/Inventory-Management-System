import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MailOutline } from "@mui/icons-material";
import { getAllUsers } from "../Service/userApi";

// asset import
import signinImg from '../Images/Login_Image.jpg';

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        if (!email) {
            setError("Please enter the username");
            return;
        }

        if (!password) {
            setError("Please enter the password");
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

        // Check for hardcoded Admin credentials
        if (email === "admin@gmail.com" && password === "admin@123") {
            // First try to find the actual admin in the database to get their ID
            getAllUsers()
                .then((res) => {
                    const list = res.data.data || res.data;
                    const foundAdmin = list.find((u) => u.email === email);
                    
                    const adminUser = {
                        _id: foundAdmin?._id || "admin_hardcoded_id",
                        fullName: foundAdmin?.fullName || "Admin",
                        email: email,
                        mobile: foundAdmin?.mobile || "",
                        username: foundAdmin?.username || "admin",
                        role: "Admin"
                    };
                    localStorage.setItem("user", JSON.stringify(adminUser));
                    navigate("/dashboard");
                })
                .catch(() => {
                    // Fallback if API fails
                    const adminUser = {
                        fullName: "Admin",
                        email: email,
                        role: "Admin"
                    };
                    localStorage.setItem("user", JSON.stringify(adminUser));
                    navigate("/dashboard");
                });
            return;
        }

        // For all other users, lookup in database and assign Customer role
        getAllUsers()
            .then((res) => {
                const list = res.data.data || res.data;
                const found = list.find((u) => u.email === email);

                if (!found) {
                    setError("User not Found please Register First");
                    return;
                }

                const customerUser = {
                    _id: found?._id,
                    fullName: found?.fullName || "User",
                    email: email,
                    mobile: found?.mobile || "",
                    username: found?.username || "",
                    role: "Customer"
                };
                localStorage.setItem("user", JSON.stringify(customerUser));

                navigate("/dashboard", {
                    state: { email, password, name: found?.fullName }
                });
            })
            .catch((err) => {
                console.error("login lookup failed", err);

                // Fallback for demo purposes if backend fails
                const fallbackUser = {
                    fullName: "User",
                    email: email,
                    role: "Customer"
                };
                localStorage.setItem("user", JSON.stringify(fallbackUser));

                navigate("/dashboard", {
                    state: { email, password }
                });
            });
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center"
            style={{
                backgroundImage: `url(${signinImg})`,
            }}
        >
            <div className="absolute inset-0 bg-black/60"></div>

            <div className="relative w-full max-w-[420px] p-4">
                <div className="text-center mb-8">
                    <h1 className="text-6xl font-black tracking-wider text-[#FB4C6E]">IMS</h1>
                    <p className="mt-2 text-[10px] font-bold text-[#FB4C6E] tracking-[0.3em] uppercase">
                        Inventory Management System
                    </p>
                </div>

                <div className="bg-[#111111] rounded-[10px] shadow-2xl pb-8 pt-8 px-8">
                    {/* General Errors */}
                    {error && error !== "Please enter the username" && error !== "Please enter the password" && (
                        <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-md text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-[#FB4C6E] uppercase tracking-wider block">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                placeholder="[EMAIL_ADDRESS]"
                                value={email}
                                autoComplete="email"
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-[#1e232c] text-gray-200 text-sm px-4 py-3 rounded-md border border-[#2b303b] focus:outline-none focus:border-[#424959] transition-colors placeholder-[#636b7b]"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-[#FB4C6E] uppercase tracking-wider block">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                placeholder="password"
                                value={password}
                                autoComplete="current-password"
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-[#1e232c] text-gray-200 text-sm px-4 py-3 rounded-md border border-[#2b303b] focus:outline-none focus:border-[#424959] transition-colors placeholder-[#636b7b]"
                            />
                        </div>

                        <div className="flex items-center text-sm pt-1">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 text-[#FB4C6E] bg-transparent border-gray-500 rounded focus:ring-0 focus:ring-offset-0 accent-[#FB4C6E]"
                                />
                                <span className="ml-2 text-gray-400 text-[13px]">Remember me</span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#FB4C6E] hover:bg-[#e43c5b] text-white font-bold py-3.5 rounded-md transition-colors mt-2 cursor-pointer"
                        >
                            LOGIN
                        </button>

                        {/* Validation Errors below the submit button as requested previously */}
                        {error === "Please enter the username" && (
                            <div className="text-red-500 text-sm font-medium mt-2 text-center">
                                Please enter the username
                            </div>
                        )}
                        {error === "Please enter the password" && (
                            <div className="text-red-500 text-sm font-medium mt-2 text-center">
                                Please enter the password
                            </div>
                        )}
                    </form>

                    <div className="flex items-center my-6">
                        <div className="flex-grow border-t border-[#2b303b]"></div>
                        <span className="px-4 text-[11px] font-medium text-gray-500 uppercase">OR</span>
                        <div className="flex-grow border-t border-[#2b303b]"></div>
                    </div>

                    <div className="space-y-3">
                        <button
                            type="button"
                            className="w-full flex items-center justify-center space-x-2 bg-[#1a1d24] hover:bg-[#232731] border border-[#2b303b] text-gray-300 font-medium py-3 rounded-md transition-colors text-sm cursor-pointer"
                        >
                            <MailOutline sx={{ fontSize: 18 }} />
                            <span>Login with Email</span>
                        </button>

                        <button
                            type="button"
                            className="w-full flex items-center justify-center space-x-2 bg-[#1a1d24] hover:bg-[#232731] border border-[#2b303b] text-gray-300 font-medium py-3 rounded-md transition-colors text-sm"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                                <path
                                    fill="#4285F4"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            <span className="cursor-pointer">Login with Google</span>
                        </button>
                    </div>

                    <div className="mt-6 text-center text-[13px] text-gray-400">
                        Don't have an account?
                        <button
                            onClick={() => navigate("/signup")}
                            className="ml-1.5 text-[#FB4C6E] font-semibold hover:underline cursor-pointer"
                        >
                            Sign Up
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
