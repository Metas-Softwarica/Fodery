import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSelector } from 'react-redux';
import Actionbar from '../../components/Actionbar';
import Icon from '../../components/Icon';
import ButtonRipple from '../../components/inputs/buttons/ButtonRipple';
import { Gap } from '../../components/util/Gap';
import { fonts } from '../../configs/commonStyles';
import { constraints } from '../../configs/constants';
import { useAxiosObject } from '../../contexts/axios-context';
import { customShowMessage } from '../../customMessage';
import { getCities, getStates } from '../../services/appService';
import {
  deleteUserAddress,
  getUserAddresses,
} from '../../services/userService';
import { themeState } from '../../store/slices/themeSlice';

export function AddressBookScreen({ navigation, route }) {
  const [addresses, setAddresses] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [itemsState, setItemsState] = useState([]);
  const [itemsCity, setItemsCity] = useState([]);

  const axiosInstance = useAxiosObject();
  const colors = useSelector(themeState).colors;

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

    let result = (await getUserAddresses(axiosInstance)) || [];
    setAddresses(result);
    setRefreshing(false);

    const willFocusSubscription = navigation.addListener('focus', async () => {
      let result = (await getUserAddresses(axiosInstance)) || [];
      setAddresses(result);
      setRefreshing(false);
    });

    return willFocusSubscription;
  };

  useEffect(() => {
    asyncFunction();
  }, []);

  async function deleteAddress(id) {
    let res = await deleteUserAddress(axiosInstance, id);
    setRefreshing(true);

    if (res.status === 204) {
      customShowMessage('Address deleted!', 'info');
    } else {
      customShowMessage("Couldn't delete address.", 'danger', colors);
    }
  }

  function refreshHandler() {
    setRefreshing(true);
  }

  return (
    <>
      <Actionbar showChild showBackBtn title="Address Book" />
      <ScrollView
        refreshControl={
          <RefreshControl onRefresh={refreshHandler} refreshing={refreshing} />
        }
        contentContainerStyle={{ padding: 16, flexGrow: 1 }}
      >
        {addresses.map((item) => {
          return (
            <AddressCard
              isDefault={item.isDefault}
              key={item.id}
              address={item}
              states={itemsState}
              cities={itemsCity}
              onDelete={deleteAddress}
              clickable={false}
            />
          );
        })}
      </ScrollView>
      <View style={{ position: 'absolute', bottom: 40, right: 40 }}>
        <ButtonRipple
          containerStyle={{ borderRadius: 99, width: 50, height: 50 }}
          style={{
            backgroundColor: colors.textColorPrimary,
            padding: 0,
            width: 50,
            height: 50,
          }}
          onPress={() => navigation.push('AddressAdd')}
        >
          <Icon
            name="plus"
            fill={colors.backgroundColor}
            width={25}
            height={25}
          />
        </ButtonRipple>
      </View>
    </>
  );
}

