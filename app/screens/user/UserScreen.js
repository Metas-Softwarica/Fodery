import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Icon } from 'react-native-eva-icons';
import { ScrollView } from 'react-native-gesture-handler';
import Actionbar from '../../components/Actionbar';
import Avatar from '../../components/Avatar';
import { colors } from '../../configs/colors';
import { fonts } from '../../configs/commonStyles';
import { constants, constraints } from '../../configs/constants';
import { useAxiosObject } from '../../contexts/axios-context';
import { getUserDetails, getUserProfile } from '../../services/userService';

export default function UserScreen() {
  const navigation = useNavigation();
  const axiosInstance = useAxiosObject();
  const [profile, setProfile] = useState({});
  const [userDetails, setUserDetails] = useState({});
  const [userInfo, setUserInfo] = useState({
    coverImage: null,
    avatar: null,
    gender: 2,
    encodedCoverImage: null,
    encodedAvatarImage: null,
  });
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      await getUsers();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  const getUserData = async () => {
    await getUsers();
  };

  useEffect(() => {
    getUserData();
  }, []);

  async function getUsers() {
    const user = await getUserDetails(axiosInstance);
    setUserDetails(user || {});
    setProfile(user.profile || {});
    let res = await getUserProfile(axiosInstance);
    if (res) {
      const { fname, lname, bio, gender, avatar, coverImage } = res;
      setUserInfo({
        gender,
        avatar: constants.baseURL + avatar,
        coverImage: constants.baseURL + coverImage,
      });
    }
  }
  return (
    <View style={{ flex: 1 }}>
      <Actionbar showBackBtn />
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={async () => {
              await getUsers();
            }}
          />
        }
      >
        <View style={{ backgroundColor: colors.overlayBg }}>
          <Image
            style={styles.coverImage}
            source={{
              uri: userInfo.coverImage,
            }}
          />
        </View>

        <View style={styles.infoWrapper}>
          <View style={styles.avatarWrapper}>
            <Avatar
              borderStyle={{ backgroundColor: 'black' }}
              coverImage={constants.baseURL + profile.avatar}
            />
            <TouchableOpacity
              style={{
                backgroundColor: colors.BlackDark,
                borderRadius: 4,
                paddingVertical: 6,
                paddingHorizontal: 8,
                flexDirection: 'row',
                alignItems: 'center',
              }}
              onPress={() => {
                navigation.navigate('EditProfile');
              }}
            >
              <Icon name="edit" fill={colors.white} width={15} height={15} />
              <Text
                style={{
                  color: '#fff',
                  fontSize: 12,
                  marginLeft: 5,
                  ...fonts.light,
                }}
              >
                EDIT PROFILE
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.textView}>
            <Text
              style={{ ...fonts.light, fontSize: 18, color: colors.GreyShade }}
            >{`${profile.fname || ''} ${profile.lname || ''}`}</Text>
            <Text
              style={{ ...fonts.light, fontSize: 14, color: colors.GreyShade }}
            >{`${profile.phone || ''}`}</Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              marginTop: 32,
              justifyContent: 'space-evenly',
            }}
          >
            <View style={{ marginRight: 16 }}>
              <Text style={infoStyles.value}>{userDetails.reward || 0}</Text>
              <Text style={infoStyles.name}>reward coins</Text>
            </View>

            <View style={{ marginRight: 16 }}>
              <Text style={infoStyles.value}>
                {userDetails.orderCount || 0}
              </Text>
              <Text style={infoStyles.name}>foods ordered</Text>
            </View>

            <View style={{ marginRight: 16 }}>
              <Text style={infoStyles.value}>{userDetails.coupons || 0}</Text>
              <Text style={infoStyles.name}>vouchers used</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const infoStyles = StyleSheet.create({
  value: {
    ...fonts.poppinsRegular,
    fontSize: 18,
    color: colors.GreyRegular,
  },
  name: {
    ...fonts.poppinsLight,
    fontSize: 10,
    color: colors.GreyRegular,
  },
});

const styles = StyleSheet.create({
  coverImage: {
    width: '100%',
    height: 200,
  },
  infoWrapper: {
    paddingHorizontal: constraints.screenPaddingHorizontal,
  },
  avatarWrapper: {
    marginTop: -35,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  textView: {
    marginTop: 20,
  },
});
