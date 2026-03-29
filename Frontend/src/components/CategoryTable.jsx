import React, { useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddBoxIcon from '@mui/icons-material/AddBox';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';

import { useSelector, useDispatch } from 'react-redux';
import { updateCategory, deleteCategory, addCategory } from '../store/slices/categorySlice';
import EditCategoryModal from './EditCategoryModal';
import DeleteCategoryModal from './DeleteCategoryModal';
import AddCategoryModal from './AddCategoryModal';

const CategoryTable = () => {
    const categories = useSelector((state) => state.category.categories);
    const dispatch = useDispatch();
    const [searchQuery, setSearchQuery] = useState('');

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const user = JSON.parse(localStorage.getItem('user')) || {};
    const isAdmin = user.role === 'Admin';

    const filteredCategories = categories.filter((category) =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.id.toString().includes(searchQuery)
    );

    const handleEditClick = (category) => {
        if (!isAdmin) return;
        setSelectedCategory(category);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (category) => {
        if (!isAdmin) return;
        setSelectedCategory(category);
        setIsDeleteModalOpen(true);
    };

    const handleSaveCategory = (updatedCategory) => {
        dispatch(updateCategory(updatedCategory));
    };

    const handleConfirmDelete = () => {
        if (selectedCategory) {
            dispatch(deleteCategory(selectedCategory.id));
            setIsDeleteModalOpen(false);
            setSelectedCategory(null);
        }
    };

    const handleAddCategory = (newCategory) => {
        dispatch(addCategory(newCategory));
    };

    return (
        <div className="bg-white rounded-lg shadow-md">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-lg">
                <h2 className="text-xl font-semibold text-gray-700">List of Categories</h2>
                <button
                    onClick={() => isAdmin && setIsAddModalOpen(true)}
                    disabled={!isAdmin}
                    className={`${isAdmin ? 'bg-green-600 hover:bg-green-700 cursor-pointer' : 'bg-green-300 cursor-not-allowed opacity-60'} text-white px-4 py-2 rounded-md flex items-center text-sm font-medium transition-colors`}
                >
                    <AddBoxIcon style={{ fontSize: 18, marginRight: 6 }} /> Add Category
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
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
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
                            <th className="p-4 cursor-pointer hover:bg-gray-200">Description <UnfoldMoreIcon style={{ fontSize: 14, color: '#999' }} /></th>
                            <th className="p-4 cursor-pointer hover:bg-gray-200">Status <UnfoldMoreIcon style={{ fontSize: 14, color: '#999' }} /></th>
                            <th className="p-4 cursor-pointer hover:bg-gray-200">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm">
                        {filteredCategories.map((category) => (
                            <tr key={category.id} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="p-4">{category.id}</td>
                                <td className="p-4 font-medium text-gray-800">{category.name}</td>
                                <td className="p-4">{category.description}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${category.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {category.status}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEditClick(category)}
                                            disabled={!isAdmin}
                                            className={`${isAdmin ? 'bg-blue-500 hover:bg-blue-600 cursor-pointer' : 'bg-blue-300 cursor-not-allowed opacity-60'} text-white px-3 py-1 rounded text-xs flex items-center transition-colors`}
                                        >
                                            <EditIcon style={{ fontSize: 14, marginRight: 4 }} /> Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(category)}
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
                <div>Showing {filteredCategories.length > 0 ? 1 : 0} to {filteredCategories.length} of {categories.length} entries</div>
                <div className="flex space-x-1">x
                    <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50" disabled>Previous</button>
                    <button className="px-3 py-1 bg-blue-600 text-white border border-blue-600 rounded">1</button>
                    <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50" disabled>Next</button>
                </div>
            </div>

            <EditCategoryModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                category={selectedCategory}
                onSave={handleSaveCategory}
            />

            <DeleteCategoryModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                categoryName={selectedCategory?.name}
            />

            <AddCategoryModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={handleAddCategory}
            />
        </div>
    );
};

export default CategoryTable;
