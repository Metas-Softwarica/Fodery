import { registerRootComponent } from 'expo';
import React from 'react';
import 'react-native-gesture-handler';
// import './app/configs/ignoreWarnings';

import { Provider } from 'react-redux';
import App from './App';
import AxiosProvider from './app/contexts/axios-context';
import { store } from './app/store/store';

function AppProvider() {
  return (
    <Provider store={store}>
      <AxiosProvider>
        <App />
      </AxiosProvider>
    </Provider>
  );
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(AppProvider);
