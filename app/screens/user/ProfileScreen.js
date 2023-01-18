import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  ImageBackground,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Icon } from 'react-native-eva-icons';
import { useDispatch, useSelector } from 'react-redux';
import InformationIcon from '../../../assets/icons/information.svg';
import FoodIcon from '../../../assets/icons/svgs/food_icon.svg';
import ScooterIcon from '../../../assets/icons/svgs/scooter.svg';
import Actionbar from '../../components/Actionbar';
import Avatar from '../../components/Avatar';
import { fonts } from '../../configs/commonStyles';
import { constants, constraints } from '../../configs/constants';
import { useAxiosObject } from '../../contexts/axios-context';
import { logout } from '../../services/authService';
import { getUserDetails } from '../../services/userService';
import { switchTheme, themeState } from '../../store/slices/themeSlice';
import { removeToken } from '../../store/slices/userSlice';

export default function ProfileScreen({ navigation }) {
  const dispatch = useDispatch();
  const [profile, setProfile] = useState({});
  const axiosInstance = useAxiosObject();
  const [userDetails, setUserDetails] = useState({});

  const getUserData = async () => {
    await getUsers();
  };

  useEffect(() => {
    getUserData();
  }, []);
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getUserData();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);
  async function getUsers() {
    const user = await getUserDetails(axiosInstance);
    setUserDetails(user || {});
    setProfile(user.profile || {});
  }
  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={async () => {
              await getUsers();
            }}
          />
        }
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}
        stickyHeaderHiddenOnScroll
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <Actionbar showBackForProfileBtn />
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('User');
          }}
        >
          <ProfileInfoCard userDetails={userDetails} profile={profile} />
        </TouchableOpacity>
        <MenuList dispatch={dispatch} />
      </ScrollView>
    </View>
  );
}

function MenuList({ dispatch }) {
  const themeSelector = useSelector(themeState);
  const navigation = useNavigation();
  const colors = themeSelector.colors;

  const styles = settingStyles(colors);

  async function logoutPress() {
    let res = await logout();
    if (res) {
      dispatch(removeToken());
    }
  }

  function toggleTheme() {
    dispatch(switchTheme());
  }

  function ordersPress() {
    navigation.navigate('OrdersList');
  }

  function addressBookPress() {
    navigation.navigate('AddressBook');
  }

  function aboutPress() {
    navigation.navigate('About');
  }

  function myProfilePress(params) {
    navigation.navigate('User');
  }

  function settingsPress() {
    navigation.navigate('Settings');
  }

  return (
    <View style={{ paddingHorizontal: 20 }}>
      <TouchableOpacity style={styles.container} onPress={myProfilePress}>
        <Icon
          name="person"
          fill={colors.textColorSecondary}
          width={24}
          height={24}
        />
        <Text style={styles.text}>My Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.container} onPress={ordersPress}>
        <ScooterIcon fill={colors.textColorSecondary} width={20} height={20} />
        <Text style={styles.text}>Orders</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.container} onPress={addressBookPress}>
        <Icon
          name="map"
          fill={colors.textColorSecondary}
          width={24}
          height={24}
        />
        <Text style={styles.text}>Address Book</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{ flexDirection: 'row', justifyContent: 'space-between' }}
        onPress={toggleTheme}
      >
        <View style={styles.container}>
          <Icon
            name="sun"
            fill={colors.textColorSecondary}
            width={24}
            height={24}
          />
          <Text style={styles.text}>Light Mode</Text>
        </View>
        <Switch
          onValueChange={toggleTheme}
          value={themeSelector.theme === 'light'}
          thumbColor={
            themeSelector.theme === 'light'
              ? colors.accentColor
              : colors.textColorSecondary
          }
          trackColor={{
            false: colors.iconColorSecondary,
            true: colors.accentColorLight,
          }}
          thumbTintColor={'red'}
          tintColor={'red'}
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.container} onPress={settingsPress}>
        <Icon
          name="settings"
          fill={colors.textColorSecondary}
          width={24}
          height={24}
        />
        <Text style={styles.text}>Account Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.container} onPress={aboutPress}>
        <InformationIcon
          fill={colors.textColorSecondary}
          width={20}
          height={20}
        />
        <Text style={styles.text}>About Us</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.container} onPress={logoutPress}>
        <Icon name="log-out" fill="tomato" width={24} height={24} />
        <Text style={{ ...styles.text, color: 'tomato' }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
export function settingStyles(colors) {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      paddingVertical: 16,
      alignItems: 'center',
    },
    text: {
      ...fonts.regular,
      marginLeft: 8,
      fontSize: 15,
      color: colors.textColorSecondary,
    },
  });
}

function ProfileInfoCard({ profile, userDetails }) {
  const navigation = useNavigation();
  const colors = useSelector(themeState).colors;
  const theme = useSelector(themeState).theme;

  const infoStyles = StyleSheet.create({
    value: {
      ...fonts.regular,
      fontSize: constraints.textSizeHeading3,
      color: 'white',
    },
    name: {
      ...fonts.regular,
      fontSize: constraints.textSizeLabel3,
      color: 'white',
    },
  });

  return (
    <ImageBackground
      resizeMode={'stretch'} // or cover
      style={{
        flex: 1,
        borderRadius: 12,
        overflow: 'hidden',
        padding: 20,
        margin: 20,
      }} // must be passed from the parent, the number may vary depending upon your screen size
      source={require('../../../assets/profile_background.png')}
    >
      <View
        style={{
          flex: 1,
          position: 'relative',
          // backgroundColor: colors.cardColor,
        }}
      >
        {/* <TouchableOpacity
            style={{
                height: 40,
                width: 40,
                top: 16,
                right: 16,
                alignItems: "center",
                justifyContent: "center",
                position: "absolute",
                zIndex: 1,
            }} onPress={() => {
                navigation.navigate("User");
            }}>
            <View
                style={{
                    backgroundColor: colors.black,
                    borderRadius: 4,
                    padding: 6
                }}

            >
                <Icon name="eye" fill={theme == "dark" ? colors.accentColor : "white"} width={15} height={15} />
            </View>
        </TouchableOpacity> */}
        <View style={{ flexDirection: 'row' }}>
          <Avatar
            coverImage={constants.baseURL + profile.avatar}
            borderStyle={{ backgroundColor: colors.BlackDark }}
          />

          <View style={{ justifyContent: 'center', marginLeft: 12 }}>
            <Text
              style={{
                ...fonts.regular,
                fontSize: constraints.textSizeLabel1,
                textTransform: 'capitalize',
                color: 'white',
              }}
            >{`${profile.fname || ''} ${profile.lname || ''}`}</Text>
            <Text
              style={{
                ...fonts.light,
                fontSize: constraints.textSizeLabel2,
                color: 'white',
              }}
            >{`${profile.phone || ''}`}</Text>
            <Text
              style={{
                ...fonts.light,
                fontSize: constraints.textSizeLabel2,
                color: 'white',
              }}
            >{`${userDetails.user ? userDetails.user.email : ''}`}</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', marginTop: 20 }}>
          <View style={{ marginRight: 16 }}>
            <View
              style={{ flexDirection: 'row', alignItems: 'center', height: 32 }}
            >
              <FoodIcon
                fill="white"
                width={20}
                height={20}
                style={{ marginRight: 3 }}
              />
              <Text style={infoStyles.value}>
                {userDetails.orderCount || 0}
              </Text>
            </View>
            <Text style={infoStyles.name}>Foods ordered</Text>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}
