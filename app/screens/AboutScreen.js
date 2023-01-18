import { AntDesign } from '@expo/vector-icons';
import Constants from 'expo-constants';
import * as Linking from 'expo-linking';
import React, { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Icon } from 'react-native-eva-icons';
import { useSelector } from 'react-redux';
import Actionbar from '../components/Actionbar';
import { fonts } from '../configs/commonStyles';
import { utilStyles } from '../configs/utilStyles';
import { useAxiosObject } from '../contexts/axios-context';
import { getAboutDetails } from '../services/appService';
import { themeState } from '../store/slices/themeSlice';

export default function AboutScreen({ navigation }) {
  const [appInfo, setAppInfo] = useState(null);
  const axiosInstance = useAxiosObject();
  const colors = useSelector(themeState).colors;

  const getAboutData = async () => {
    let res = await getAboutDetails(axiosInstance);
    if (res) {
      setAppInfo(res);
    }
  };

  useEffect(() => {
    getAboutData();
  }, []);

  const styles = StyleSheet.create({
    logoBrandWrapper: {
      ...utilStyles.centerXY,
      paddingVertical: 100,
    },
    logoParentWrapper: {
      width: 130,
      alignItems: 'center',
    },
    logo: {
      width: 125,
      height: 64,
      resizeMode: 'contain',
      marginBottom: 3,
    },
    brandName: {
      ...fonts.extraBold,
      fontSize: 25,
      color: colors.textColorPrimary,
    },
    socialsWrapper: {
      marginTop: 30,
      ...utilStyles.centerXY,
    },
    socials: {
      marginTop: 15,
      flexDirection: 'row',
      width: 150,
      justifyContent: 'space-between',
    },
  });

  return (
    <View style={{ flex: 1 }}>
      <Actionbar showBackBtn title="About us" />
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        overScrollMode="never"
      >
        <View style={styles.logoBrandWrapper}>
          <View style={styles.logoParentWrapper}>
            <Image
              style={styles.logo}
              source={require('../../assets/logo.png')}
            />
            <Text style={styles.brandName}>Fodery</Text>
          </View>
        </View>
        <View>
          <AboutItems
            borderTop
            keyText={`Version ${Constants.manifest.version}`}
            pressHandler={() => {}}
            // value="Up to date"
          />
          {/* <AboutItems
                        borderTop
                        keyText="Check Server Status"
                        pressHandler={() => { }}
                    /> */}
          <AboutItems
            borderTop
            keyText="Terms of Service"
            pressHandler={() => {
              if (!appInfo) {
                return;
              }
              navigation.navigate('Terms', {
                url: appInfo.terms,
                title: 'Terms & Conditions',
              });
            }}
          />
          <AboutItems
            borderTop
            keyText="Privacy Policy"
            pressHandler={() => {
              if (!appInfo) {
                return;
              }
              navigation.navigate('Terms', {
                url: appInfo.privacy,
                title: 'Privacy Policy',
              });
            }}
            borderBottom
          />
        </View>
        <View style={styles.socialsWrapper}>
          <Text style={{ color: colors.textColorPrimary }}>FOLLOW US ON</Text>
          <View style={styles.socials}>
            <TouchableOpacity
              onPress={() => {
                if (!appInfo) {
                  return;
                }
                if (Linking.canOpenURL(appInfo.facebook)) {
                  Linking.openURL(appInfo.facebook);
                }
              }}
            >
              <Icon
                name="facebook"
                fill={colors.textColorPrimary}
                width={22}
                height={22}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                if (!appInfo) {
                  return;
                }
                if (Linking.canOpenURL(appInfo.github)) {
                  Linking.openURL(appInfo.github);
                }
              }}
            >
              <Icon
                name="twitter"
                fill={colors.textColorPrimary}
                width={22}
                height={22}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                if (!appInfo) {
                  return;
                }
                if (Linking.canOpenURL(appInfo.instagram)) {
                  Linking.openURL(appInfo.instagram);
                }
              }}
            >
              <AntDesign
                name="instagram"
                size={22}
                color={colors.textColorPrimary}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function AboutItems({ borderTop, borderBottom, keyText, value, pressHandler }) {
  const colors = useSelector(themeState).colors;
  return (
    <TouchableOpacity
      onPress={pressHandler}
      style={{
        borderTopWidth: borderTop ? 1 : 0,
        borderTopColor: colors.cardColor,
        borderBottomWidth: borderBottom ? 1 : 0,
        borderBottomColor: colors.cardColor,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 12,
      }}
    >
      <Text style={{ color: colors.textColorPrimary }}>{keyText}</Text>
      {value && <Text style={{ color: colors.cardColorRipple }}>{value}</Text>}
    </TouchableOpacity>
  );
}
