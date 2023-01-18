import { useFormik } from 'formik';
import React from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import ButtonRipple from '../components/inputs/buttons/ButtonRipple';
import Input from '../components/inputs/text/Input';
import { Gap } from '../components/util/Gap';
import { fonts } from '../configs/commonStyles';
import { constraints } from '../configs/constants';
import { themeState } from '../store/slices/themeSlice';

export default function ReferralScreen({ navigation }) {
  const colors = useSelector(themeState).colors;

  const signInSchema = Yup.object().shape({
    referral: Yup.string().required('Required'),
  });

  const { handleChange, handleSubmit, handleBlur, values, errors, touched } =
    useFormik({
      validationSchema: signInSchema,
      initialValues: { referral: '' },
      onSubmit: (values) => {},
    });

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: constraints.screenPaddingHorizontal + 10,
          paddingTop: 100,
        }}
      >
        <View>
          <Image
            source={{
              uri: 'https://thumbs.dreamstime.com/b/refer-friend-referral-network-marketing-recommend-to-share-code-women-shout-megaphone-vector-illustration-187061860.jpg',
            }}
            style={{
              width: '100%',
              height: 150,
            }}
          />
        </View>
        <Gap y={100} />
        <Text
          style={{
            ...fonts.black,
            fontSize: 18,
            color: colors.textColorPrimary,
          }}
        >
          Get free delivery
        </Text>
        <Text
          style={{
            ...fonts.regular,
            fontSize: constraints.captionSecondaryFontSize,
            marginVertical: 8,
            lineHeight: 14,
            color: colors.textColorPrimary,
          }}
        >
          If you have referral code, enter it and get 100 sweed coins and a free
          delivery coupon.
        </Text>

        <Gap y={20} />

        <Input
          placeholder="Enter referral code"
          containerStyle={{
            borderRadius: constraints.borderRadiusMin,
            marginBottom: 8,
          }}
          inputStyle={{
            ...fonts.regular,
            fontSize: constraints.captionSecondaryFontSize,
            paddingHorizontal: 22,
            borderColor: colors.borderColor,
            borderRadius: constraints.borderRadiusMin,
            borderWidth: 1,
            backgroundColor: colors.backgroundColor,
            paddingVertical: 8,
          }}
          setText={handleChange('referral')}
          onBlur={handleBlur('referral')}
          error={errors.referral}
          touched={touched.referral}
          errorStyle={{ paddingLeft: 20 }}
          placeholderTextColor={colors.textColorSecondary}
        />

        <ButtonRipple
          title="Apply"
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
          // disabled={loading}
        />

        <Pressable
          style={{
            alignItems: 'center',
          }}
          onPress={() => {
            navigation.navigate('EmailVerificationScreen');
          }}
        >
          <Text
            style={{
              color: colors.textColorSecondary,
            }}
          >
            Skip
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
