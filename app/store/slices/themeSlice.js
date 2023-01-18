import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice } from '@reduxjs/toolkit';
import { darkColors, lightColors } from '../../configs/colors';

const initialState = {
  theme: 'dark',
  colors: darkColors,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    switchTheme(state, action) {
      if (state.theme === 'light') {
        state.colors = darkColors;
        state.theme = 'dark';
        AsyncStorage.setItem('theme', 'dark');
      } else {
        state.colors = lightColors;
        state.theme = 'light';
        AsyncStorage.setItem('theme', 'light');
      }
    },
    setInitialTheme(state, action) {
      if (action.payload === 'dark') {
        state.colors = darkColors;
        state.theme = 'dark';
      } else {
        state.colors = lightColors;
        state.theme = 'light';
      }
    },
  },
});

export const { switchTheme, setInitialTheme } = themeSlice.actions;
export const themeState = (state) => state.theme;
export default themeSlice.reducer;
