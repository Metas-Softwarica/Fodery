import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  productId: '',
  count: 0,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setCount(state, action) {
      state.count = action.payload;
    },
    setProductId(state, action) {
      state.productId = action.payload;
    },
  },
});

export const { setCount, setProductId } = orderSlice.actions;
export const orderState = (state) => state.order;
export default orderSlice.reducer;
