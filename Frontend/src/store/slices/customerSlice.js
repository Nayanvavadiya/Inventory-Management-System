import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  customers: [
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+1 234 567 8900', status: 'Active', orders: 15 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+1 987 654 3210', status: 'Active', orders: 8 },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', phone: '+1 456 789 0123', status: 'Inactive', orders: 2 },
    { id: 4, name: 'Alice Williams', email: 'alice@example.com', phone: '+1 321 654 0987', status: 'Active', orders: 24 },
    { id: 5, name: 'Charlie Brown', email: 'charlie@example.com', phone: '+1 654 321 9876', status: 'Active', orders: 5 },
  ],
};

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    addCustomer: (state, action) => {
      state.customers.push(action.payload);
    },
    updateCustomer: (state, action) => {
      const index = state.customers.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.customers[index] = action.payload;
      }
    },
    deleteCustomer: (state, action) => {
      state.customers = state.customers.filter(c => c.id !== action.payload);
    },
  },
});

export const { addCustomer, updateCustomer, deleteCustomer } = customerSlice.actions;
export default customerSlice.reducer;
