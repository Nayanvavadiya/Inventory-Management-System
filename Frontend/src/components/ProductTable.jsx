import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import EditIcon from '@mui/icons-material/Edit';
import EditProductModal from './EditProductModal';
import DeleteProductModal from './DeleteProductModal';
import DeleteIcon from '@mui/icons-material/Delete';
import AddBoxIcon from '@mui/icons-material/AddBox';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import SearchIcon from '@mui/icons-material/Search';
import { updateProduct, deleteProduct, addProduct } from '../store/slices/productSlice';
import AddProductModal from './AddProductModal';

// Import images for mapping
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

const ProductTable = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const user = JSON.parse(localStorage.getItem('user')) || {};
    const isAdmin = user.role === 'Admin';
    const dispatch = useDispatch();

    // Get products from Redux
    const { products } = useSelector((state) => state.product);

    const handleEditClick = (product) => {
        if (!isAdmin) return;
        setSelectedProduct(product);
        setIsEditModalOpen(true);
    };

    const handleSaveProduct = (updatedProduct) => {
        dispatch(updateProduct(updatedProduct));
    };

    const handleDeleteClick = (product) => {
        if (!isAdmin) return;
        setProductToDelete(product);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (productToDelete) {
            dispatch(deleteProduct(productToDelete.id));
            setIsDeleteModalOpen(false);
            setProductToDelete(null);
        }
    };

    const handleAddProduct = (newProduct) => {
        dispatch(addProduct(newProduct));
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white">
                <h2 className="text-xl font-bold text-gray-800">Recent Products</h2>
                <button 
                    onClick={() => isAdmin && setIsAddModalOpen(true)}
                    disabled={!isAdmin}
                    className={`${isAdmin ? 'bg-[#1ab07e] hover:bg-[#15966d] cursor-pointer' : 'bg-gray-200 cursor-not-allowed opacity-60'} text-white px-5 py-2.5 rounded-xl flex items-center text-sm font-bold transition-all shadow-sm hover:shadow-md active:scale-95`}
                >
                    <AddBoxIcon style={{ fontSize: 18, marginRight: 8 }} /> Add Product
                </button>
            </div>

            {/* Controls */}
            <div className="p-4 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600">
                <div className="mb-2 sm:mb-0 flex items-center">
                    Show
                    <select className="mx-2 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-green-500">
                        <option>10</option>
                        <option>25</option>
                        <option>50</option>
                    </select>
                    entries
                </div>
                <div className="flex items-center">
                    Search:
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="ml-2 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-green-500"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 border-y border-gray-200 text-gray-700 text-sm font-semibold">
                            <th className="p-4 cursor-pointer hover:bg-gray-200">ID <UnfoldMoreIcon style={{ fontSize: 14, color: '#999' }} /></th>
                            <th className="p-4 cursor-pointer hover:bg-gray-200">Name <UnfoldMoreIcon style={{ fontSize: 14, color: '#999' }} /></th>
                            <th className="p-4 cursor-pointer hover:bg-gray-200">Price <UnfoldMoreIcon style={{ fontSize: 14, color: '#999' }} /></th>
                            <th className="p-4 cursor-pointer hover:bg-gray-200">Qty. <UnfoldMoreIcon style={{ fontSize: 14, color: '#999' }} /></th>
                            <th className="p-4 cursor-pointer hover:bg-gray-200">Image <UnfoldMoreIcon style={{ fontSize: 14, color: '#999' }} /></th>
                            <th className="p-4 cursor-pointer hover:bg-gray-200">Category <UnfoldMoreIcon style={{ fontSize: 14, color: '#999' }} /></th>
                            <th className="p-4 cursor-pointer hover:bg-gray-200">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm">
                        {products
                            .filter(product =>
                                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                product.id.toString().includes(searchTerm)
                            )
                            .map((product) => (
                                <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="p-4">{product.id}</td>
                                    <td className="p-4 font-medium text-gray-800">{product.name}</td>
                                    <td className="p-4">{product.price}</td>
                                    <td className="p-4">{product.qty}</td>
                                    <td className="p-4 text-center">
                                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border border-gray-200">
                                            <img
                                                src={imageMap[product.imageId] || 'https://placehold.co/150/f8fafc/64748b?text=No+Image'}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = 'https://placehold.co/150/f8fafc/64748b?text=No+Image';
                                                }}
                                            />
                                        </div>
                                    </td>
                                    <td className="p-4">{product.category}</td>
                                    <td className="p-4">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleEditClick(product)}
                                                disabled={!isAdmin}
                                                className={`${isAdmin ? 'bg-blue-500 hover:bg-blue-600 cursor-pointer' : 'bg-blue-300 cursor-not-allowed opacity-60'} text-white px-3 py-1 rounded text-xs flex items-center transition-colors`}
                                            >
                                                <EditIcon style={{ fontSize: 14, marginRight: 4 }} /> Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(product)}
                                                disabled={!isAdmin}
                                                className={`${isAdmin ? 'bg-red-500 hover:bg-red-600 cursor-pointer' : 'bg-red-300 cursor-not-allowed opacity-60'} text-white px-3 py-1 rounded text-xs flex items-center transition-colors`}
                                            >
                                                <DeleteIcon style={{ fontSize: 14, marginRight: 4 }} /> Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="p-4 flex justify-between items-center text-sm text-gray-600">
                <div>Showing {products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.category.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toString().includes(searchTerm)).length > 0 ? 1 : 0} to {products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.category.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toString().includes(searchTerm)).length} of {products.length} entries</div>
                <div className="flex space-x-1">
                    <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50" disabled>Previous</button>
                    <button className="px-3 py-1 bg-blue-600 text-white border border-blue-600 rounded">1</button>
                    <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50" disabled>Next</button>
                </div>
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
                productName={productToDelete?.name}
            />

            <AddProductModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={handleAddProduct}
            />
        </div>
    );
};

export default ProductTable;
