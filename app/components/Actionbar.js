import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Icon } from 'react-native-eva-icons';
import { useDispatch, useSelector } from 'react-redux';
import BagIcon from '../../assets/icons/svgs/Bag.svg';
import { fonts } from '../configs/commonStyles';
import { constants } from '../configs/constants';
import { utilStyles } from '../configs/utilStyles';
import { useAxiosObject } from '../contexts/axios-context';
import { getCartItems } from '../services/cartService';
import { getUserDetails } from '../services/userService';
import { cartState, loadCount } from '../store/slices/cartSlice';
import { themeState } from '../store/slices/themeSlice';

import { selectState, setToInitial } from '../store/slices/recommendationSlice';

export default function Actionbar({
  showBackBtn = false,
  showSearchBtn = false,
  showChild,
  children,
  showButton,
  showFavoriteBtn = false,
  title = false,
  showProfile = false,
  greetUser = false,
  showCloseBtn = false,
  showBackForProfileBtn = false,
}) {
  const colors = useSelector(themeState).colors;
  const theme = useSelector(themeState).theme;
  const selector = useSelector(cartState);
  const navigation = useNavigation();
  const [avatar, setAvatar] = useState(null);
  const [firstName, setFirstName] = useState('');
  const dispatch = useDispatch();
  const axiosInstance = useAxiosObject();
  const selectStateSelector = useSelector(selectState);

  const getUserData = async () => {
    let res = await getUserDetails(axiosInstance);
    if (res) {
      setAvatar(res.profile.avatar);
      setFirstName(res.profile.fname);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  const getCartData = async () => {
    let result = await getCartItems(axiosInstance);
    if (result) {
      dispatch(loadCount(loadCartCount(result.items)));
    }
  };

  useEffect(() => {
    getCartData();
  }, []);

  function loadCartCount(items) {
    let totalCount = 0;
    items.forEach((element) => {
      totalCount += element.quantity;
    });
    return totalCount;
  }

  return (
    <View
      style={{
        ...styles.actionBar,
        backgroundColor: colors.backgroundColor,
        paddingTop: Platform.OS == 'ios' ? 20 : null,
      }}
    >
      <View style={styles.titleWrapper}>
        {showBackBtn && navigation && (
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center', padding: 5 }}
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Icon
              name="chevron-left-outline"
              fill={colors.textColorSecondary}
              width={30}
              height={30}
            />
            {title && (
              <Text style={{ ...styles.title, color: colors.textColorPrimary }}>
                {title}
              </Text>
            )}
          </TouchableOpacity>
        )}

        {showBackForProfileBtn && navigation && (
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center', padding: 5 }}
            onPress={() => {
              navigation.jumpTo('BottomTab');
            }}
          >
            <Icon
              name="chevron-left-outline"
              fill={colors.textColorSecondary}
              width={30}
              height={30}
            />
            {title && (
              <Text style={{ ...styles.title, color: colors.textColorPrimary }}>
                {title}
              </Text>
            )}
          </TouchableOpacity>
        )}

        {title && !showBackBtn && (
          <Text style={{ ...styles.title, color: colors.textColorPrimary }}>
            {title}
          </Text>
        )}

        {greetUser && firstName !== '' && (
          <Image
            source={require('../../assets/logo.png')}
            style={{ width: 24, resizeMode: 'contain', marginRight: 5 }}
          />
        )}

        {greetUser && firstName !== '' && (
          <Text style={{ ...styles.title, color: colors.textColorPrimary }}>
            Hi, {firstName}
          </Text>
        )}
        {showChild && children}
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {showSearchBtn && (
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() =>
              navigation.navigate('ItemByCategory', {
                title: 'Search',
                subTitle: 'Results',
                isSearch: true,
              })
            }
          >
            <Icon
              name="search-outline"
              width={24}
              height={24}
              fill={colors.textColorSecondary}
            />
          </TouchableOpacity>
        )}

        {showButton && (
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => {
              navigation.navigate('Cart');
            }}
          >
            <BagIcon width={20} height={20} fill={colors.textColorSecondary} />
            {selector.count > 0 && (
              <View
                style={{
                  position: 'absolute',
                  borderRadius: 9,
                  backgroundColor:
                    theme == 'light' ? colors.black : colors.accentColor,

                  height: 16,
                  width: 16,
                  top: -3,
                  right: 12,
                }}
              >
                <Text
                  style={[
                    {
                      color: theme == 'light' ? 'white' : colors.black,
                      textAlign: 'center',
                      fontSize: selector.count > 99 ? 8 : 11,
                      lineHeight: 18,
                    },
                    fonts.poppinsRegular,
                  ]}
                >
                  {selector.count}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        )}

        {showFavoriteBtn && (
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => {
              navigation.navigate('Favorites');
            }}
          >
            <Icon
              name="heart-outline"
              width={24}
              height={24}
              fill={colors.accentColor2}
            />
          </TouchableOpacity>
        )}

        {showProfile && (
          <TouchableOpacity
            style={{
              position: 'relative',
              display: 'flex',
              width: 28,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
            onPress={() => {
              navigation.jumpTo('Profile');
              // navigation.push('TopTab', { screen: 'Profile' });
            }}
          >
            <UserProfileIcon avatar={avatar} />
          </TouchableOpacity>
        )}

        {showCloseBtn && (
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => {
              navigation.goBack();
              dispatch(setToInitial());
            }}
          >
            <Icon
              name="close"
              width={24}
              height={24}
              fill={colors.textColorPrimary}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export function UserProfileIcon({ avatar }) {
  const colors = useSelector(themeState).colors;
  const theme = useSelector(themeState).theme;

  const styles = StyleSheet.create({
    image: {
      width: 24,
      height: 24,
      borderRadius: 15,
    },
    view: {
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 99,
      ...utilStyles.centerXY,
    },
  });

  return (
    <View>
      {!avatar ? (
        <View style={styles.view}>
          <Image
            source={require('../../assets/no_profile_image.png')}
            style={{
              height: 25,
              width: 25,
              alignSelf: 'center',
            }}
          />
        </View>
      ) : (
        <View
          style={{
            width: 28,
            height: 28,
            borderRadius: 28,
            borderColor: theme == 'dark' ? colors.accentColor : 'black',
            backgroundColor: 'transparent',
            borderWidth: 0.5,
            ...utilStyles.centerXY,
          }}
        >
          <Image
            style={styles.image}
            source={{
              uri: constants.baseURL + avatar,
            }}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  actionBar: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 12,
    marginBottom: Platform.OS === 'ios' ? 8 : 0,
    paddingHorizontal: 18,
    // marginBottom: -15,
  },
  titleWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 0,
  },
  iconContainer: {
    position: 'relative',
    display: 'flex',
    width: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    ...fonts.regular,
    fontSize: 16,
    textAlignVertical: 'bottom',
  },
});
