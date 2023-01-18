import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Actionbar from '../components/Actionbar';
import { CompletionTab } from '../components/checkout/CompletionTab';
import { PaymentTab } from '../components/checkout/PaymentTab';
import ButtonRipple from '../components/inputs/buttons/ButtonRipple';
import ScreenSpinner from '../components/spinners/ScreenSpinner';
import { fonts } from '../configs/commonStyles';
import { constraints } from '../configs/constants';
import { utilStyles } from '../configs/utilStyles';
import { useAxiosObject } from '../contexts/axios-context';
import { customShowMessage } from '../customMessage';
import { getCities, getStates } from '../services/appService';
import { getUserAddresses } from '../services/userService';
import { checkoutState, updateShipping } from '../store/slices/checkoutSlice';
import { themeState } from '../store/slices/themeSlice';
import { userState } from '../store/slices/userSlice';
import { AddressCard } from './address/AddressBookScreen';

const tabs = { shipping: 1, payment: 2, completion: 3 };
export default function CheckoutScreen({ navigation }) {
  const [pickedStep, setPickedStep] = useState(1);
  const [checkoutInfo, setCheckoutInfo] = useState({});
  const [loadingStage, setLoadingStage] = useState(false);
  const colors = useSelector(themeState).colors;

  return (
    <View style={{ flex: 1 }}>
      <Actionbar
        showBackBtn
        navigation={navigation}
        title="Checkout"
        showProfile
      />

      <Tabs
        pickedStep={pickedStep}
        setPickedStep={setPickedStep}
        loadingStage={loadingStage}
      />
      {pickedStep === tabs.shipping ? (
        <Text
          style={{
            ...fonts.bold,
            color: colors.textColorPrimary,
            paddingHorizontal: 20,
            marginVertical: 12,
          }}
        >
          My saved addresses
        </Text>
      ) : (
        <></>
      )}
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {pickedStep === tabs.shipping && (
          <ShippingTab
            setPickedStep={setPickedStep}
            loadingStage={loadingStage}
            setLoadingStage={setLoadingStage}
          />
        )}
        {pickedStep === tabs.payment && (
          <PaymentTab
            setPickedStep={setPickedStep}
            setCheckoutInfo={setCheckoutInfo}
            loadingStage={loadingStage}
            setLoadingStage={setLoadingStage}
          />
        )}
        {pickedStep === tabs.completion && (
          <CompletionTab checkoutInfo={checkoutInfo} />
        )}
      </ScrollView>
    </View>
  );
}

function ShippingTab({ setPickedStep, loadingStage, setLoadingStage }) {
  const axiosInstance = useAxiosObject();
  const selector = useSelector(checkoutState);
  const userSelector = useSelector(userState);
  const [addresses, setAddresses] = useState([]);
  const dispatch = useDispatch();
  const colors = useSelector(themeState).colors;
  const theme = useSelector(themeState).theme;
  const buttonStyle = getButtonStyle(colors, theme);
  const buttonOutlneStyle = getButtonOutlineStyles(colors);
  const navigation = useNavigation();
  const [itemsState, setItemsState] = useState([]);
  const [itemsCity, setItemsCity] = useState([]);

  const asyncFunction = async () => {
    let states = (await getStates(axiosInstance)).results;
    let statesArray = {};
    states.forEach((element) => {
      statesArray[element.id] = element.title;
    });
    setItemsState(statesArray);

    let cities = (await getCities(axiosInstance)).results;
    let citiesArray = {};
    cities.forEach((element) => {
      citiesArray[element.id] = element.title;
    });
    setItemsCity(citiesArray);

    let res = await getUserAddresses(
      axiosInstance,
      userSelector.tokens.access_token
    );
    if (res) {
      setAddresses(res);
      let defaultAddress = res.find((address) => address.isDefault === true);
      if (defaultAddress != null) {
        dispatch(updateShipping({ deliveryAddress: defaultAddress.id }));
      }
    }

    const unsubscribe = navigation.addListener('focus', async () => {
      let res = await getUserAddresses(
        axiosInstance,
        userSelector.tokens.access_token
      );
      if (res) {
        setAddresses(res);
      }
    });
  };

  useEffect(() => {
    asyncFunction();
  }, []);

  const styles = getShippingTabStyles(colors);
  return (
    <>
      <View style={styles.view}>
        <View style={styles.wrapper}>
          {console.log(addresses)}
          {addresses.map((address) => (
            <AddressCard
              // isDefault={address.isDefault}
              states={itemsState}
              cities={itemsCity}
              key={address.id}
              address={address}
              showOptions={false}
              checked={selector.shipping.deliveryAddress === address.id}
              setCheckedId={(id) => {
                dispatch(updateShipping({ deliveryAddress: id }));
              }}
            />
          ))}
        </View>

        <ButtonRipple
          containerStyle={buttonOutlneStyle.container}
          style={{ ...buttonOutlneStyle.button, marginBottom: 20 }}
          textStyle={buttonOutlneStyle.text}
          title="+ New Address"
          onPress={() => {
            navigation.navigate('AddressAdd');
          }}
        />

        <View style={{ marginTop: 'auto' }}>
          <ButtonRipple
            containerStyle={buttonStyle.containerStyle}
            style={buttonStyle.style}
            textStyle={buttonStyle.textStyle}
            onPress={() => {
              if (selector.shipping.deliveryAddress !== null) {
                setPickedStep(tabs.payment);
                return;
              }
              customShowMessage(
                'Choose an address to continue!',
                'danger',
                colors
              );
            }}
            disabled={addresses.length === 0}
            title="CONTINUE"
          />
        </View>
      </View>
      {loadingStage && <ScreenSpinner />}
    </>
  );
}

