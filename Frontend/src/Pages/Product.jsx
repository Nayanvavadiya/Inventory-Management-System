import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateProduct, deleteProduct, addProduct } from '../store/slices/productSlice';
import EditProductModal from '../components/EditProductModal';
import DeleteProductModal from '../components/DeleteProductModal';
import AddProductModal from '../components/AddProductModal';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

// Product Images
import MacBookImg from '../Images/Product_Image/MacBook Pro 16.jpeg';
import StandingDeskImg from '../Images/Product_Image/Standing Desk.webp';
import SteelBeamsImg from '../Images/Product_Image/Steel Beams (Bundle).jpeg';
import ShippingBoxImg from '../Images/Product_Image/Shipping Box Large.webp';
import CordlessDrillImg from '../Images/Product_Image/Cordless Drill.jpg';
import SafetyHelmetImg from '../Images/Product_Image/Safety Helmet.avif';
import USBCImg from '../Images/Product_Image/USB-C Hub.jpeg';
import BubbleWrapImg from '../Images/Product_Image/Bubble Wrap Roll.jpeg';

const imageMap = {
    'macbook': MacBookImg,
    'standingdesk': StandingDeskImg,
    'steelbeams': SteelBeamsImg,
    'shippingbox': ShippingBoxImg,
    'drill': CordlessDrillImg,
    'helmet': SafetyHelmetImg,
    'usbc': USBCImg,
    'bubblewrap': BubbleWrapImg,
};

