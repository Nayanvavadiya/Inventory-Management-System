import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import CategoryTable from '../components/CategoryTable';
import CategoryIcon from '@mui/icons-material/Category';

const Category = () => {
    console.log("Category Page Rendering");
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const categories = useSelector((state) => state.category.categories);


    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex h-screen bg-[#f0f5f9] overflow-hidden font-sans text-slate-900">
            {/* Sidebar (Responsive) */}
            <div className={`fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-auto ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <Sidebar />
            </div>

            {/* Overlay for mobile sidebar */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-20 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Topbar toggleSidebar={toggleSidebar} />

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-transparent p-6">
                    {/* Page Header */}
                    <div className="mb-6 flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <div className="p-3 bg-green-500 rounded-lg shadow-lg text-white">
                                <CategoryIcon style={{ fontSize: 24 }} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">Category Management</h1>
                                <p className="text-sm text-gray-600">View and manage all product categories</p>
                            </div>
                        </div>
                    </div>

                    {/* Stats or other info can go here */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                            <p className="text-sm text-gray-500 uppercase font-semibold">Total Categories</p>
                            <h3 className="text-2xl font-bold text-gray-800">{categories.length}</h3>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                            <p className="text-sm text-gray-500 uppercase font-semibold">Active Categories</p>
                            <h3 className="text-2xl font-bold text-gray-800">6</h3>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
                            <p className="text-sm text-gray-500 uppercase font-semibold">Inactive Categories</p>
                            <h3 className="text-2xl font-bold text-gray-800">2</h3>
                        </div>
                    </div>

                    <CategoryTable />
                </main>
            </div>
        </div>
    );
};

export default Category;

