import { useFormik } from 'formik';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import Actionbar from '../../components/Actionbar';
// import { formStyles } from "../../components/address/AddressForm";
import { useSelector } from 'react-redux';
import ButtonRipple from '../../components/inputs/buttons/ButtonRipple';
import Input from '../../components/inputs/text/Input';
import { fonts } from '../../configs/commonStyles';
import { constraints } from '../../configs/constants';
import { useAxiosObject } from '../../contexts/axios-context';
import { customShowMessage } from '../../customMessage';
import { setPasswordSocial, updatePassword } from '../../services/authService';
import { themeState } from '../../store/slices/themeSlice';
import { removeToken, setPasswordState } from '../../store/slices/userSlice';

export default function ChangePasswordScreen({ route, navigation }) {
  const hasPassword = route.params.isSetPassword;
  const colors = useSelector(themeState).colors;
  const theme = useSelector(themeState).theme;
  const axiosInstance = useAxiosObject();
  const dispatch = useDispatch();
  let schema;

  if (hasPassword) {
    schema = Yup.object().shape({
      currentPassword: Yup.string()
        .min(6, 'Password must be at least 6 characters.')
        .max(32, 'Password has reached 32 characters limit.')
        .required('Required'),
      newPassword: Yup.string()
        .min(6, 'Password must be at least 6 characters.')
        .max(32, 'Password has reached 32 characters limit.')
        .required('Required'),
      validatePassword: Yup.string().oneOf(
        [Yup.ref('newPassword'), null],
        'Passwords must match'
      ),
    });
  } else {
    schema = Yup.object().shape({
      newPassword: Yup.string()
        .min(6, 'Password must be at least 6 characters.')
        .max(32, 'Password has reached 32 characters limit.')
        .required('Required'),
      validatePassword: Yup.string().oneOf(
        [Yup.ref('newPassword'), null],
        'Passwords must match'
      ),
    });
  }

  async function googleChangePassword(values) {
    let res = await setPasswordSocial(axiosInstance, values);
    if (res) {
      customShowMessage('Password added successfully.', 'success', colors);
      dispatch(setPasswordState(true));
      dispatch(removeToken());
      return;
    }
    customShowMessage('Error updating password', 'danger', colors);
  }

  async function regularChangePassword(values) {
    let res = await updatePassword(axiosInstance, values);
    if (res) {
      customShowMessage('Password updated successfully.', 'success', colors);
      dispatch(setPasswordState(true));
      dispatch(removeToken());
      return;
    } else {
      customShowMessage('Error updating password', 'danger', colors);
    }
  }

  const {
    handleChange,
    handleSubmit,
    handleBlur,
    values,
    errors,
    touched,
    setValues,
  } = useFormik({
    validationSchema: schema,
    initialValues: {
      currentPassword: '',
      newPassword: '',
      validatePassword: '',
    },

    onSubmit: (values) => {
      if (hasPassword) {
        regularChangePassword(values);
        return;
      }
      googleChangePassword(values);
    },
  });

  const formStyles = StyleSheet.create({
    label: {
      ...fonts.regular,
      color: colors.textColorPrimary,
    },
    input: {
      ...fonts.regular,
      fontSize: 12,
      paddingHorizontal: 18,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: colors.borderColorSecondary,
      paddingVertical: 5,
      marginTop: 8,
      textAlignVertical: 'center',
      color: colors.textColorSecondary,
    },
    inputFocus: {
      borderColor: colors.GreyRegular,
      borderBottomColor: colors.GreyRegular,
    },
    container: {
      borderRadius: 4,
      marginBottom: 12,
    },
    error: {},
  });

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        <Actionbar showBackBtn />

        <View
          style={{
            marginTop: 20,
            paddingHorizontal: constraints.screenPaddingHorizontal,
          }}
        >
          <Text
            style={{
              ...fonts.extraBold,
              fontSize: 20,
              color: colors.textColorPrimary,
            }}
          >
            {hasPassword ? 'Change my password' : 'Set up a new password'}
          </Text>
          <Text
            style={{
              ...fonts.regular,
              marginTop: 10,
              fontSize: 12,
              color: colors.textColorSecondary,
            }}
          >
            {hasPassword
              ? "Let's setup a new strong password"
              : "You haven't set up a password for your account. Let's set it up"}
          </Text>

          <View style={{ marginTop: 20 }}>
            {hasPassword && (
              <>
                <Text style={formStyles.label}>Current Password</Text>
                <Input
                  text={values.currentPassword}
                  containerStyle={formStyles.container}
                  inputStyle={[formStyles.input]}
                  setText={handleChange('currentPassword')}
                  onBlur={handleBlur('currentPassword')}
                  error={errors['currentPassword']}
                  touched={touched['currentPassword']}
                  placeholderTextColor="grey"
                  password
                />
              </>
            )}

            <Text style={formStyles.label}>New Password</Text>
            <Input
              text={values.newPassword}
              containerStyle={formStyles.container}
              inputStyle={[formStyles.input]}
              setText={handleChange('newPassword')}
              onBlur={handleBlur('newPassword')}
              error={errors['newPassword']}
              touched={touched['newPassword']}
              placeholderTextColor="grey"
              password
            />

            <Text style={formStyles.label}>Confirm Password</Text>
            <Input
              text={values.validatePassword}
              containerStyle={formStyles.container}
              inputStyle={[formStyles.input]}
              setText={handleChange('validatePassword')}
              onBlur={handleBlur('validatePassword')}
              error={errors['validatePassword']}
              touched={touched['validatePassword']}
              placeholderTextColor="grey"
              password
            />
          </View>

          <ButtonRipple
            title={'SUBMIT'}
            style={{
              borderRadius: 5,
              paddingVertical: 10,
              marginTop: 15,
              backgroundColor:
                theme == 'dark' ? colors.accentColor : colors.black,
            }}
            containerStyle={{
              borderRadius: 5,
              backgroundColor: colors.cardColor,
              marginVertical: 24,
            }}
            textStyle={{
              fontSize: 13,
              color: theme == 'dark' ? colors.black : colors.accentColor,
            }}
            onPress={handleSubmit}
          />
        </View>
      </ScrollView>
    </View>
  );
}