const Product = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All Categories');
    const [selectedStatus, setSelectedStatus] = useState('All Status');

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const dispatch = useDispatch();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const user = JSON.parse(localStorage.getItem('user')) || {};
    const isAdmin = user.role === 'Admin';

    const products = useSelector((state) => state.product.products);

    const uniqueCategories = ["All Categories", ...new Set(products.map(p => p.category))];
    const uniqueStatuses = ["All Status", ...new Set(products.map(p => p.status))];

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.status.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory = selectedCategory === 'All Categories' || product.category === selectedCategory;
        const matchesStatus = selectedStatus === 'All Status' || product.status === selectedStatus;

        return matchesSearch && matchesCategory && matchesStatus;
    });

    const handleEditClick = (product) => {
        if (!isAdmin) return;
        setSelectedProduct(product);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (product) => {
        if (!isAdmin) return;
        setSelectedProduct(product);
        setIsDeleteModalOpen(true);
    };

    const handleSaveProduct = (updatedProduct) => {
        dispatch(updateProduct(updatedProduct));
    };

    const handleConfirmDelete = () => {
        if (selectedProduct) {
            dispatch(deleteProduct(selectedProduct.id));
            setIsDeleteModalOpen(false);
            setSelectedProduct(null);
        }
    };

    const handleAddProduct = (newProduct) => {
        dispatch(addProduct(newProduct));
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


                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-transparent p-6 md:p-8">
                    {/* Header Top Section (mimicking Topbar integration for seamless look) */}
                    <div className="flex justify-between items-center mb-8 border-b pb-4 border-gray-200">
                        <div className="flex items-center space-x-3">
                            <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                                <ArrowBackIcon fontSize="small" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 leading-tight">Product Management</h1>
                                <p className="text-sm text-gray-500">{filteredProducts.length} products</p>
                            </div>
                        </div>
                        <button
                            onClick={() => isAdmin && setIsAddModalOpen(true)}
                            disabled={!isAdmin}
                            className={`${isAdmin ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer' : 'bg-blue-300 cursor-not-allowed opacity-60'} text-white px-4 py-2.5 rounded-lg flex items-center text-sm font-medium transition-colors shadow-sm`}
                        >
                            <AddIcon style={{ fontSize: 18, marginRight: 4 }} /> Add Product
                        </button>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-blue-500 flex flex-col justify-center">
                            <p className="text-sm text-gray-500 mb-1">Total Products</p>
                            <h3 className="text-2xl font-bold text-gray-900">{filteredProducts.length}</h3>
                        </div>
                        <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-green-500 flex flex-col justify-center">
                            <p className="text-sm text-gray-500 mb-1">Total Items</p>
                            <h3 className="text-2xl font-bold text-gray-900">283</h3>
                        </div>
                        <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-yellow-500 flex flex-col justify-center">
                            <p className="text-sm text-gray-500 mb-1">Low Stock</p>
                            <h3 className="text-2xl font-bold text-gray-900">2</h3>
                        </div>
                        <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-purple-500 flex flex-col justify-center">
                            <p className="text-sm text-gray-500 mb-1">Inventory Value</p>
                            <h3 className="text-2xl font-bold text-gray-900">$256,498</h3>
                        </div>
                    </div>

                    {/* Filters Section */}
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="relative flex-1 max-w-md">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <SearchIcon style={{ fontSize: 20, color: '#9ca3af' }} />
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
                                placeholder="Search products..."
                            />
                        </div>

                        <div className="flex gap-2">
                            <div className="relative min-w-[160px]">
                                <select
                                    className="appearance-none w-full bg-white border border-gray-300 text-gray-700 pl-4 pr-10 py-2.5 rounded-lg text-sm hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer"
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                >
                                    {uniqueCategories.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                    <KeyboardArrowDownIcon style={{ fontSize: 18 }} />
                                </div>
                            </div>
                            <div className="relative min-w-[140px]">
                                <select
                                    className="appearance-none w-full bg-white border border-gray-300 text-gray-700 pl-4 pr-10 py-2.5 rounded-lg text-sm hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer"
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                >
                                    {uniqueStatuses.map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                    <KeyboardArrowDownIcon style={{ fontSize: 18 }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12">
                        {filteredProducts.map((product) => (
                            <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col">
                                {/* Product Image */}
                                <div className="h-48 bg-gray-50 flex items-center justify-center overflow-hidden">
                                    {product.imageId || product.image ? (
                                        <img
                                            src={imageMap[product.imageId] || product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = 'https://placehold.co/300/f8fafc/64748b?text=No+Image';
                                            }}
                                        />
                                    ) : (
                                        <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center border border-gray-300 shadow-sm">
                                            <Inventory2OutlinedIcon style={{ fontSize: 32, color: '#9ca3af' }} />
                                        </div>
                                    )}
                                </div>

                                {/* Product Details */}
                                <div className="p-5 flex flex-col flex-grow">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="text-base font-semibold text-gray-900 truncate pr-2" title={product.name}>{product.name}</h3>
                                        <span className={`px-2 py-0.5 text-[11px] font-medium rounded-full whitespace-nowrap ${product.status === 'In Stock' ? 'bg-green-100 text-green-700' :
                                            product.status === 'Low Stock' ? 'bg-orange-100 text-orange-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                            {product.status}
                                        </span>
                                    </div>


                                    <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-grow">{product.desc}</p>

                                    <div className="flex justify-between items-center mt-auto">
                                        <span className="text-lg font-bold text-gray-900">{product.price}</span>
                                        <span className="text-sm text-gray-500">Qty: {product.qty}</span>
                                    </div>
                                    <div className="mt-3">
                                        <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-md">{product.category}</span>
                                    </div>

                                    {/* Actions */}
                                    <div className="border-t border-gray-100 mt-4 pt-4 flex gap-2">
                                        <button
                                            onClick={() => handleEditClick(product)}
                                            disabled={!isAdmin}
                                            className={`flex-1 ${isAdmin ? 'bg-gray-50 hover:bg-gray-100 text-gray-800' : 'bg-gray-100 text-gray-400 opacity-60 cursor-not-allowed'} border border-gray-200 font-medium py-2 px-4 rounded-lg flex items-center justify-center text-sm transition-colors`}
                                        >
                                            <EditOutlinedIcon style={{ fontSize: 18, marginRight: 8 }} /> Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(product)}
                                            disabled={!isAdmin}
                                            className={`${isAdmin ? 'bg-gray-50 hover:bg-red-50 text-red-500 hover:border-red-200' : 'bg-gray-100 text-gray-400 opacity-60 cursor-not-allowed'} border border-gray-200 py-2 px-3 rounded-lg flex items-center justify-center transition-colors`}
                                        >
                                            <DeleteOutlineIcon style={{ fontSize: 18 }} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Add Product Card */}
                        <button
                            onClick={() => isAdmin && setIsAddModalOpen(true)}
                            disabled={!isAdmin}
                            className={`bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center min-h-[460px] h-full ${isAdmin ? 'hover:bg-gray-100 hover:border-gray-300 cursor-pointer' : 'opacity-60 cursor-not-allowed'} transition-colors group`}
                        >
                            <div className={`w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm ${isAdmin ? 'group-hover:shadow text-gray-400 group-hover:text-blue-600' : 'text-gray-300'} transition-all mb-3`}>
                                <AddIcon />
                            </div>
                            <span className="text-sm font-medium text-gray-500 group-hover:text-gray-700 transition-colors">Add Product</span>
                        </button>

                    </div>

                </main>
            </div>

            <EditProductModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                product={selectedProduct}
                onSave={handleSaveProduct}
            />

            <DeleteProductModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                productName={selectedProduct?.name}
            />

            <AddProductModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={handleAddProduct}
            />
        </div>
    );
};

export default Product;