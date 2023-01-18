import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import axios from 'axios';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import * as PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { Pressable } from 'react-native';
import { Icon } from 'react-native-eva-icons';
import FlashMessage from 'react-native-flash-message';
import { useDispatch, useSelector } from 'react-redux';
import { fontImports } from './app/configs/commonStyles';
import { constants } from './app/configs/constants';
import AppStack from './app/navigation/AppStack';
import { isFirstOpen } from './app/services/appService';
import { checkToken } from './app/services/authService';
import { setInitialTheme, themeState } from './app/store/slices/themeSlice';
import {
  setPhoneStatus,
  setToken,
  userState,
} from './app/store/slices/userSlice';

SplashScreen.preventAutoHideAsync();

const firstOpen = { loading: -1, no: 0, yes: 1 };
function BackButton(props) {
  return (
    <Pressable onPress={props.onPress}>
      <Icon name="chevron-left-outline" fill="#000" width={30} height={30} />
    </Pressable>
  );
}

BackButton.propTypes = { onPress: PropTypes.func };

export default function App() {
  let [fontsLoaded] = useFonts(fontImports);
  const selector = useSelector(userState);
  const dispatch = useDispatch();
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [appIsReady, setAppIsReady] = useState(false);
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(firstOpen.loading);
  const [themeLoading, setThemeLoading] = useState(true);

  const colors = useSelector(themeState).colors;

  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: colors.backgroundColor,
    },
  };

  const asyncFunction1 = async () => {
    const firstOpened = await isFirstOpen();

    if (firstOpened) {
      setShowWelcomeScreen(firstOpen.yes);
    } else {
      setShowWelcomeScreen(firstOpen.no);
    }
    let res = await checkToken();
    if (res) {
      dispatch(setToken(res));
    }
  };

  useEffect(() => {
    asyncFunction1();
  }, []);

  useEffect(() => {
    if (selector.tokens) {
      setPhoneLoading(true);
      axios
        .get(constants.baseURL + 'user/check_phone_verification', {
          headers: {
            token: selector.tokens.access_token,
          },
        })
        .then((res) => {
          dispatch(setPhoneStatus(1));
        })
        .catch((err) => {
          Auth;
          if (err.response.status === 901) {
            dispatch(setPhoneStatus(0));
            return;
          }
          dispatch(setPhoneStatus(-1));
        })
        .finally(() => {
          setPhoneLoading(false);
        });
    }
  }, [selector.tokens]);

  const asyncFunction2 = async () => {
    const value = await AsyncStorage.getItem('theme');
    setThemeLoading(false);
    if (value !== null) {
      dispatch(setInitialTheme(value));
    } else {
      dispatch(setInitialTheme('dark'));
    }
  };

  useEffect(() => {
    asyncFunction2();
    if (
      !fontsLoaded ||
      showWelcomeScreen === firstOpen.loading ||
      phoneLoading ||
      themeLoading
    ) {
      setAppIsReady(true);
    }
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      console.log('here');
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <>
      <NavigationContainer theme={MyTheme} onReady={onLayoutRootView}>
        <BottomSheetModalProvider>
          <AppStack
            firstOpen={firstOpen}
            selector={selector}
            showWelcomeScreen={showWelcomeScreen}
          />
        </BottomSheetModalProvider>
      </NavigationContainer>
      <FlashMessage
        position="bottom"
        style={{ position: 'absolute', bottom: 0, width: '100%' }}
      />
    </>
  );
}
