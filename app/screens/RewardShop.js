import React from 'react';
import { Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import Actionbar from '../components/Actionbar';
import { fonts } from '../configs/commonStyles';
import { themeState } from '../store/slices/themeSlice';

function RewardShop({ route }) {
  const colors = useSelector(themeState).colors;
  return (
    <>
      <Actionbar showBackBtn title="Reward Shop" />
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          marginHorizontal: 34,
        }}
      >
        <Text
          style={{
            ...fonts.light,
            fontSize: 18,
            marginVertical: 8,
            color: colors.textColorSecondary,
            textAlign: 'center',
          }}
        >
          Reward shop is under-construction.
        </Text>
      </View>
    </>
  );
}

export default RewardShop;
