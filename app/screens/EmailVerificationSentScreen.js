import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import MailSentSvg from '../../assets/icons/svgs/mail_sent.svg';
import ButtonRipple from '../components/inputs/buttons/ButtonRipple';
import { Gap } from '../components/util/Gap';
import { fonts } from '../configs/commonStyles';
import { constraints } from '../configs/constants';
import { themeState } from '../store/slices/themeSlice';

export default function EmailVerificationSentScreen({ navigation }) {
  const colors = useSelector(themeState).colors;

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: constraints.screenPaddingHorizontal + 10,
          paddingTop: 120,
          alignItems: 'center',
        }}
      >
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <MailSentSvg height={150} />
        </View>
        <Gap y={100} />
        <Text
          style={{
            ...fonts.black,
            fontSize: 18,
            color: colors.textColorPrimary,
            textAlign: 'center',
          }}
        >
          Verify Your Email
        </Text>
        <Text
          style={{
            ...fonts.regular,
            fontSize: constraints.captionSecondaryFontSize,
            marginVertical: 8,
            lineHeight: 14,
            color: colors.textColorPrimary,
            textAlign: 'center',
          }}
        >
          An email verification link has been sent to you email. Verify your
          email and login.
        </Text>

        <Gap y={20} />

        <ButtonRipple
          title="LOGIN NOW"
          titleStyle={{ marginRight: 0 }}
          containerStyle={{
            borderRadius: constraints.borderRadiusMin,
            marginVertical: constraints.buttonPaddingVertical,
            minWidth: 0,
            flex: 1,
            flexDirection: 'row',
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
            marginHorizontal: 14,
          }}
          onPress={() => {
            navigation.replace('Auth', {
              page: 1,
            });
          }}
        />
      </ScrollView>
    </View>
  );
}
