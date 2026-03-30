import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addPurchase, updatePurchase, deletePurchase } from '../store/slices/purchaseSlice';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import AddPurchaseModal from '../components/AddPurchaseModal';
import EditPurchaseModal from '../components/EditPurchaseModal';
import DeletePurchaseModal from '../components/DeletePurchaseModal';

// Purchase Product Images
import LaptopsImg from '../Images/Purchase_Image/High-End Laptops.webp';
import PalletsImg from '../Images/Purchase_Image/Shipping Pallets.jpeg';
import ChairsImg from '../Images/Purchase_Image/Ergonomic Chairs.webp';
import BoxesImg from '../Images/Purchase_Image/Recycled Boxes.webp';
import AluminumImg from '../Images/Purchase_Image/Aluminum Sheets.jpg';

const Purchase = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const user = JSON.parse(localStorage.getItem('user')) || {};
    const isAdmin = user.role === 'Admin';
    const dispatch = useDispatch();

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedPurchase, setSelectedPurchase] = useState(null);

    // Get purchases from Redux
    const { purchases } = useSelector((state) => state.purchase);

    const handleAddPurchase = (newPurchase) => {
        dispatch(addPurchase(newPurchase));
    };

    const handleEditClick = (purchase) => {
        if (!isAdmin) return;
        setSelectedPurchase(purchase);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (purchase) => {
        if (!isAdmin) return;
        setSelectedPurchase(purchase);
        setIsDeleteModalOpen(true);
    };

    const handleSavePurchase = (updatedPurchase) => {
        dispatch(updatePurchase(updatedPurchase));
    };

    const handleConfirmDelete = () => {
        if (selectedPurchase) {
            dispatch(deletePurchase(selectedPurchase.id));
            setIsDeleteModalOpen(false);
            setSelectedRecord(null);
        }
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

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-transparent p-6 md:p-8">
                    {/* Page Header */}
                    <div className="mb-8 flex justify-between items-center bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-indigo-600 rounded-lg text-white shadow-md">
                                <ShoppingCartIcon style={{ fontSize: 24 }} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">Purchase Management</h1>
                                <p className="text-sm text-gray-500">{purchases.length} purchases recorded</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => isAdmin && setIsAddModalOpen(true)}
                            disabled={!isAdmin}
                            className={`px-5 py-2.5 rounded-lg flex items-center text-sm font-medium transition-colors shadow-sm ${isAdmin ? 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer' : 'bg-indigo-600/60 text-white cursor-not-allowed'}`}
                        >
                            <AddIcon style={{ fontSize: 18, marginRight: 6 }} /> New Purchase
                        </button>
                    </div>

                    {/* Stats section */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-indigo-600">
                            <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Total Spend</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">
                                ${purchases.reduce((acc, curr) => acc + curr.totalAmount, 0).toLocaleString()}
                            </h3>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
                            <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Completed</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">
                                {purchases.filter(p => p.status === 'Completed').length}
                            </h3>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-yellow-500">
                            <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Pending</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">
                                {purchases.filter(p => p.status === 'Pending').length}
                            </h3>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
                            <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Items Purchased</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">
                                {purchases.reduce((acc, curr) => acc + curr.quantity, 0).toLocaleString()}
                            </h3>
                        </div>
                    </div>

                    {/* Filters Section */}
                    <div className="flex flex-col md:flex-row gap-4 mb-8">
                        <div className="relative flex-1 max-w-md">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <SearchIcon style={{ fontSize: 20, color: '#9ca3af' }} />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                                placeholder="Search by ID, Supplier or Product..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Purchase Card Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12">
                        {purchases
                            .filter(p => p.id.toLowerCase().includes(searchTerm.toLowerCase()) || p.supplier.toLowerCase().includes(searchTerm.toLowerCase()) || p.product.toLowerCase().includes(searchTerm.toLowerCase()))
                            .map((purchase) => (
                                <div key={purchase.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col">
                                    {/* Purchase Image */}
                                    <div className="h-40 bg-gray-50 flex items-center justify-center overflow-hidden">
                                        {purchase.image ? (
                                            <img
                                                src={purchase.image}
                                                alt={purchase.product}
                                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = 'https://placehold.co/300/f8fafc/64748b?text=No+Image';
                                                }}
                                            />
                                        ) : (
                                            <div className="w-16 h-16 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100 shadow-sm">
                                                <ReceiptLongOutlinedIcon style={{ fontSize: 32, color: '#4f46e5' }} />
                                            </div>
                                        )}
                                    </div>

                                    {/* Purchase Details */}
                                    <div className="p-5 flex flex-col flex-grow">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{purchase.id}</h3>
                                                <p className="text-[11px] text-gray-400 font-medium">{purchase.date}</p>
                                            </div>
                                            <span className={`px-2 py-0.5 text-[11px] font-semibold rounded-full ${purchase.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                                purchase.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-blue-100 text-blue-700'
                                                }`}>
                                                {purchase.status}
                                            </span>
                                        </div>

                                        <h2 className="text-lg font-bold text-gray-900 truncate mb-1" title={purchase.product}>{purchase.product}</h2>
                                        <p className="text-sm text-gray-600 font-medium mb-3">Supplier: <span className="text-gray-800">{purchase.supplier}</span></p>

                                        <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-50">
                                            <div>
                                                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">Total Amount</p>
                                                <span className="text-xl font-black text-gray-900">${purchase.totalAmount.toLocaleString()}</span>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">Quantity</p>
                                                <span className="text-sm font-bold text-gray-700">{purchase.quantity} units</span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="grid grid-cols-2 gap-2 mt-5">
                                            <button
                                                onClick={() => handleEditClick(purchase)}
                                                disabled={!isAdmin}
                                                className={`p-2 rounded-lg flex items-center justify-center transition-colors border ${isAdmin ? 'bg-gray-50 hover:bg-indigo-50 text-gray-600 hover:text-indigo-600 border-gray-200 hover:border-indigo-200 cursor-pointer' : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-60'}`}
                                                title="Edit"
                                            >
                                                <EditOutlinedIcon style={{ fontSize: 18 }} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(purchase)}
                                                disabled={!isAdmin}
                                                className={`p-2 rounded-lg flex items-center justify-center transition-colors border ${isAdmin ? 'bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-500 border-gray-200 hover:border-red-200 cursor-pointer' : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-60'}`}
                                                title="Delete"
                                            >
                                                <DeleteOutlineIcon style={{ fontSize: 18 }} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                        {/* New Purchase Empty Card */}
                        <button 
                            onClick={() => isAdmin && setIsAddModalOpen(true)}
                            disabled={!isAdmin}
                            className={`rounded-xl border-2 border-dashed flex flex-col items-center justify-center min-h-[400px] h-full transition-all group ${isAdmin ? 'bg-gray-50 border-gray-200 hover:bg-white hover:border-indigo-300 hover:shadow-md cursor-pointer' : 'bg-gray-50/50 border-gray-200/50 cursor-not-allowed opacity-60'}`}
                        >
                            <div className={`w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-sm transition-all mb-4 ${isAdmin ? 'group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white text-gray-400' : 'text-gray-300'}`}>
                                <AddIcon style={{ fontSize: 28 }} />
                            </div>
                            <span className={`text-sm font-bold uppercase tracking-widest transition-colors ${isAdmin ? 'text-gray-500 group-hover:text-gray-900' : 'text-gray-400'}`}>New Purchase</span>
                        </button>
                    </div>

                    {purchases.filter(p => p.id.toLowerCase().includes(searchTerm.toLowerCase()) || p.supplier.toLowerCase().includes(searchTerm.toLowerCase()) || p.product.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                            <div className="bg-gray-50 p-6 rounded-full mb-4">
                                <SearchIcon style={{ fontSize: 48, color: '#9ca3af' }} />
                            </div>
                            <p className="text-xl font-bold text-gray-800">No purchases found</p>
                            <p className="text-gray-500 mt-1">Try adjusting your search filters</p>
                        </div>
                    )}
                </main>
            </div>

            <AddPurchaseModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddPurchase}
            />

            <EditPurchaseModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                purchase={selectedPurchase}
                onSave={handleSavePurchase}
            />

            <DeletePurchaseModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                purchaseId={selectedPurchase?.id}
            />
        </div>
    );
};

export default Purchase;
