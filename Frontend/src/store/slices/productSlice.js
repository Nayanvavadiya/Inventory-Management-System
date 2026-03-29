import { createSlice } from '@reduxjs/toolkit';

// Import fallback images conceptually, but in Redux we usually store paths or base64. 
// For this app, the paths were imported directly in Product.jsx. 
// We will store just a string representing the image source or an empty string and handle imports there if needed.
// Based on product.jsx, it uses image variables. We'll store string paths or identifiers, but to keep it simple, we can just use the previous raw objects without actual File imports in Redux, or rely on URL paths.
// But wait, the previous code imported images (e.g. MacBookImg). We can't put imported variables in Redux state easily because they are modules.
// For now, we omit the raw image strings from initial state or use placeholders. The user can continue uploading in the future.
// But actually, we need to keep the UI looking exactly the same. So we can just put a placeholder path or we can use the same import in Product.jsx.
// Because it's Redux, we should store serializable values. For initial state, we'll store specific string identifiers and map them in the component.

const initialState = {
  products: [
    { id: 1, name: 'MacBook Pro 16"', desc: 'Apple M3 Pro, 18GB RAM, 512GB SSD', price: '₹80,000', qty: 14, status: 'In Stock', category: 'Electronics', imageId: 'macbook' },
    { id: 2, name: 'Standing Desk', desc: 'Electric height-adjustable standing desk, 60x30 inches', price: '₹25,000', qty: 8, status: 'Low Stock', category: 'Furniture', imageId: 'standingdesk' },
    { id: 3, name: 'Steel Beams (Bundle)', desc: 'I-beam structural steel, 12ft length, pack of 10', price: '₹8,000', qty: 15, status: 'In Stock', category: 'Raw Materials', imageId: 'steelbeams' },
    { id: 4, name: 'Shipping Box Large', desc: 'Corrugated cardboard box, 24x18x18 inches', price: '₹3500', qty: 0, status: 'Out of Stock', category: 'Packaging', imageId: 'shippingbox' },
    { id: 5, name: 'Cordless Drill', desc: '20V MAX cordless drill/driver with battery', price: '₹2000', qty: 15, status: 'In Stock', category: 'Tools', imageId: 'drill' },
    { id: 6, name: 'Safety Helmet', desc: 'OSHA-compliant hard hat with adjustable suspension', price: '₹499', qty: 5, status: 'Low Stock', category: 'Safety Gear', imageId: 'helmet' },
    { id: 7, name: 'USB-C Hub', desc: '7-in-1 USB-C hub with HDMI, USB 3.0, SD card reader', price: '₹850', qty: 42, status: 'In Stock', category: 'Electronics', imageId: 'usbc' },
    { id: 8, name: 'Bubble Wrap Roll', desc: 'Large bubble wrap, 12" x 175ft perforated roll', price: '₹24', qty: 33, status: 'In Stock', category: 'Packaging', imageId: 'bubblewrap' },
  ],
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    addProduct: (state, action) => {
      state.products.push(action.payload);
    },
    updateProduct: (state, action) => {
      const index = state.products.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },
    deleteProduct: (state, action) => {
      state.products = state.products.filter(p => p.id !== action.payload);
    },
  },
});

export const { addProduct, updateProduct, deleteProduct } = productSlice.actions;
export default productSlice.reducer;
