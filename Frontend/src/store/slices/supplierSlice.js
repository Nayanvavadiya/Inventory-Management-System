import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  suppliers: [
    { id: 1, name: 'Tech Solutions Inc.', contactPerson: 'Alice Johnson', email: 'alice@techsolutions.com', phone: '+1 555-0101', category: 'Electronics', status: 'Active' },
    { id: 2, name: 'Global LogisticsCo', contactPerson: 'Bob Miller', email: 'bob@globallogistics.com', phone: '+1 555-0102', category: 'Shipping', status: 'Active' },
    { id: 3, name: 'Office Depot X', contactPerson: 'Charlie Davis', email: 'charlie@officedepotx.com', phone: '+1 555-0103', category: 'Supplies', status: 'Inactive' },
    { id: 4, name: 'EcoFriendly Packaging', contactPerson: 'Diana Prince', email: 'diana@ecopack.com', phone: '+1 555-0104', category: 'Packaging', status: 'Active' },
    { id: 5, name: 'Premium Raw Materials', contactPerson: 'Edward Norton', email: 'edward@premiumraw.com', phone: '+1 555-0105', category: 'Manufacturing', status: 'Active' },
  ],
};

const supplierSlice = createSlice({
  name: 'supplier',
  initialState,
  reducers: {
    addSupplier: (state, action) => {
      state.suppliers.push(action.payload);
    },
    updateSupplier: (state, action) => {
      const index = state.suppliers.findIndex(s => s.id === action.payload.id);
      if (index !== -1) {
        state.suppliers[index] = action.payload;
      }
    },
    deleteSupplier: (state, action) => {
      state.suppliers = state.suppliers.filter(s => s.id !== action.payload);
    },
  },
});

export const { addSupplier, updateSupplier, deleteSupplier } = supplierSlice.actions;
export default supplierSlice.reducer;
