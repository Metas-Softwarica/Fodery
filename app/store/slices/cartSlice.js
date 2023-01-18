import { createSlice } from '@reduxjs/toolkit';
import { removeExtraItem } from '../../services/cartService';

const initialState = {
  products: {},
  count: 0,
  coupon: {
    id: null,
    unitType: '',
    discount: 0,
  },
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    populateCart(state, action) {
      let obj = {};
      action.payload.forEach((cartItem) => {
        obj[cartItem.cart_id] = cartItem;
      });
      state.products = obj;
    },

    // TODO: Add new extra to the product
    addToCart(state, action) {
      state.count += action.payload.count;
      if (state.products[action.payload.cart_id]) {
        state.products[action.payload.cart_id].quantity += action.payload.count;
        return;
      }
      state.products[action.payload.cart_id] = action.payload;
    },

    decrementCart(state, action) {
      state.count -= action.payload.count;
      if (
        state.products[action.payload.cart_id].quantity -
          action.payload.count <=
        0
      ) {
        delete state.products[action.payload.cart_id];
        return;
      }
      state.products[action.payload.cart_id].quantity -= action.payload.count;
    },

    updateCoupon(state, action) {
      state.coupon = {
        ...action.payload,
      };
    },

    deleteCartItem(state, action) {
      delete state.products[action.payload.cart_id];
      state.count -= action.payload.quantity;
    },

    emptyCart(state, action) {
      state.count = 0;
      state.products = {};
      state.coupon = {
        id: null,
        unitType: '',
        discount: 0,
      };
    },

    loadCount(state, action) {
      state.count = action.payload;
    },

    updateCount(state, action) {
      state.count += action.payload;
    },

    removeExtras(state, action) {
      let extras = state.products[action.payload.cart_id].extra;
      let newExtras = removeExtraItem(extras, action.payload.extra_id);
      state.products[action.payload.cart_id].extra = newExtras;
    },
  },
});

export const {
  addToCart,
  decrementCart,
  emptyCart,
  updateCoupon,
  deleteCartItem,
  populateCart,
  loadCount,
  updateCount,
  removeExtras,
} = cartSlice.actions;
export const cartState = (state) => state.cart;
export default cartSlice.reducer;
