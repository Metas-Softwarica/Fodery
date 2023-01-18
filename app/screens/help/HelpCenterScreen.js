import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  Linking,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Icon } from 'react-native-eva-icons';
import { SvgUri } from 'react-native-svg';
import { useSelector } from 'react-redux';
import Actionbar from '../../components/Actionbar';
import ButtonRipple from '../../components/inputs/buttons/ButtonRipple';
import ScreenSpinner from '../../components/spinners/ScreenSpinner';
import { fonts } from '../../configs/commonStyles';
import { constants } from '../../configs/constants';
import { utilStyles } from '../../configs/utilStyles';
import { useAxiosObject } from '../../contexts/axios-context';
import { getAboutDetails } from '../../services/appService';
import { getFAQCategories } from '../../services/helpService';
import { themeState } from '../../store/slices/themeSlice';

export default function HelpCenterScreen({ navigation }) {
  const axiosInstance = useAxiosObject();
  const [categories, setCategories] = useState([]);
  const [appSettings, setAppSettings] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const asyncFunction = async () => {
    setCategories((await getFAQCategories(axiosInstance)) || []);
    setAppSettings((await getAboutDetails(axiosInstance)) || false);
    setLoading(false);
  };

  useEffect(() => {
    asyncFunction();
  }, []);

  const refreshHandler = async () => {
    true;
    setCategories((await getFAQCategories(axiosInstance)) || []);
    setAppSettings((await getAboutDetails(axiosInstance)) || false);
    setRefreshing(false);
  };

  return (
    <View style={{ flex: 1 }}>
      {loading && <ScreenSpinner />}
      <Actionbar showChild showBackBtn>
        <Text style={{ ...fonts.poppinsBold, fontSize: 16 }}>Help Center</Text>
      </Actionbar>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
        stickyHeaderHiddenOnScroll
        refreshControl={
          <RefreshControl onRefresh={refreshHandler} refreshing={refreshing} />
        }
        overScrollMode="never"
      >
        {appSettings ? <InfoCard appinfos={appSettings} /> : <></>}

        <View style={{ paddingVertical: 20 }}>
          <Text style={{ ...fonts.poppinsRegular, fontSize: 16 }}>
            Categories
          </Text>

          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {categories.map((category) => {
              return (
                <FAQCategory
                  key={category.id}
                  id={category.id}
                  imageUrl={category.coverImage}
                  title={category.title}
                />
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function callButtonPress(phone) {
  if (phone != null) {
    Linking.openURL(`tel:${phone}`);
  }
}

function mailButtonPress(mail) {
  if (mail != null) {
    Linking.openURL(`mailto::${mail}`);
  }
}

function FAQCategory({ id, imageUrl, title }) {
  const navigation = useNavigation();
  const colors = useSelector(themeState).colors;
  function isValidSvgUri(url) {
    if (!url) return false;
    return url.substr(-4) === '.svg';
  }
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('HelpTopic', { id: id })}
      style={{
        backgroundColor: colors.cardColor,
        borderRadius: 8,
        padding: 16,
        margin: 8,
        width: 100,
        height: 100,
        ...utilStyles.centerXY,
      }}
    >
      <View style={{ width: 48, height: 48 }}>
        {imageUrl && isValidSvgUri(imageUrl) && (
          <SvgUri
            width={'100%'}
            height={'100%'}
            fill={colors.iconColorPrimary}
            uri={constants.baseURL + imageUrl}
          />
        )}
      </View>
      <Text style={{ color: colors.textColorPrimary }}>{title}</Text>
    </TouchableOpacity>
  );
}
export function InfoCard({ appinfos }) {
  const colors = useSelector(themeState).colors;
  return (
    <View
      style={{
        backgroundColor: colors.cardColor,
        padding: 20,
        borderRadius: 8,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={{
              ...fonts.extraBold,
              color: colors.addToCartTextColor,
              fontSize: 18,
              marginVertical: 3,
            }}
          >
            {appinfos.company_name}
          </Text>
          <Text
            style={{
              ...fonts.regular,
              color: colors.textColorSecondary,
              fontSize: 12,
              marginVertical: 2,
            }}
          >
            {appinfos.support_address}
          </Text>
          <Text
            style={{
              ...fonts.regular,
              color: colors.textColorSecondary,
              fontSize: 12,
              marginVertical: 1,
            }}
          >
            {appinfos.support_phone}
          </Text>
          <Text
            style={{
              ...fonts.regular,
              color: colors.textColorSecondary,
              fontSize: 12,
              marginVertical: 1,
            }}
          >
            {appinfos.support_email}
          </Text>
        </View>

        <ActionButtons appinfos={appinfos} />
      </View>
    </View>
  );
}

function ActionButtons({ appinfos }) {
  const buttonStyle = {
    borderRadius: 4,
    backgroundColor: 'black',
    paddingHorizontal: 12,
    paddingVertical: 6,
  };

  const buttonContainerStyle = { flex: 1, borderRadius: 4, marginVertical: 1 };

  return (
    <View style={{ justifyContent: 'center' }}>
      <ButtonRipple
        title="Call us"
        containerStyle={buttonContainerStyle}
        style={buttonStyle}
        onPress={() => callButtonPress(appinfos.support_phone.split(',')[0])}
        textStyle={{ ...fonts.medium, fontSize: 13 }}
      >
        <View style={{ marginRight: 4 }}>
          <Icon name="phone" width={12} height={12} fill="white" />
        </View>
      </ButtonRipple>
      <ButtonRipple
        title="Mail us"
        containerStyle={buttonContainerStyle}
        onPress={() => mailButtonPress(appinfos.support_email.split(',')[0])}
        style={{
          ...buttonStyle,
          backgroundColor: 'white',
          borderWidth: 2,
          paddingVertical: 6,
        }}
        textStyle={{ ...fonts.medium, fontSize: 13, color: 'black' }}
      >
        <View style={{ marginRight: 4 }}>
          <Icon name="email" width={12} height={12} fill="black" />
        </View>
      </ButtonRipple>
    </View>
  );
}
