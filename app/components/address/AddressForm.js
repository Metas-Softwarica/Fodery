import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import { fonts } from '../../configs/commonStyles';
import { useAxiosObject } from '../../contexts/axios-context';
import { getCities, getStates } from '../../services/appService';
import { themeState } from '../../store/slices/themeSlice';
import ButtonRipple from '../inputs/buttons/ButtonRipple';
import Input from '../inputs/text/Input';

export function AddressForm({ id = null, onSubmit, address = {} }) {
  const [inFocus, setInFocus] = useState('');
  const colors = useSelector(themeState).colors;
  const axiosInstance = useAxiosObject();
  const theme = useSelector(themeState).theme;
  const [openState, setOpenState] = useState(false);
  const [valueState, setValueState] = useState(null);
  const [itemsState, setItemsState] = useState([]);
  const [openCity, setOpenCity] = useState(false);
  const [valueCity, setValueCity] = useState(null);
  const [itemsCity, setItemsCity] = useState([]);

  const asyncFunction = async () => {
    let states = (await getStates(axiosInstance)).results;
    states = states.map((item) => {
      return { label: item.title, value: item.id };
    });
    setItemsState(states);
    if (!!address.state) {
      setValueState(address.state);
    }

    let cities = (await getCities(axiosInstance)).results;
    cities = cities.map((item) => {
      return { label: item.title, value: item.id };
    });
    setItemsCity(cities);
    if (!!address.city) {
      setValueCity(address.city);
    }
  };

  useEffect(() => {
    asyncFunction();
  }, []);

  const {
    fname = '',
    companyName = '',
    state = '',
    city = '',
    streetAdd1 = '',
    zipCode = '',
    phone = '',
    label = '',
  } = address;

  const schema = Yup.object().shape({
    fname: Yup.string().min(2, 'Too Short!').required('Required'),
    companyName: Yup.string().min(2, 'Too Short!'),
    // state: Yup.string()
    //     .required('Required'),
    // city: Yup.string()
    //     .required('Required'),
    streetAdd1: Yup.string().min(2, 'Too Short!').required('Required'),
    zipCode: Yup.string().min(2, 'Too Short!'),
    phone: Yup.string()
      .min(10, 'Enter valid phone number.')
      .max(10, 'Enter valid phone number.')
      .required('Required'),
    label: Yup.string()
      .min(2, 'Too Short!')
      .max(15, 'Max Limit for Label is 15 characters.')
      .required('Required'),
  });

  const { handleChange, handleSubmit, handleBlur, values, errors, touched } =
    useFormik({
      validationSchema: schema,
      initialValues: {
        fname,
        companyName,
        state,
        city,
        streetAdd1,
        zipCode,
        phone,
        label,
        id,
      },
      onSubmit: (values) => {
        values.state = valueState;
        values.city = valueCity;
        onSubmit(values);
      },
    });
  const formStyles = StyleSheet.create({
    label: {
      ...fonts.regular,
      color: colors.textColorPrimary,
    },
    input: {
      ...fonts.regular,
      fontSize: 13,
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
    <View>
      <Text style={formStyles.label}>Full Name*</Text>
      <Input
        text={values.fname}
        placeholder="Full Name"
        containerStyle={formStyles.container}
        inputStyle={[
          formStyles.input,
          inFocus === 'fname' ? formStyles.inputFocus : {},
        ]}
        setText={handleChange('fname')}
        onBlur={handleBlur('fname')}
        onFocus={() => setInFocus('fname')}
        error={errors['fname']}
        touched={touched['fname']}
        errorStyle={formStyles.error}
        placeholderTextColor={colors.textColorSecondary}
      />

      <Text style={formStyles.label}>Company Name (Optional)</Text>
      <Input
        text={values.companyName}
        placeholder=""
        containerStyle={formStyles.container}
        inputStyle={[
          formStyles.input,
          inFocus === 'companyName' ? formStyles.inputFocus : {},
        ]}
        setText={handleChange('companyName')}
        onBlur={handleBlur('companyName')}
        onFocus={() => setInFocus('companyName')}
        error={errors['companyName']}
        touched={touched['companyName']}
        errorStyle={formStyles.error}
        placeholderTextColor={colors.textColorSecondary}
      />

      <Text style={{ ...formStyles.label, marginBottom: 8 }}>State*</Text>
      {/* <Input
                text={values.state}
                placeholder=""
                containerStyle={formStyles.container}
                inputStyle={[formStyles.input, inFocus === "state" ? formStyles.inputFocus : {}]}
                setText={handleChange("state")}
                onBlur={handleBlur("state")}
                onFocus={() => setInFocus("state")}
                error={errors["state"]}
                touched={touched["state"]}
                errorStyle={formStyles.error}
                placeholderTextColor="grey"
            /> */}
      <DropDownPicker
        open={openState}
        value={valueState}
        items={itemsState}
        setOpen={setOpenState}
        setValue={setValueState}
        setItems={setItemsState}
        placeholder="Choose your state"
        dropDownContainerStyle={{
          elevation: 1,
          borderColor: colors.borderColorSecondary,
          borderRadius: 4,
          backgroundColor: colors.backgroundColor,
        }}
        textStyle={{
          fontFamily: fonts.regular.fontFamily,
          fontSize: 13,
          color: colors.textColorPrimary,
        }}
        style={{
          borderColor: colors.borderColorSecondary,
          height: 40,
          borderRadius: 4,
          marginBottom: 12,
          backgroundColor: colors.backgroundColor,
          // marginTop: 8,
        }}
      />

      <Text style={{ ...formStyles.label, marginBottom: 8 }}>City*</Text>
      {/* <Input
                text={values.city}
                placeholder=""
                containerStyle={formStyles.container}
                inputStyle={[formStyles.input, inFocus === "city" ? formStyles.inputFocus : {}]}
                setText={handleChange("city")}
                onBlur={handleBlur("city")}
                onFocus={() => setInFocus("city")}
                error={errors["city"]}
                touched={touched["city"]}
                errorStyle={formStyles.error}
                placeholderTextColor="grey"
            /> */}

      <DropDownPicker
        open={openCity}
        value={valueCity}
        items={itemsCity}
        setOpen={setOpenCity}
        setValue={setValueCity}
        setItems={setItemsCity}
        placeholder="Choose your city"
        dropDownContainerStyle={{
          borderColor: colors.borderColorSecondary,
          borderRadius: 4,
          backgroundColor: colors.backgroundColor,
        }}
        textStyle={{
          fontFamily: fonts.regular.fontFamily,
          fontSize: 12,
          color: colors.textColorPrimary,
        }}
        style={{
          borderColor: colors.borderColorSecondary,
          height: 40,
          borderRadius: 4,
          marginBottom: 12,
          backgroundColor: colors.backgroundColor,
          // marginTop: 8,
        }}
      />

      <Text style={formStyles.label}>Street Address*</Text>
      <Input
        text={values.streetAdd1}
        placeholder=""
        containerStyle={formStyles.container}
        inputStyle={[
          formStyles.input,
          inFocus === 'streetAdd1' ? formStyles.inputFocus : {},
        ]}
        setText={handleChange('streetAdd1')}
        onBlur={handleBlur('streetAdd1')}
        onFocus={() => setInFocus('streetAdd1')}
        error={errors['streetAdd1']}
        touched={touched['streetAdd1']}
        errorStyle={formStyles.error}
        placeholderTextColor="grey"
      />

      <Text style={formStyles.label}>Zip Code (Optional)</Text>
      <Input
        text={values.zipCode}
        placeholder=""
        containerStyle={formStyles.container}
        inputStyle={[
          formStyles.input,
          inFocus === 'zipCode' ? formStyles.inputFocus : {},
        ]}
        setText={handleChange('zipCode')}
        onBlur={handleBlur('zipCode')}
        onFocus={() => setInFocus('zipCode')}
        error={errors['zipCode']}
        touched={touched['zipCode']}
        errorStyle={formStyles.error}
        placeholderTextColor="grey"
      />

      <Text style={formStyles.label}>Phone*</Text>
      <Input
        text={values.phone}
        placeholder=""
        containerStyle={formStyles.container}
        inputStyle={[
          formStyles.input,
          inFocus === 'phone' ? formStyles.inputFocus : {},
        ]}
        setText={handleChange('phone')}
        onBlur={handleBlur('phone')}
        onFocus={() => setInFocus('phone')}
        error={errors['phone']}
        touched={touched['phone']}
        errorStyle={formStyles.error}
        placeholderTextColor="grey"
        keyboardType={'number-pad'}
      />

      <Text style={formStyles.label}>Label your address as*</Text>
      <Input
        text={values.label}
        placeholder="eg. Home, Office etc"
        containerStyle={formStyles.container}
        inputStyle={[
          formStyles.input,
          inFocus === 'label' ? formStyles.inputFocus : {},
        ]}
        setText={handleChange('label')}
        onBlur={handleBlur('label')}
        onFocus={() => setInFocus('label')}
        error={errors['label']}
        touched={touched['label']}
        errorStyle={formStyles.error}
        placeholderTextColor="grey"
      />

      <ButtonRipple
        containerStyle={{
          borderRadius: 6,
          backgroundColor: colors.cardColor,
          marginVertical: 24,
        }}
        style={{
          paddingVertical: 8,
          borderRadius: 6,
          backgroundColor: theme == 'dark' ? colors.accentColor : colors.black,
        }}
        textStyle={{
          ...fonts.extraBold,
          fontSize: 14,
          color: theme == 'dark' ? colors.black : colors.accentColor,
        }}
        title="SAVE ADDRESS"
        onPress={() => handleSubmit()}
      />
    </View>
  );
}
