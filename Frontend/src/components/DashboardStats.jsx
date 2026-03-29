import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import CategoryIcon from '@mui/icons-material/Category';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import PeopleIcon from '@mui/icons-material/People';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import OutputIcon from '@mui/icons-material/Output'; // For outgoing
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { getAllUsers } from '../Service/userApi';

const StatCard = ({ title, value, icon, bgColor, trend, onClick }) => {
    return (
        <div 
            className={`relative overflow-hidden rounded-2xl shadow-lg text-white p-5 h-40 flex flex-col justify-between ${bgColor} cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-95 group`} 
            onClick={onClick}
        >
            {/* Background pattern/glass effect */}
            <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-500"></div>

            <div className="flex justify-between items-start z-10">
                <div>
                    <h3 className="text-4xl font-black tracking-tight">{value}</h3>
                    <p className="text-[11px] font-bold uppercase tracking-wider mt-1 opacity-90">{title}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md shadow-inner border border-white/10 group-hover:scale-110 transition-transform duration-300">
                    {React.cloneElement(icon, { style: { fontSize: 24, color: 'white' } })}
                </div>
            </div>

            <div className="flex justify-between items-end z-10 pt-4">
                <p className="text-[10px] font-semibold flex items-center bg-black/10 px-2 py-1 rounded-lg backdrop-blur-sm">
                    <span className="mr-1.5 font-bold">{trend}</span> this month
                </p>
                <div className="text-white/80 group-hover:text-white transition-colors">
                    <ArrowForwardIcon style={{ fontSize: 16 }} />
                </div>
            </div>
        </div>
    );
};

const DashboardStats = () => {
    const navigate = useNavigate();
    const [userCount, setUserCount] = useState(0);

    // Get data from Redux for live stats
    const { categories } = useSelector((state) => state.category);
    const { products } = useSelector((state) => state.product);
    const { customers } = useSelector((state) => state.customer);
    const { suppliers } = useSelector((state) => state.supplier);
    const { purchases } = useSelector((state) => state.purchase);
    const { outgoingRecords } = useSelector((state) => state.outgoing);

    useEffect(() => {
        const fetchUserCount = async () => {
            try {
                const response = await getAllUsers();
                if (response.data.success) {
                    setUserCount(response.data.count);
                }
            } catch (error) {
                console.error("Error fetching user count:", error);
            }
        };

        fetchUserCount();
    }, []);

    // Dynamic stats based on Redux and state
    const stats = [
        { title: 'System Users', value: userCount, icon: <ManageAccountsIcon />, bgColor: 'bg-[#1ab07e]', trend: '↗ +2%', path: '/users' },
        { title: 'Category', value: categories.length, icon: <CategoryIcon />, bgColor: 'bg-[#00cfe8]', trend: '↗ +12%', path: '/category' },
        { title: 'Product', value: products.length, icon: <Inventory2Icon />, bgColor: 'bg-[#ff9f43]', trend: '↗ +8%', path: '/product' },
        { title: 'Customer', value: customers.length, icon: <PeopleIcon />, bgColor: 'bg-[#ea5455]', trend: '↘ -3%', path: '/customer' },
        { title: 'Supplier', value: suppliers.length, icon: <LocalShippingIcon />, bgColor: 'bg-[#9c27b0]', trend: '↗ +5%', path: '/supplier' },
        { title: 'Total Purchase', value: purchases.length, icon: <ShoppingCartIcon />, bgColor: 'bg-[#3b82f6]', trend: '↗ +15%', path: '/purchase' },
        { title: 'Total Outgoing', value: outgoingRecords.length, icon: <OutputIcon />, bgColor: 'bg-[#0ea5e9]', trend: '↗ +6%', path: '/outgoing' },
    ];

    const handleCardClick = (path) => {
        navigate(path);
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
                <StatCard
                    key={index}
                    title={stat.title}
                    value={stat.value}
                    icon={stat.icon}
                    bgColor={stat.bgColor}
                    trend={stat.trend}
                    onClick={() => handleCardClick(stat.path)}
                />
            ))}
        </div>
    );
};

export default DashboardStats;
