import { StyleSheet } from 'react-native';
import { colors } from './colors';
import { constraints } from './constants';

export const formStyles = StyleSheet.create({
  parentWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  textWrapper: {
    width: '100%',
    paddingHorizontal: 20,
    maxWidth: 450,
    marginTop: 40,
  },
  signIn: {
    color: colors.primary,
    fontSize: 25,
    marginBottom: 5,
  },
  desc: {
    // TODO
  },
  inputWrapper: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 60,
  },
  innerInputWrapper: {
    width: '100%',
    maxWidth: 450,
    paddingHorizontal: 20,
  },
  forgotWrapper: {
    width: '100%',
    maxWidth: 450,
    display: 'flex',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
  },
  forgotText: {
    color: 'skyblue',
  },
  button: {
    maxWidth: 450,
    marginTop: 30,
  },
  signUpWrapper: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 15,
  },
  signupBtn: {
    marginLeft: 5,
    color: 'blue',
  },
  terms: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 20,
  },
});

export const fonts = {
  poppinsBold: {
    fontFamily: 'Poppins_Bold',
  },
  poppinsRegular: {
    fontFamily: 'Poppins_Regular',
  },
  poppinsLight: {
    fontFamily: 'Poppins_Light',
  },
  montserratRegular: {
    fontFamily: 'Montserrat_Regular',
  },
  montserratLight: {
    fontFamily: 'Montserrat_Light',
  },
  black: {
    fontFamily: 'black',
  },
  blackItalic: {
    fontFamily: 'blackItalic',
  },
  bold: {
    fontFamily: 'bold',
  },
  boldItalic: {
    fontFamily: 'boldItalic',
  },
  extraBold: {
    fontFamily: 'extraBold',
  },
  extraBoldItalic: {
    fontFamily: 'extraBoldItalic',
  },
  heavy: {
    fontFamily: 'heavy',
  },
  heavyItalic: {
    fontFamily: 'heavyItalic',
  },
  light: {
    fontFamily: 'light',
  },
  lightItalic: {
    fontFamily: 'lightItalic',
  },
  medium: {
    fontFamily: 'medium',
  },
  mediumItalic: {
    fontFamily: 'mediumItalic',
  },
  regular: {
    fontFamily: 'regular',
  },
  regularItalic: {
    fontFamily: 'regularItalic',
  },
  semiBold: {
    fontFamily: 'semiBold',
  },
  semiBoldItalic: {
    fontFamily: 'semiBoldItalic',
  },
  thin: {
    fontFamily: 'thin',
  },
  thinItalic: {
    fontFamily: 'thinItalic',
  },
  ultraLight: {
    fontFamily: 'ultraLight',
  },
  ultraLightItalic: {
    fontFamily: 'ultraLightItalic',
  },
};

export const fontImports = {
  Poppins_Bold: require('../../assets/fonts/Poppins-Bold.ttf'),
  Poppins_Regular: require('../../assets/fonts/Poppins-Regular.ttf'),
  Poppins_Light: require('../../assets/fonts/Poppins-Light.ttf'),
  Montserrat_Regular: require('../../assets/fonts/Montserrat-Regular.ttf'),
  Montserrat_Light: require('../../assets/fonts/Montserrat-Light.ttf'),

  black: require('../../assets/fonts/gilroy/Gilroy-Black.ttf'),
  blackItalic: require('../../assets/fonts/gilroy/Gilroy-BlackItalic.ttf'),
  bold: require('../../assets/fonts/gilroy/Gilroy-Bold.ttf'),
  boldItalic: require('../../assets/fonts/gilroy/Gilroy-BoldItalic.ttf'),
  extraBold: require('../../assets/fonts/gilroy/GilroyExtraBold.ttf'),
  extraBoldItalic: require('../../assets/fonts/gilroy/Gilroy-ExtraBoldItalic.ttf'),
  heavy: require('../../assets/fonts/gilroy/Gilroy-Heavy.ttf'),
  heavyItalic: require('../../assets/fonts/gilroy/Gilroy-HeavyItalic.ttf'),
  light: require('../../assets/fonts/gilroy/Gilroy-Light.ttf'),
  lightItalic: require('../../assets/fonts/gilroy/Gilroy-LightItalic.ttf'),
  medium: require('../../assets/fonts/gilroy/Gilroy-Medium.ttf'),
  mediumItalic: require('../../assets/fonts/gilroy/Gilroy-MediumItalic.ttf'),
  regular: require('../../assets/fonts/gilroy/Gilroy-Regular.ttf'),
  regularItalic: require('../../assets/fonts/gilroy/Gilroy-RegularItalic.ttf'),
  semiBold: require('../../assets/fonts/gilroy/Gilroy-SemiBold.ttf'),
  semiBoldItalic: require('../../assets/fonts/gilroy/Gilroy-SemiBoldItalic.ttf'),
  thin: require('../../assets/fonts/gilroy/Gilroy-Thin.ttf'),
  thinItalic: require('../../assets/fonts/gilroy/Gilroy-ThinItalic.ttf'),
  ultraLight: require('../../assets/fonts/gilroy/Gilroy-UltraLight.ttf'),
  ultraLightItalic: require('../../assets/fonts/gilroy/Gilroy-UltraLightItalic.ttf'),
};

export function homeCardStyle(colors) {
  return StyleSheet.create([
    {
      backgroundColor: colors.cardColor,
      flex: 1,
      marginHorizontal: constraints.screenPaddingHorizontal,
      borderRadius: constraints.borderRadiusMedium,
      overflow: 'hidden',
      width: 'auto',
      marginVertical: constraints.sectionGap,
    },
  ]);
}