function AddressCardOptions({ address, isDefault, onDelete, onSetDefault }) {
  const [showMenu, setShowMenu] = useState(false);

  const navigation = useNavigation();
  const colors = useSelector(themeState).colors;
  const { width, height } = useWindowDimensions();

  return (
    <>
      <TouchableHighlight
        onPress={() =>
          navigation.navigate('AddressEdit', {
            id: address.id,
            address: address,
          })
        }
        underlayColor={colors.cardColorRipple}
      >
        <Icon
          name="edit"
          fill={colors.textColorPrimary}
          height={24}
          width={24}
        />
      </TouchableHighlight>
      <Gap x={6} />

      <TouchableHighlight
        onPress={onDelete}
        underlayColor={colors.cardColorRipple}
      >
        <Icon name="delete" fill="tomato" height={24} width={24} />
      </TouchableHighlight>

      {!isDefault && (
        <>
          <Gap x={6} />
          <Icon
            name="option"
            fill={
              showMenu ? colors.textColorSecondary : colors.textColorPrimary
            }
            height={24}
            width={24}
            onPressIn={() => setShowMenu((v) => !v)}
          />
          {showMenu && (
            <View>
              {/*<TouchableOpacity*/}
              {/*    style={{*/}
              {/*        // position: "absolute",*/}
              {/*        top: "130%",*/}
              {/*        right: 0,*/}
              {/*        backgroundColor: colors.textColorSecondary,*/}
              {/*        paddingHorizontal: 6,*/}
              {/*        paddingVertical: 4,*/}
              {/*        borderRadius: constraints.borderRadiusMin,*/}
              {/*    }}*/}
              {/*    onPress={()=> console.log("pressed")}*/}
              {/*>*/}
              {/*</TouchableOpacity>*/}

              <TouchableHighlight
                onPress={() => {}}
                underlayColor={colors.cardColorRipple}
                style={{
                  position: 'absolute',
                  zIndex: 1,
                  top: '130%',
                  right: 0,
                  backgroundColor: colors.textColorSecondary,
                  borderRadius: constraints.borderRadiusMin,
                  paddingHorizontal: 6,
                  paddingVertical: 4,
                }}
              >
                <Text
                  style={{ ...fonts.regular, color: colors.backgroundColor }}
                >
                  Set as Default
                </Text>
              </TouchableHighlight>
            </View>
          )}
        </>
      )}
    </>
  );
}

export function AddressCard({
  isDefault = false,
  address,
  states = [],
  cities = [],
  onDelete,
  showOptions = true,
  checked = false,
  setCheckedId,
  clickable = true,
}) {
  const { label, fname, zipCode, streetAdd1, city, state, phone } = address;

  const colors = useSelector(themeState).colors;
  const theme = useSelector(themeState).theme;
  const styles = getAddressCardStyles(colors, checked, theme);

  return (
    <TouchableOpacity
      underlayColor={colors.cardColorRipple}
      style={styles.container}
      onPress={() => setCheckedId(address.id)}
      disabled={checked || !clickable}
    >
      <View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.label}>{label}</Text>
          {showOptions && (
            <View style={{ flexDirection: 'row' }}>
              <AddressCardOptions
                address={address}
                onDelete={() => onDelete(address.id)}
                onSetDefault={() => console.log('pressed')}
              />
            </View>
          )}
        </View>

        <View style={{ marginTop: 12 }}>
          {fname ? <Text style={styles.contentText}>{fname}</Text> : <></>}
          {streetAdd1 ? (
            <Text style={styles.contentText}>{streetAdd1}</Text>
          ) : (
            <></>
          )}
          {city ? (
            <Text style={styles.contentText}>{cities[city]}</Text>
          ) : (
            <></>
          )}
          {state ? (
            <Text style={styles.contentText}>{states[state]}</Text>
          ) : (
            <></>
          )}
          {zipCode ? <Text style={styles.contentText}>{zipCode}</Text> : <></>}
          {phone ? <Text style={styles.contentText}>{phone}</Text> : <></>}
        </View>

        {isDefault && <Text style={styles.default}>DEFAULT</Text>}
        {checked && (
          <View style={styles.checkbox}>
            <Icon name="check_dark_green" size={22} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

function getAddressCardStyles(colors, checked, theme) {
  return StyleSheet.create({
    container: {
      padding: constraints.cardPadding,
      marginBottom: 10,
      backgroundColor: checked ? colors.textColorSecondary : colors.cardColor,
      borderRadius: constraints.borderRadiusSmall,
    },
    label: {
      color: checked ? colors.backgroundColor : colors.textColorPrimary,
      ...fonts.bold,
      fontSize: constraints.textSizeHeading4,
      textTransform: 'uppercase',
    },
    contentText: {
      color: checked ? colors.backgroundColor : colors.textColorPrimary,
      ...fonts.light,
    },
    default: {
      ...fonts.bold,
      color: checked ? colors.backgroundColor : colors.textColorSecondary,
      position: 'absolute',
      bottom: 16,
      right: 16,
    },
    checkbox: {
      position: 'absolute',
      top: 0,
      right: 0,
    },
  });
}