function getButtonOutlineStyles(colors) {
  return StyleSheet.create({
    container: {
      // paddingHorizontal: 20,
      borderRadius: 0,
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    button: {
      borderColor: colors.textColorPrimary,
      borderWidth: 0.5,
      minWidth: 0,
      width: 120,
      borderRadius: constraints.borderRadiusMin,
      backgroundColor: null,
      paddingVertical: constraints.buttonPaddingVerticalSmall,
    },
    text: {
      color: colors.textColorPrimary,
      ...fonts.regular,
      fontSize: constraints.textSizeLabel2,
    },
  });
}

function getShippingTabStyles(colors) {
  return StyleSheet.create({
    view: {
      flexGrow: 1,
      paddingHorizontal: 20,
    },
    heading: {
      ...fonts.bold,
      color: colors.textColorPrimary,
    },
    wrapper: {
      marginVertical: 15,
    },
    addressWrapper: {
      marginLeft: 20,
    },
    iconWrapper: {
      marginLeft: 'auto',
    },
    inputWrapper: {
      marginTop: 20,
    },
    labelStyle: {
      fontSize: 15,
      color: 'grey',
    },
    radioWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    rowWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
  });
}

function Tabs({ pickedStep, setPickedStep, loadingStage }) {
  const colors = useSelector(themeState).colors;

  function tabBackgroundStyle(isSelected) {
    const styles = [
      {
        width: '30%',
        height: 35,
        backgroundColor: isSelected
          ? colors.backgroundColor
          : colors.textColorSecondary,
        borderRadius: 6,
        ...utilStyles.centerXY,
      },
    ];
    return StyleSheet.create(styles);
  }

  function headingStyle(isSelected) {
    const styles = [
      {
        color: isSelected ? colors.textColorPrimary : colors.backgroundColor,
        ...fonts.regular,
        fontSize: constraints.textSizeHeading4,
      },
    ];

    return StyleSheet.create(styles);
  }

  const styles = StyleSheet.create({
    view: {
      flexDirection: 'row',
      backgroundColor: colors.textColorSecondary,
      marginHorizontal: constraints.screenPaddingHorizontal,
      marginTop: 10,
      marginBottom: 0,
      padding: 2,
      borderRadius: constraints.borderRadiusSmall,
      justifyContent: 'space-between',
    },
    text: {
      ...fonts.bold,
      color: 'black',
    },
    textActive: {
      color: colors.textColorPrimary,
    },
  });

  return (
    <View style={styles.view}>
      <Pressable
        onPress={() => {
          if (loadingStage || pickedStep === tabs.completion) {
            return;
          }
          setPickedStep((curr) => {
            if (curr > 1) {
              return 1;
            }
            return curr;
          });
        }}
        style={tabBackgroundStyle(pickedStep === tabs.shipping)}
      >
        <Text style={headingStyle(pickedStep === tabs.shipping)}>Shipping</Text>
      </Pressable>
      <Pressable
        onPress={() => {
          if (loadingStage || pickedStep === tabs.completion) {
            return;
          }
          setPickedStep((curr) => {
            if (curr > 2) {
              return 2;
            }
            return curr;
          });
        }}
        style={tabBackgroundStyle(pickedStep === tabs.payment)}
      >
        <Text style={headingStyle(pickedStep === tabs.payment)}>Payment</Text>
      </Pressable>
      <Pressable style={tabBackgroundStyle(pickedStep === tabs.completion)}>
        <Text style={headingStyle(pickedStep === tabs.completion)}>
          Completion
        </Text>
      </Pressable>
    </View>
  );
}

export function getButtonStyle(colors, theme) {
  return StyleSheet.create({
    containerStyle: {
      marginBottom: 30,
      borderRadius: 6,
    },
    style: {
      borderRadius: 6,
      paddingVertical: 12,
      backgroundColor: theme == 'light' ? colors.black : colors.accentColor,
    },
    textStyle: {
      ...fonts.bold,
      fontSize: 13,
      letterSpacing: 0.9,
      color: colors.backgroundColor,
    },
  });
}
