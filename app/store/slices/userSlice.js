import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  username: '',
  email: '',
  tokens: null,
  phoneVerified: 0,
  passwordReset: false,
  newAddress: {
    initialRegion: {
      latitude: 27.7020407,
      longitude: 85.3129003,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
    marker: null,
  },
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setToken(state, action) {
      state.tokens = action.payload;
    },
    setPhoneStatus(state, action) {
      state.phoneVerified = action.payload;
    },
    removeToken(state) {
      state.tokens = null;
      state.username = '';
      state.email = '';
      state.phoneVerified = 0;
      state.passwordReset = false;
    },
    setPasswordState(state, action) {
      state.passwordReset = action.payload;
    },
    setNewAddress(state, action) {
      state.newAddress = action.payload;
    },
  },
});

export const {
  setToken,
  removeToken,
  setPhoneStatus,
  setPasswordState,
  setNewAddress,
} = userSlice.actions;
export const userState = (state) => state.users;
export default userSlice.reducer;
