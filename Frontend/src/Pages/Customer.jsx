import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addCustomer, updateCustomer, deleteCustomer } from '../store/slices/customerSlice';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import PeopleIcon from '@mui/icons-material/People';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddCustomerModal from '../components/AddCustomerModal';
import EditCustomerModal from '../components/EditCustomerModal';
import DeleteCustomerModal from '../components/DeleteCustomerModal';

// Import customer photos
import customer1 from '../Images/customer/customer_01.jpg';
import customer2 from '../Images/customer/customer_02.jpg';
import customer3 from '../Images/customer/customer_03.jpg';
import customer4 from '../Images/customer/customer_04.jpg';

const Customer = () => {
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
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    // Get customers from Redux
    const { customers } = useSelector((state) => state.customer);

    const handleEditClick = (customer) => {
        if (!isAdmin) return;
        setSelectedCustomer(customer);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (customer) => {
        if (!isAdmin) return;
        setSelectedCustomer(customer);
        setIsDeleteModalOpen(true);
    };

    const handleAddCustomer = (newCustomer) => {
        dispatch(addCustomer(newCustomer));
    };

    const handleSaveCustomer = (updatedCustomer) => {
        dispatch(updateCustomer(updatedCustomer));
    };

    const handleConfirmDelete = () => {
        if (selectedCustomer) {
            dispatch(deleteCustomer(selectedCustomer.id));
            setIsDeleteModalOpen(false);
            setSelectedCustomer(null);
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
                            <div className="p-3 bg-blue-500 rounded-lg text-white shadow-md">
                                <PeopleIcon style={{ fontSize: 24 }} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">Customer Management</h1>
                                <p className="text-sm text-gray-500">Manage your customers and their details</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            disabled={!isAdmin}
                            className={`px-4 py-2.5 rounded-lg flex items-center text-sm font-medium transition-all shadow-sm ${isAdmin ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer active:scale-95' : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-70'}`}
                        >
                            <AddIcon style={{ fontSize: 18, marginRight: 6 }} /> Add Customer
                        </button>
                    </div>

                    {/* Stats section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
                            <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Total Customers</p>
                            <h3 className="text-2xl font-bold text-gray-800 mt-1">{customers.length}</h3>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
                            <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Active Customers</p>
                            <h3 className="text-2xl font-bold text-gray-800 mt-1">
                                {customers.filter(c => c.status === 'Active').length}
                            </h3>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500">
                            <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Total Orders</p>
                            <h3 className="text-2xl font-bold text-gray-800 mt-1">
                                {customers.reduce((acc, curr) => acc + curr.orders, 0)}
                            </h3>
                        </div>
                    </div>

                    {/* Customer Table List */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <h2 className="text-lg font-semibold text-gray-800">Customers List</h2>
                            <div className="relative w-full sm:w-64">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <SearchIcon style={{ fontSize: 20, color: '#9ca3af' }} />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors sm:text-sm"
                                    placeholder="Search customers..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-600 border-b border-gray-100 text-sm uppercase tracking-wider">
                                        <th className="py-4 px-6 font-medium">Name</th>
                                        <th className="py-4 px-6 font-medium">Contact Info</th>
                                        <th className="py-4 px-6 font-medium">Orders</th>
                                        <th className="py-4 px-6 font-medium">Status</th>
                                        <th className="py-4 px-6 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {customers
                                        .filter(customer => customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || customer.email.toLowerCase().includes(searchTerm.toLowerCase()))
                                        .map((customer) => (
                                            <tr key={customer.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center">
                                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3 overflow-hidden border border-gray-100 shadow-sm">
                                                            {(() => {
                                                                if (customer.image) {
                                                                    return <img src={customer.image} alt={customer.name} className="h-full w-full object-cover" />;
                                                                }
                                                                const logoMap = {
                                                                    1: customer1,
                                                                    2: customer2,
                                                                    3: customer3,
                                                                    4: customer4
                                                                };
                                                                const logo = logoMap[customer.id];
                                                                return logo ? (
                                                                    <img src={logo} alt={customer.name} className="h-full w-full object-cover" />
                                                                ) : (
                                                                    customer.name.charAt(0)
                                                                );
                                                            })()}
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-gray-900">{customer.name}</div>
                                                            <div className="text-xs text-gray-500 text-gray-500">ID: #{customer.id}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="text-sm text-gray-800">{customer.email}</div>
                                                    <div className="text-sm text-gray-500">{customer.phone}</div>
                                                </td>
                                                <td className="py-4 px-6 text-sm text-gray-800 font-medium">
                                                    {customer.orders}
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${customer.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                        {customer.status}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => handleEditClick(customer)}
                                                            disabled={!isAdmin}
                                                            className={`p-2 rounded-lg transition-colors ${isAdmin ? 'text-gray-400 hover:text-blue-600 hover:bg-blue-50 cursor-pointer' : 'text-gray-300 cursor-not-allowed opacity-60'}`}
                                                            title="Edit"
                                                        >
                                                            <EditOutlinedIcon style={{ fontSize: 20 }} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteClick(customer)}
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
                                    {customers.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="py-8 text-center text-gray-500">
                                                No customers found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>

            <AddCustomerModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={handleAddCustomer}
            />

            <EditCustomerModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                customer={selectedCustomer}
                onSave={handleSaveCustomer}
            />

            <DeleteCustomerModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                customerName={selectedCustomer?.name}
            />
        </div>
    );
};

export default Customer;
