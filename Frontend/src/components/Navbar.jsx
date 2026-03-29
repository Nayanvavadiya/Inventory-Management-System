import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LogoutConfirmModal from "./LogoutConfirmModal";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleConfirmLogout = () => {
    localStorage.removeItem("user");
    setIsLogoutModalOpen(false);
    navigate("/");
  };

  return (
    <nav className="bg-[#1E293B] shadow-lg sticky top-0 z-50 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="shrink-0">
            <Link to="/Dashboard" className="flex items-center transition-opacity hover:opacity-80">
              <img
                src="https://static.vecteezy.com/system/resources/previews/043/212/923/non_2x/a-logo-design-representing-a-building-company-symbolizing-construction-and-innovation-a-simple-icon-that-communicates-the-concept-of-warehousing-and-inventory-management-free-vector.jpg"
                alt="Inventory Logo"
                className="h-10 w-auto object-contain brightness-110 contrast-125 rounded-md"
              />
              <span className="ml-3 text-white font-black tracking-tight text-lg hidden md:block uppercase">Inventory<span className="text-[#534BB3]">Pro</span></span>
            </Link>
          </div>

          <div className="flex space-x-6 items-center">
            {user ? (
              <>
                <Link to="/dashboard" className="text-slate-300 hover:text-white text-[13px] font-bold uppercase tracking-wider transition-all">Home</Link>
                <Link to="/profile" className="bg-[#534BB3] text-white px-5 py-2 rounded-xl hover:bg-[#433A9B] text-[13px] font-bold uppercase tracking-wider transition-all shadow-[0_2px_10px_rgba(83,75,179,0.2)]">Profile</Link>
                <button
                  onClick={handleLogoutClick}
                  className="text-red-400 hover:text-red-300 text-[13px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/" className="text-slate-300 hover:text-white text-[13px] font-bold uppercase tracking-wider transition-all">Login</Link>
                <Link to="/signup" className="text-slate-300 hover:text-white text-[13px] font-bold uppercase tracking-wider transition-all">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
      />
    </nav>
  );
}

export default Navbar;
