import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  shipping: {
    deliveryAddress: null,
    differentAddress: false,
    fullName: '',
    companyName: '',
    state: '',
    city: '',
    streetAddress: '',
    zip: '',
    phone: '',
    label: '',
    additionalInfo: '',
  },
  payment: {
    cod: true,
  },
};

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    updateShipping(state, action) {
      state.shipping = { ...state.shipping, ...action.payload };
    },
    updatePayment(state, action) {
      state.payment.cod = action.payload;
    },
  },
});

export const { updatePayment, updateShipping } = checkoutSlice.actions;
export const checkoutState = (state) => state.checkout;
export default checkoutSlice.reducer;
