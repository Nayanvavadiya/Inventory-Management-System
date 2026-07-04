import { createSlice } from '@reduxjs/toolkit';
import { REHYDRATE } from 'redux-persist';

// Only valid numeric product IDs should be used for display and sequencing.
const isValidProductId = (id) => Number.isInteger(Number(id)) && Number(id) > 0 && Number(id) < 100000;

const getNextProductId = (products) => {
  const maxId = products.reduce((max, product) => {
    const id = Number(product.id);
    return isValidProductId(id) ? Math.max(max, id) : max;
  }, 0);

  return maxId + 1;
};

const normalizeProductIds = (products = []) => {
  const usedIds = new Set();
  let nextId = 1;

  return products.map((product) => {
    const id = Number(product.id);
    if (isValidProductId(id) && !usedIds.has(id)) {
      usedIds.add(id);
      return { ...product, id };
    }

    while (usedIds.has(nextId)) {
      nextId += 1;
    }

    usedIds.add(nextId);
    return { ...product, id: nextId };
  });
};
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
      state.products.push({
        ...action.payload,
        id: getNextProductId(state.products),
      });
    },
    normalizeIds: (state) => {
      state.products = normalizeProductIds(state.products);
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
  extraReducers: (builder) => {
    builder.addCase(REHYDRATE, (state, action) => {
      const incoming = action.payload?.product?.products;
      if (Array.isArray(incoming)) {
        state.products = normalizeProductIds(incoming);
      }
    });
  },
});

export const { addProduct, updateProduct, deleteProduct, normalizeIds } = productSlice.actions;
export default productSlice.reducer;
