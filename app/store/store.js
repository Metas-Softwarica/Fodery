import { configureStore } from '@reduxjs/toolkit';

import orderSlice from '../store/slices/orderSlice';
import recommendationSlice from '../store/slices/recommendationSlice';
import cartSlice from './slices/cartSlice';
import checkoutSlice from './slices/checkoutSlice';
import themeSlice from './slices/themeSlice';
import userSlice from './slices/userSlice';

export const store = configureStore({
  reducer: {
    recommendations: recommendationSlice,
    orders: orderSlice,
    cart: cartSlice,
    users: userSlice,
    theme: themeSlice,
    checkout: checkoutSlice,
  },
});
