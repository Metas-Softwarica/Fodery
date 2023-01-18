import Constants from 'expo-constants';
import * as Linking from 'expo-linking';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  BackHandler,
  Dimensions,
  Easing,
  Image,
  Keyboard,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { Icon } from 'react-native-eva-icons';
import { ScrollView } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { SignInForm } from '../../components/auth/SignInForm';
import { SignUpForm } from '../../components/auth/SignUpForm';
import ButtonRipple from '../../components/inputs/buttons/ButtonRipple';
import { fonts } from '../../configs/commonStyles';
import { constraints } from '../../configs/constants';
import { utilStyles } from '../../configs/utilStyles';
import { useKeyboard } from '../../hooks/useKeyboard';
import { secureStoreToken } from '../../services/authService';
import { switchTheme, themeState } from '../../store/slices/themeSlice';
import { setToken, userState } from '../../store/slices/userSlice';

const formTypes = { signIn: 1, signUp: 2 };
export default function AuthScreen({ navigation, route }) {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor="transparent" style="dark" />
      <SlidingComponent props={route.params} />
    </View>
  );
}

function SlidingComponent({ props }) {
  const [welcomeCardHeight, setWelcomeCardHeight] = useState(0);
  const [formType, setFormType] = useState(formTypes.signIn);
  const views = { welcome: 1, signInOrUp: 2, verification: 3 };
  const { height, width } = useWindowDimensions();
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [currView, setCurrView] = useState(views.welcome);
  const authSelector = useSelector(userState);
  const dispatch = useDispatch();
  const theme = useSelector(themeState).theme;

  useEffect(() => {
    if (theme === 'light') {
      dispatch(switchTheme());
    }
    if (props != null) {
      if (props.page == 1) {
        startAnimation(1);
        setFormType(1);
      }
    } else if (authSelector.tokens && authSelector.phoneVerified === 0) {
      startAnimation(3);
    }
  }, []);

  const startAnimation = (toValue) => {
    Animated.timing(animatedValue, {
      toValue: toValue,
      duration: 250,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(() => updateViewRecord(toValue));
  };

  function updateViewRecord(animatedValue) {
    if (animatedValue === 0) {
      setCurrView(views.welcome);
    } else if (animatedValue === 1) {
      setCurrView(views.signInOrUp);
    } else {
      setCurrView(views.verification);
    }
  }
  const STATUSBAR_HEIGHT = Constants.statusBarHeight;

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [
      STATUSBAR_HEIGHT != 24 ? STATUSBAR_HEIGHT : 0,
      -(Dimensions.get('window').height - STATUSBAR_HEIGHT),
      -2 * Dimensions.get('window').height + STATUSBAR_HEIGHT,
    ],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      function () {
        Keyboard.dismiss();

        if (currView === views.welcome) {
          return false;
        }
        if (currView === views.signInOrUp) startAnimation(0);
        if (currView === views.verification) startAnimation(1);
        return true;
      }
    );
    return () => backHandler.remove();
  }, [currView]);

  return (
    <Animated.View
      style={{
        transform: [{ translateY: translateY }],
      }}
    >
      <Image
        source={require('../../../assets/starter_screen_background.jpg')}
        style={{
          height: height - welcomeCardHeight + 32,
          width: width,
          alignSelf: 'center',
          resizeMode: 'cover',
        }}
      />
      <View
        style={{
          height: height - welcomeCardHeight + 32,
          width: width,
          position: 'absolute',
          top: 1,
          backgroundColor: '#333333',
          marginTop: -3,
          opacity: 0.8,
          ...utilStyles.centerXY,
        }}
      >
        <Image
          source={require('../../../assets/logo.png')}
          style={{ height: 150, width: 150, resizeMode: 'contain' }}
        />
      </View>

      <Welcome
        onLayout={(event) => {
          setWelcomeCardHeight(event.nativeEvent.layout.height);
        }}
        onLogInPress={() => {
          startAnimation(1);
          setFormType(formTypes.signIn);
        }}
        onSignUpPress={() => {
          startAnimation(1);
          setFormType(formTypes.signUp);
        }}
      />
      <Content
        onBackPress={() => startAnimation(0)}
        onNextPress={() => startAnimation(2)}
        formType={formType}
        setFormType={setFormType}
        startAnimation={startAnimation}
      />
    </Animated.View>
  );
}

