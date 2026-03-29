import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CategoryIcon from '@mui/icons-material/Category';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import PeopleIcon from '@mui/icons-material/People';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import OutputIcon from '@mui/icons-material/Output'; // For outgoing
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'; // For system users

import CircleIcon from '@mui/icons-material/Circle';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import LogoutConfirmModal from './LogoutConfirmModal';

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user")) || { fullName: "Admin", role: "Admin" };

    const menuItems = [
        { name: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard', roles: ['Admin', 'Customer'] },
        { name: 'Category', icon: <CategoryIcon />, path: '/category', roles: ['Admin', 'Customer'] },
        { name: 'Product', icon: <Inventory2Icon />, path: '/product', roles: ['Admin', 'Customer'] },
        { name: 'Customer', icon: <PeopleIcon />, path: '/customer', roles: ['Admin'] },
        { name: 'Supplier', icon: <LocalShippingIcon />, path: '/supplier', roles: ['Admin'] },
        { name: 'Purchase Products', icon: <ShoppingCartIcon />, path: '/purchase', roles: ['Admin'] },
        { name: 'Outgoing Products', icon: <OutputIcon />, path: '/outgoing', roles: ['Admin', 'Customer'] },
        { name: 'System Users', icon: <ManageAccountsIcon />, path: '/users', roles: ['Admin'] },
    ];

    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const handleLogoutClick = () => {
        setIsLogoutModalOpen(true);
    };

    const handleConfirmLogout = () => {
        localStorage.removeItem("user");
        setIsLogoutModalOpen(false);
        navigate("/");
    };

    // Filter menu items based on user role
    const filteredMenuItems = menuItems.filter(item => item.roles.includes(user.role));

    const isActive = (path) => location.pathname === path;

    return (
        <div className="bg-gray-800 text-white h-screen w-64 flex-shrink-0 flex flex-col transition-all duration-300">
            {/* User Info Section */}
            <Link to="/profile" className="p-4 border-b border-gray-700 flex items-center space-x-3 hover:bg-gray-700 transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden">
                    <AccountCircleIcon style={{ fontSize: 40, color: '#ccc' }} />
                </div>
                <div>
                    <div className="font-semibold text-sm">{user.fullName}</div>
                    <div className="text-xs text-green-400 flex items-center">
                        <CircleIcon style={{ fontSize: 10, marginRight: 4 }} /> {user.role}
                    </div>
                </div>
            </Link>

            {/* Navigation Menu */}
            <nav className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-1">
                    {filteredMenuItems.map((item) => (
                        <li key={item.name}>
                            <Link
                                to={item.path}
                                className={`flex items-center px-4 py-3 text-sm font-medium transition-colors ${isActive(item.path)
                                    ? 'bg-black text-white border-l-4 border-green-500'
                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                    }`}
                            >
                                <span className="mr-3 text-gray-400 group-hover:text-white">
                                    {React.cloneElement(item.icon, { fontSize: "small" })}
                                </span>
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Logout Section at bottom */}
            <div className="mt-auto p-4 border-t border-gray-700">
                <button
                    onClick={handleLogoutClick}
                    className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors rounded-md cursor-pointer"
                >
                    <LogoutIcon fontSize="small" className="mr-3" />
                    Logout
                </button>
            </div>
            <LogoutConfirmModal 
                isOpen={isLogoutModalOpen} 
                onClose={() => setIsLogoutModalOpen(false)} 
                onConfirm={handleConfirmLogout} 
            />
        </div>
    );
};

export default Sidebar;
