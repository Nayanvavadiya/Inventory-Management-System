import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addOutgoing, updateOutgoing, deleteOutgoing } from '../store/slices/outgoingSlice';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import OutputIcon from '@mui/icons-material/Output';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import AddOutgoingModal from '../components/AddOutgoingModal';
import EditOutgoingModal from '../components/EditOutgoingModal';
import DeleteOutgoingModal from '../components/DeleteOutgoingModal';

// Outgoing Product Images
import MacBookImg from '../Images/Outgoing_image/MacBook Pro 16.jpeg';
import StandingDeskImg from '../Images/Outgoing_image/Standing Desk.webp';
import SteelBeamsImg from '../Images/Outgoing_image/Steel Beams (Bundle).jpeg';
import CordlessDrillImg from '../Images/Outgoing_image/Cordless Drill.jpg';
import SafetyHelmetImg from '../Images/Outgoing_image/Safety Helmet.avif';

const Outgoing = () => {
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
    const [selectedRecord, setSelectedRecord] = useState(null);

    // Get outgoing records from Redux
    const { outgoingRecords } = useSelector((state) => state.outgoing);

    const handleAddRecord = (newRecord) => {
        dispatch(addOutgoing(newRecord));
    };

    const handleEditClick = (record) => {
        if (!isAdmin) return;
        setSelectedRecord(record);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (record) => {
        if (!isAdmin) return;
        setSelectedRecord(record);
        setIsDeleteModalOpen(true);
    };

    const handleSaveRecord = (updatedRecord) => {
        dispatch(updateOutgoing(updatedRecord));
    };

    const handleConfirmDelete = () => {
        if (selectedRecord) {
            dispatch(deleteOutgoing(selectedRecord.id));
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
                            <div className="p-3 bg-orange-600 rounded-lg text-white shadow-md">
                                <OutputIcon style={{ fontSize: 24 }} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">Outgoing Product Management</h1>
                                <p className="text-sm text-gray-500">{outgoingRecords.length} records found</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => isAdmin && setIsAddModalOpen(true)}
                            disabled={!isAdmin}
                            className={`px-5 py-2.5 rounded-lg flex items-center text-sm font-medium transition-colors shadow-sm ${isAdmin ? 'bg-orange-600 hover:bg-orange-700 text-white cursor-pointer' : 'bg-orange-600/60 text-white cursor-not-allowed'}`}
                        >
                            <AddIcon style={{ fontSize: 18, marginRight: 6 }} /> Record Outgoing
                        </button>
                    </div>

                    {/* Stats section */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-orange-600">
                            <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Total Outgoing</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">{outgoingRecords.length}</h3>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
                            <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Dispatched</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">
                                {outgoingRecords.filter(r => r.status === 'Dispatched').length}
                            </h3>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-yellow-500">
                            <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Pending</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">
                                {outgoingRecords.filter(r => r.status === 'Pending').length}
                            </h3>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
                            <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Total Units</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">
                                {outgoingRecords.reduce((acc, curr) => acc + curr.quantity, 0).toLocaleString()}
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
                                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm transition duration-150 ease-in-out"
                                placeholder="Search by ID, Customer or Product..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Outgoing Card Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12">
                        {outgoingRecords
                            .filter(r => r.id.toLowerCase().includes(searchTerm.toLowerCase()) || r.customer.toLowerCase().includes(searchTerm.toLowerCase()) || r.product.toLowerCase().includes(searchTerm.toLowerCase()))
                            .map((record) => (
                                <div key={record.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col">
                                    {/* Outgoing Image */}
                                    <div className="h-40 bg-gray-50 flex items-center justify-center overflow-hidden">
                                        {record.image ? (
                                            <img
                                                src={record.image}
                                                alt={record.product}
                                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = 'https://placehold.co/300/f8fafc/64748b?text=No+Image';
                                                }}
                                            />
                                        ) : (
                                            <div className="w-16 h-16 rounded-xl bg-orange-50 flex items-center justify-center border border-orange-100 shadow-sm">
                                                <LocalShippingOutlinedIcon style={{ fontSize: 32, color: '#ea580c' }} />
                                            </div>
                                        )}
                                    </div>

                                    {/* Record Details */}
                                    <div className="p-5 flex flex-col flex-grow">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="text-xs font-bold text-orange-600 uppercase tracking-wider">{record.id}</h3>
                                                <p className="text-[11px] text-gray-400 font-medium">{record.date}</p>
                                            </div>
                                            <span className={`px-2 py-0.5 text-[11px] font-semibold rounded-full ${record.status === 'Dispatched' ? 'bg-green-100 text-green-700' :
                                                record.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-red-100 text-red-700'
                                                }`}>
                                                {record.status}
                                            </span>
                                        </div>

                                        <h2 className="text-lg font-bold text-gray-900 truncate mb-1" title={record.product}>{record.product}</h2>
                                        <p className="text-sm text-gray-600 font-medium mb-3">Customer: <span className="text-gray-800">{record.customer}</span></p>

                                        <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-50">
                                            <div>
                                                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">Quantity</p>
                                                <span className="text-lg font-black text-gray-900">{record.quantity} units</span>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">Category</p>
                                                <span className="text-xs font-bold text-gray-700 px-2 py-0.5 bg-gray-100 rounded">{record.category}</span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="grid grid-cols-2 gap-2 mt-5">
                                            <button
                                                onClick={() => handleEditClick(record)}
                                                disabled={!isAdmin}
                                                className={`p-2 rounded-lg flex items-center justify-center transition-colors border ${isAdmin ? 'bg-gray-50 hover:bg-orange-50 text-gray-600 hover:text-orange-600 border-gray-200 hover:border-orange-200 cursor-pointer' : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-60'}`}
                                                title="Edit"
                                            >
                                                <EditOutlinedIcon style={{ fontSize: 18 }} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(record)}
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

                        {/* Record Outgoing Empty Card */}
                        <button 
                            onClick={() => isAdmin && setIsAddModalOpen(true)}
                            disabled={!isAdmin}
                            className={`rounded-xl border-2 border-dashed flex flex-col items-center justify-center min-h-[400px] h-full transition-all group ${isAdmin ? 'bg-gray-50 border-gray-200 hover:bg-white hover:border-orange-300 hover:shadow-md cursor-pointer' : 'bg-gray-50/50 border-gray-200/50 cursor-not-allowed opacity-60'}`}
                        >
                            <div className={`w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-sm transition-all mb-4 ${isAdmin ? 'group-hover:scale-110 group-hover:bg-orange-600 group-hover:text-white text-gray-400' : 'text-gray-300'}`}>
                                <AddIcon style={{ fontSize: 28 }} />
                            </div>
                            <span className={`text-sm font-bold uppercase tracking-widest transition-colors ${isAdmin ? 'text-gray-500 group-hover:text-gray-900' : 'text-gray-400'}`}>Record Outgoing</span>
                        </button>
                    </div>

                    {outgoingRecords.filter(r => r.id.toLowerCase().includes(searchTerm.toLowerCase()) || r.customer.toLowerCase().includes(searchTerm.toLowerCase()) || r.product.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                            <div className="bg-gray-50 p-6 rounded-full mb-4">
                                <SearchIcon style={{ fontSize: 48, color: '#9ca3af' }} />
                            </div>
                            <p className="text-xl font-bold text-gray-800">No records found</p>
                            <p className="text-gray-500 mt-1">Try adjusting your search filters</p>
                        </div>
                    )}
                </main>
            </div>

            <AddOutgoingModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddRecord}
            />

            <EditOutgoingModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                record={selectedRecord}
                onSave={handleSaveRecord}
            />

            <DeleteOutgoingModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                outgoingId={selectedRecord?.id}
            />
        </div>
    );
};

export default Outgoing;
