import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { constants } from '../configs/constants';
import { utilStyles } from '../configs/utilStyles';
import { themeState } from '../store/slices/themeSlice';

export default function Avatar({ borderStyle = {}, coverImage }) {
  const styles = StyleSheet.create({
    avatarBorder: {
      width: 70,
      height: 70,
      borderRadius: 99,
      padding: 4,
      backgroundColor: 'black',
      ...utilStyles.centerXY,
      ...borderStyle,
    },
  });
  const colors = useSelector(themeState).colors;
  const theme = useSelector(themeState).theme;

  return (
    <View style={styles.avatarBorder}>
      {!coverImage || coverImage === constants.baseURL + null ? (
        <Image
          source={require('../../assets/no_profile_image.png')}
          style={{
            height: 66,
            width: 66,
            alignSelf: 'center',
            borderRadius: 33,
            borderWidth: 1,
            borderColor:
              theme == 'light' ? colors.cardColorRipple : colors.accentColor,
          }}
        />
      ) : (
        <Image
          style={{
            width: 66,
            height: 66,
            borderRadius: 33,
            borderWidth: 1,
            borderColor:
              theme == 'light' ? colors.textColorSecondary : colors.accentColor,
          }}
          source={{ uri: coverImage }}
        />
      )}
    </View>
  );
}
