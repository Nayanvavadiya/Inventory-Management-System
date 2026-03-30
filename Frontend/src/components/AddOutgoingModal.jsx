import React, { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';

const AddOutgoingModal = ({ isOpen, onClose, onAdd }) => {
    const [formData, setFormData] = useState({
        customer: '',
        product: '',
        quantity: 0,
        category: '',
        status: 'Pending'
    });

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'quantity' ? Number(value) : value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const newId = `OUT-${Math.floor(Math.random() * 900) + 100}`;
        const today = new Date().toISOString().split('T')[0];

        onAdd({ 
            ...formData,
            id: newId,
            date: today,
            image: null
        });

        setFormData({
            customer: '',
            product: '',
            quantity: 0,
            category: '',
            status: 'Pending'
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/50 transition-opacity">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50">
                    <h2 className="text-xl font-bold text-gray-800">Record Outgoing</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                        <CloseIcon />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                            <input
                                type="text"
                                name="customer"
                                value={formData.customer}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                            <input
                                type="text"
                                name="product"
                                value={formData.product}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                                required
                            />
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={formData.quantity === 0 ? '' : formData.quantity}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                                    required
                                    min="1"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all bg-white cursor-pointer"
                                >
                                    <option value="Dispatched">Dispatched</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Canceled">Canceled</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <input
                                type="text"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2.5 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow-sm transition-colors cursor-pointer"
                        >
                            Record Outgoing
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddOutgoingModal;
