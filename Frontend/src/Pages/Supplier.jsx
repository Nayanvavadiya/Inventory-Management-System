import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addSupplier, updateSupplier, deleteSupplier } from '../store/slices/supplierSlice';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddSupplierModal from '../components/AddSupplierModal';
import EditSupplierModal from '../components/EditSupplierModal';
import DeleteSupplierModal from '../components/DeleteSupplierModal';

// Import supplier logos
import logo1 from '../Images/supplier/logo_1.avif';
import logo2 from '../Images/supplier/logo_2.avif';
import logo3 from '../Images/supplier/logo_3.avif';
import logo4 from '../Images/supplier/logo_4.avif';
import logo5 from '../Images/supplier/logo_5.avif';

const Supplier = () => {
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
    const [selectedSupplier, setSelectedSupplier] = useState(null);

    // Get suppliers from Redux
    const { suppliers } = useSelector((state) => state.supplier);

    const handleAddSupplier = (newSupplier) => {
        dispatch(addSupplier(newSupplier));
    };

    const handleEditClick = (supplier) => {
        if (!isAdmin) return;
        setSelectedSupplier(supplier);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (supplier) => {
        if (!isAdmin) return;
        setSelectedSupplier(supplier);
        setIsDeleteModalOpen(true);
    };

    const handleSaveSupplier = (updatedSupplier) => {
        dispatch(updateSupplier(updatedSupplier));
    };

    const handleConfirmDelete = () => {
        if (selectedSupplier) {
            dispatch(deleteSupplier(selectedSupplier.id));
            setIsDeleteModalOpen(false);
            setSelectedSupplier(null);
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

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-transparent p-6">
                    {/* Page Header */}
                    <div className="mb-6 flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-green-600 rounded-lg text-white shadow-md">
                                <LocalShippingIcon style={{ fontSize: 24 }} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">Supplier Management</h1>
                                <p className="text-sm text-gray-500">Manage your suppliers and their details</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => isAdmin && setIsAddModalOpen(true)}
                            disabled={!isAdmin}
                            className={`px-4 py-2.5 rounded-lg flex items-center text-sm font-medium transition-colors shadow-sm ${isAdmin ? 'bg-green-600 hover:bg-green-700 text-white cursor-pointer' : 'bg-green-600/60 text-white cursor-not-allowed'}`}
                        >
                            <AddIcon style={{ fontSize: 18, marginRight: 6 }} /> Add Supplier
                        </button>
                    </div>

                    {/* Stats section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-600">
                            <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Total Suppliers</p>
                            <h3 className="text-2xl font-bold text-gray-800 mt-1">{suppliers.length}</h3>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
                            <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Active Suppliers</p>
                            <h3 className="text-2xl font-bold text-gray-800 mt-1">
                                {suppliers.filter(s => s.status === 'Active').length}
                            </h3>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-orange-500">
                            <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Inactive Suppliers</p>
                            <h3 className="text-2xl font-bold text-gray-800 mt-1">
                                {suppliers.filter(s => s.status === 'Inactive').length}
                            </h3>
                        </div>
                    </div>

                    {/* Supplier Table List */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <h2 className="text-lg font-semibold text-gray-800">Suppliers List</h2>
                            <div className="relative w-full sm:w-64">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <SearchIcon style={{ fontSize: 20, color: '#9ca3af' }} />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors sm:text-sm"
                                    placeholder="Search suppliers..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-600 border-b border-gray-100 text-sm uppercase tracking-wider">
                                        <th className="py-4 px-6 font-medium">Supplier Name</th>
                                        <th className="py-4 px-6 font-medium">Contact Person</th>
                                        <th className="py-4 px-6 font-medium">Contact Details</th>
                                        <th className="py-4 px-6 font-medium">Category</th>
                                        <th className="py-4 px-6 font-medium">Status</th>
                                        <th className="py-4 px-6 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {suppliers
                                        .filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.email.toLowerCase().includes(searchTerm.toLowerCase()))
                                        .map((supplier) => (
                                            <tr key={supplier.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center">
                                                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold mr-3 overflow-hidden border border-gray-100 shadow-sm">
                                                            {(() => {
                                                                const logoMap = {
                                                                    1: logo1,
                                                                    2: logo2,
                                                                    3: logo3,
                                                                    4: logo4,
                                                                    5: logo5
                                                                };
                                                                const logo = logoMap[supplier.id];
                                                                return logo ? (
                                                                    <img src={logo} alt={supplier.name} className="h-full w-full object-cover" />
                                                                ) : (
                                                                    supplier.name.charAt(0)
                                                                );
                                                            })()}
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-gray-900">{supplier.name}</div>
                                                            <div className="text-xs text-gray-500 text-gray-500">ID: #{supplier.id}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6 text-sm text-gray-800">
                                                    {supplier.contactPerson}
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="text-sm text-gray-800">{supplier.email}</div>
                                                    <div className="text-sm text-gray-500">{supplier.phone}</div>
                                                </td>
                                                <td className="py-4 px-6 text-sm text-gray-800">
                                                    <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                                                        {supplier.category}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${supplier.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                        {supplier.status}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => handleEditClick(supplier)}
                                                            disabled={!isAdmin}
                                                            className={`p-2 rounded-lg transition-colors ${isAdmin ? 'text-gray-400 hover:text-blue-600 hover:bg-blue-50 cursor-pointer' : 'text-gray-300 cursor-not-allowed opacity-60'}`}
                                                            title="Edit"
                                                        >
                                                            <EditOutlinedIcon style={{ fontSize: 20 }} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteClick(supplier)}
                                                            disabled={!isAdmin}
                                                            className={`p-2 rounded-lg transition-colors ${isAdmin ? 'text-gray-400 hover:text-red-600 hover:bg-red-50 cursor-pointer' : 'text-gray-300 cursor-not-allowed opacity-60'}`}
                                                            title="Delete"
                                                        >
                                                            <DeleteOutlineIcon style={{ fontSize: 20 }} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    {suppliers.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="py-8 text-center text-gray-500">
                                                No suppliers found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>

            <AddSupplierModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddSupplier}
            />

            <EditSupplierModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                supplier={selectedSupplier}
                onSave={handleSaveSupplier}
            />

            <DeleteSupplierModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                supplierName={selectedSupplier?.name}
            />
        </div>
    );
};

export default Supplier;
