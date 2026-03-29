import { createSlice } from '@reduxjs/toolkit';
import LaptopsImg from '../../Images/Purchase_Image/High-End Laptops.webp';
import PalletsImg from '../../Images/Purchase_Image/Shipping Pallets.jpeg';
import ChairsImg from '../../Images/Purchase_Image/Ergonomic Chairs.webp';
import BoxesImg from '../../Images/Purchase_Image/Recycled Boxes.webp';
import AluminumImg from '../../Images/Purchase_Image/Aluminum Sheets.jpg';

const initialState = {
  purchases: [
    { id: 'PUR-001', date: '2026-03-15', supplier: 'Tech Solutions Inc.', product: 'High-End Laptops', quantity: 10, totalAmount: 190000, status: 'Completed', category: 'Electronics', image: LaptopsImg },
    { id: 'PUR-002', date: '2026-03-16', supplier: 'Global LogisticsCo', product: 'Shipping Pallets', quantity: 50, totalAmount: 4000, status: 'Pending', category: 'Shipping', image: PalletsImg },
    { id: 'PUR-003', date: '2026-03-17', supplier: 'Office Depot X', product: 'Ergonomic Chairs', quantity: 5, totalAmount: 7500, status: 'Completed', category: 'Supplies', image: ChairsImg },
    { id: 'PUR-004', date: '2026-03-17', supplier: 'EcoFriendly Packaging', product: 'Recycled Boxes', quantity: 200, totalAmount: 2000, status: 'Shipped', category: 'Packaging', image: BoxesImg },
    { id: 'PUR-005', date: '2026-03-17', supplier: 'Premium Raw Materials', product: 'Aluminum Sheets', quantity: 1000, totalAmount: 50000, status: 'Completed', category: 'Manufacturing', image: AluminumImg },
  ],
};

const purchaseSlice = createSlice({
  name: 'purchase',
  initialState,
  reducers: {
    addPurchase: (state, action) => {
      state.purchases.push(action.payload);
    },
    updatePurchase: (state, action) => {
      const index = state.purchases.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.purchases[index] = action.payload;
      }
    },
    deletePurchase: (state, action) => {
      state.purchases = state.purchases.filter(p => p.id !== action.payload);
    },
  },
});

export const { addPurchase, updatePurchase, deletePurchase } = purchaseSlice.actions;
export default purchaseSlice.reducer;
