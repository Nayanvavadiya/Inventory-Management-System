import { createSlice } from '@reduxjs/toolkit';
import MacBookImg from '../../Images/Outgoing_image/MacBook Pro 16.jpeg';
import StandingDeskImg from '../../Images/Outgoing_image/Standing Desk.webp';
import SteelBeamsImg from '../../Images/Outgoing_image/Steel Beams (Bundle).jpeg';
import CordlessDrillImg from '../../Images/Outgoing_image/Cordless Drill.jpg';
import SafetyHelmetImg from '../../Images/Outgoing_image/Safety Helmet.avif';

const initialState = {
  outgoingRecords: [
    { id: 'OUT-001', date: '2026-03-15', customer: 'John Doe', product: 'MacBook Pro 16"', quantity: 2, status: 'Dispatched', category: 'Electronics', image: MacBookImg },
    { id: 'OUT-002', date: '2026-03-16', customer: 'Jane Smith', product: 'Standing Desk', quantity: 1, status: 'Pending', category: 'Furniture', image: StandingDeskImg },
    { id: 'OUT-003', date: '2026-03-17', customer: 'Bob Johnson', product: 'Steel Beams', quantity: 10, status: 'Dispatched', category: 'Raw Materials', image: SteelBeamsImg },
    { id: 'OUT-004', date: '2026-03-17', customer: 'Alice Williams', product: 'Cordless Drill', quantity: 3, status: 'Dispatched', category: 'Tools', image: CordlessDrillImg },
    { id: 'OUT-005', date: '2026-03-17', customer: 'Charlie Brown', product: 'Safety Helmet', quantity: 5, status: 'Canceled', category: 'Safety Gear', image: SafetyHelmetImg },
  ],
};

const outgoingSlice = createSlice({
  name: 'outgoing',
  initialState,
  reducers: {
    addOutgoing: (state, action) => {
      state.outgoingRecords.push(action.payload);
    },
    updateOutgoing: (state, action) => {
      const index = state.outgoingRecords.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        state.outgoingRecords[index] = action.payload;
      }
    },
    deleteOutgoing: (state, action) => {
      state.outgoingRecords = state.outgoingRecords.filter(r => r.id !== action.payload);
    },
  },
});

export const { addOutgoing, updateOutgoing, deleteOutgoing } = outgoingSlice.actions;
export default outgoingSlice.reducer;
