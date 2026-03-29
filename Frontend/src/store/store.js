import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import productReducer from './slices/productSlice';
import categoryReducer from './slices/categorySlice';
import purchaseReducer from './slices/purchaseSlice';
import outgoingReducer from './slices/outgoingSlice';
import customerReducer from './slices/customerSlice';
import supplierReducer from './slices/supplierSlice';

const rootReducer = combineReducers({
  product: productReducer,
  category: categoryReducer,
  purchase: purchaseReducer,
  outgoing: outgoingReducer,
  customer: customerReducer,
  supplier: supplierReducer,
});

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/REGISTER'],
      },
    }),
});

export const persistor = persistStore(store);