function Welcome({ onLayout, onLogInPress, onSignUpPress }) {
  const colors = useSelector(themeState).colors;
  const dispatch = useDispatch();
  const { height, width } = useWindowDimensions();

  const handleRedirect = (event) => {
    let data = Linking.parse(event.url);
    dispatch(setToken(data.queryParams));
    secureStoreToken(data.queryParams);
  };

  const addLinkingListener = () => {
    Linking.addEventListener('url', handleRedirect);
  };

  const buttonStyle = StyleSheet.create({
    style: {
      backgroundColor: 'white',
      paddingHorizontal: 34,
      height: 44,
    },
    text: {
      ...fonts.semiBold,
      color: 'black',
      fontSize: 14,
    },
  });

  return (
    <View
      style={{
        marginTop: -32,
        backgroundColor: colors.accentColor,
        borderTopStartRadius: 24,
        borderTopEndRadius: 24,
        paddingTop: 32,
        overflow: 'hidden',
        height: Platform.OS === 'ios' ? 300 : null,
      }}
      onLayout={onLayout}
    >
      {/* <Image
        borderTopEndRadius={24}
        borderTopStartRadius={24}
        style={{
          width: "100%",
          height: "100%",
          resizeMode: "cover",
          position: "absolute",
          top: 0
        }}
        source={require("../../../assets/pattern_backgroud.png")}
      /> */}
      <View style={{ paddingHorizontal: 20 }}>
        <Text style={{ ...fonts.extraBold, fontSize: 22, marginBottom: 8 }}>
          {'Welcome\nto fodery!'}
        </Text>

        <Text style={{ ...fonts.regular }}>
          Fodery makes it incredibly easy to discover and get great foods and
          deals you might need delivered in your city.
        </Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 52,
            justifyContent: 'space-evenly',
            paddingVertical: 12,
            maxWidth: 360,
            width: width,
          }}
        >
          <ButtonRipple
            title="Login"
            containerStyle={{ elevation: 6 }}
            rippleColor={colors.GreyRegular}
            style={buttonStyle.style}
            textStyle={buttonStyle.text}
            onPress={onLogInPress}
          />
          {/* <Gap x={12} /> */}

          <ButtonRipple
            title="Sign Up"
            containerStyle={{ elevation: 6 }}
            style={{ ...buttonStyle.style, backgroundColor: colors.black }}
            textStyle={{ ...buttonStyle.text, color: 'white' }}
            onPress={onSignUpPress}
          />
        </View>
      </View>
    </View>
  );
}

export function Content({
  onBackPress,
  onNextPress,
  formType,
  setFormType,
  startAnimation,
}) {
  const [signInCardHeight, setSignInCardHeight] = useState(0);
  const colors = useSelector(themeState).colors;
  const { height, width } = useWindowDimensions();
  const keyboardHeight = useKeyboard();
  const STATUSBAR_HEIGHT = Constants.statusBarHeight;
  return (
    <View
      style={{
        backgroundColor: colors.accentColor,
      }}
    >
      <View
        style={{
          backgroundColor: colors.accentColor,
          height:
            keyboardHeight == 0
              ? height
              : height - keyboardHeight - STATUSBAR_HEIGHT,
          marginBottom: keyboardHeight,
        }}
      >
        <ScrollView>
          <StatusBar backgroundColor={colors.black} />
          <View
            style={{ paddingBottom: 8, position: 'relative' }}
            onLayout={(event) => {
              setSignInCardHeight(event.nativeEvent.layout.height);
            }}
          >
            {/* <Image
              style={{
                width: "100%",
                height: "100%",
                resizeMode: "cover",
                position: "absolute",
                top: 0
              }}
              source={require("../../../assets/pattern_backgroud.png")}
            /> */}

            <TouchableOpacity
              onPress={onBackPress}
              style={{
                paddingHorizontal: 14,
                paddingVertical: STATUSBAR_HEIGHT,
                width: 32,
              }}
            >
              <Icon name="arrow-ios-back" fill="black" width={32} height={32} />
            </TouchableOpacity>

            <Text
              style={{
                ...fonts.black,
                fontSize: 18,
                paddingHorizontal: 32,
              }}
            >
              {formType === formTypes.signIn ? 'Sign In' : 'Sign Up'}
            </Text>
            <Text
              style={{
                ...fonts.regular,
                paddingHorizontal: 32,
                paddingTop: 8,
                fontSize: constraints.captionPrimaryFontSize,
                marginVertical: 8,
                lineHeight: 14,
              }}
            >
              {formType === formTypes.signIn
                ? 'Login to your account, we waiting to serve you.'
                : 'Create a free account. It will only take a minute.'}
            </Text>
          </View>

          {formType === formTypes.signIn ? (
            <SignInForm
              signInCardHeight={signInCardHeight}
              onSignIn={onNextPress}
              onSignUp={() => setFormType(formTypes.signUp)}
              startAnimation={startAnimation}
            />
          ) : (
            <SignUpForm
              signInCardHeight={signInCardHeight}
              onSignUp={onNextPress}
              onSignIn={() => setFormType(formTypes.signIn)}
              startAnimation={startAnimation}
            />
          )}
        </ScrollView>
      </View>
      <View style={{ height: height, backgroundColor: colors.accentColor }}>
        {/* <VerifyPhone /> */}
      </View>
    </View>
  );
}
