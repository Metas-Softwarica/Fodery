import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import publicIP from 'react-native-public-ip';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import { fonts } from '../../configs/commonStyles';
import { constraints } from '../../configs/constants';
import { useAxiosObject } from '../../contexts/axios-context';
import { customShowMessage } from '../../customMessage';
import { getAboutDetails } from '../../services/appService';
import { signup } from '../../services/authService';
import { themeState } from '../../store/slices/themeSlice';
import ButtonRipple from '../inputs/buttons/ButtonRipple';
import Input from '../inputs/text/Input';

export function SignUpForm({ signInCardHeight, onSignIn }) {
  const { height } = useWindowDimensions();
  const [ip, setIp] = useState(null);
  const axiosInstance = useAxiosObject();
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const colors = useSelector(themeState).colors;
  const [appInfo, setAppInfo] = useState(null);
  useEffect(() => {
    publicIP();
  }, []);
  publicIP()
    .then((ip) => {
      setIp(ip);
    })
    .catch((error) => {
      setIp(error);
    });

  async function signUpHandler(values) {
    let array = values.fullName.split(' ');
    let newObj = {
      email: values.email,
      password: values.password,
      fname: array[0],
      lname: array[1] || '',
      publicIp: ip,
    };
    setLoading(true);
    let res = await signup(axiosInstance, newObj);
    setLoading(false);
    if (res.status) {
      customShowMessage('User created successfully.', 'success', colors);
      navigation.navigate('EmailVerificationScreen');
    } else {
      customShowMessage(res.message, 'danger', colors);
    }
  }

  const signInSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    fullName: Yup.string()
      .min(2, 'Fullname must be at least 6 characters.')
      .max(50, 'Fullname has reached 50 characters limit.')
      .required('Required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters.')
      .max(32, 'Password has reached 32 characters limit.')
      .required('Required'),
    confirmPassword: Yup.string().oneOf(
      [Yup.ref('password'), null],
      'Passwords must match'
    ),
  });

  const { handleChange, handleSubmit, handleBlur, values, errors, touched } =
    useFormik({
      validationSchema: signInSchema,
      initialValues: {
        email: '',
        password: '',
        fullName: '',
        confirmPassword: '',
      },
      onSubmit: signUpHandler,
    });

  const getAboutData = async () => {
    let res = await getAboutDetails(axiosInstance);
    if (res) {
      setAppInfo(res);
    }
  };

  useEffect(() => {
    getAboutData();
  }, []);

  const STATUSBAR_HEIGHT = Constants.statusBarHeight;

  return (
    <View
      style={{
        flexGrow: 1,
        marginTop: 8,
        paddingTop: 32,
        paddingBottom: 16,
        paddingHorizontal: 32,
        backgroundColor: colors.backgroundColor,
        borderTopStartRadius: 32,
        borderTopEndRadius: 32,
        height:
          STATUSBAR_HEIGHT != 24
            ? height - signInCardHeight
            : height - signInCardHeight + STATUSBAR_HEIGHT,
        elevation: 12,
      }}
    >
      <Input
        placeholder="Full Name"
        containerStyle={{
          borderRadius: constraints.borderRadiusMin,
          marginBottom: 8,
        }}
        inputStyle={{
          ...fonts.regular,
          fontSize: constraints.captionSecondaryFontSize,
          paddingHorizontal: 22,
          borderRadius: constraints.borderRadiusMin,
          borderWidth: 1,
          borderColor: colors.borderColor,
          backgroundColor: colors.backgroundColor,
          paddingVertical: 8,
          color: colors.textColorPrimary,
        }}
        setText={handleChange('fullName')}
        onBlur={handleBlur('fullName')}
        error={errors.fullName}
        touched={touched.fullName}
        errorStyle={{ paddingLeft: 20 }}
        placeholderTextColor={colors.textColorSecondary}
      />

      <Input
        placeholder="example@gmail.com"
        containerStyle={{
          borderRadius: constraints.borderRadiusMin,
          marginBottom: 8,
        }}
        inputStyle={{
          ...fonts.regular,
          fontSize: constraints.captionSecondaryFontSize,
          paddingHorizontal: 22,
          borderRadius: constraints.borderRadiusMin,
          borderWidth: 1,
          borderColor: colors.borderColor,
          backgroundColor: colors.backgroundColor,
          paddingVertical: 8,
        }}
        setText={handleChange('email')}
        keyboardType="email-address"
        onBlur={handleBlur('email')}
        error={errors.email}
        touched={touched.email}
        errorStyle={{ paddingLeft: 20 }}
        placeholderTextColor={colors.textColorSecondary}
      />

      <Input
        placeholder="Password"
        onBlur={handleBlur('password')}
        error={errors.password}
        touched={touched.password}
        containerStyle={{
          borderRadius: constraints.borderRadiusMin,
          marginBottom: 8,
        }}
        errorStyle={{ paddingLeft: 20 }}
        inputStyle={{
          ...fonts.regular,
          fontSize: constraints.captionSecondaryFontSize,
          paddingHorizontal: 22,
          borderRadius: constraints.borderRadiusMin,
          borderWidth: 1,
          borderColor: colors.borderColor,
          backgroundColor: colors.backgroundColor,
          paddingVertical: 8,
        }}
        setText={handleChange('password')}
        password
        placeholderTextColor={colors.textColorSecondary}
      />

      <Input
        placeholder="Confirm Password"
        onBlur={handleBlur('confirmPassword')}
        error={errors.confirmPassword}
        touched={touched.confirmPassword}
        containerStyle={{
          borderRadius: constraints.borderRadiusMin,
          marginBottom: 8,
        }}
        errorStyle={{ paddingLeft: 20 }}
        inputStyle={{
          ...fonts.regular,
          fontSize: constraints.captionSecondaryFontSize,
          paddingHorizontal: 22,
          borderRadius: constraints.borderRadiusMin,
          borderWidth: 1,
          borderColor: colors.borderColor,
          backgroundColor: colors.backgroundColor,
          paddingVertical: 8,
        }}
        setText={handleChange('confirmPassword')}
        password
        placeholderTextColor={colors.textColorSecondary}
      />

      <ButtonRipple
        title={loading ? 'Signing Up...' : 'Sign Up'}
        containerStyle={{
          borderRadius: constraints.borderRadiusMin,
          marginVertical: constraints.buttonPaddingVertical,
        }}
        style={{
          backgroundColor: colors.accentColor,
          borderRadius: constraints.borderRadiusMin,
          paddingVertical: constraints.buttonPaddingVertical,
        }}
        textStyle={{
          ...fonts.black,
          fontSize: constraints.buttonTextPrimaryFontSize,
          color: colors.black,
          textTransform: 'uppercase',
        }}
        onPress={handleSubmit}
        disabled={loading}
      ></ButtonRipple>

      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <Text
          style={{
            ...fonts.regular,
            color: colors.textColorSecondary,
            fontSize: constraints.captionSecondaryFontSize,
          }}
        >
          {'Already have an account? '}
        </Text>
        <TouchableOpacity onPress={onSignIn}>
          <Text
            style={{
              ...fonts.regular,
              color: colors.textColorPrimary,
              fontSize: constraints.captionSecondaryFontSize,
            }}
          >
            {'Login'}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={{
          marginTop: 'auto',
          alignItems: 'center',
          paddingVertical: 6,
        }}
        onPress={() => {
          if (!appInfo) {
            return;
          }
          navigation.navigate('Terms', {
            url: appInfo.terms,
            title: 'Terms & Conditions',
          });
        }}
      >
        <Text
          style={{
            ...fonts.regular,
            color: colors.textColorPrimary,
            fontSize: constraints.spanTextFontSize,
          }}
        >
          By signing up, you will agree to our
        </Text>
        <Text
          style={{
            ...fonts.regular,
            color: colors.textColorPrimary,
            fontSize: constraints.spanTextFontSize,
            textDecorationLine: 'underline',
          }}
        >
          Terms and Conditions
        </Text>
      </TouchableOpacity>
    </View>
  );
}
