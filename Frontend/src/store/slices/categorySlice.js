import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  categories: [
    { id: 1, name: 'Electronics', description: 'Phones, laptops, tablets and other electronic devices', status: 'Active' },
    { id: 2, name: 'Furniture', description: 'Office and warehouse furniture items', status: 'Active' },
    { id: 3, name: 'Raw Materials', description: 'Steel, wood, plastic and other raw materials', status: 'Inactive' },
    { id: 4, name: 'Packaging', description: 'Boxes, tape, bubble wrap and shipping supplies', status: 'Active' },
    { id: 5, name: 'Tools', description: 'Hand tools, power tools and maintenance equipment', status: 'Active' },
    { id: 6, name: 'Safety Gear', description: 'Helmets, gloves, vests and safety equipment', status: 'Active' },
    { id: 7, name: 'Office Supplies', description: 'Stationery, notebooks, pens, folders, printing paper', status: 'Active' },
    { id: 8, name: 'Appliances', description: 'Refrigerators, microwaves, washing machines, air conditioners', status: 'Inactive' },
  ],
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    addCategory: (state, action) => {
      state.categories.push(action.payload);
    },
    updateCategory: (state, action) => {
      const index = state.categories.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.categories[index] = action.payload;
      }
    },
    deleteCategory: (state, action) => {
      state.categories = state.categories.filter(c => c.id !== action.payload);
    },
  },
});

export const { addCategory, updateCategory, deleteCategory } = categorySlice.actions;
export default categorySlice.reducer;
