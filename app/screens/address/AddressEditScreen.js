import React, { useEffect } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useDispatch, useSelector } from 'react-redux';
import Actionbar from '../../components/Actionbar';
import { AddressForm } from '../../components/address/AddressForm';
import { fonts } from '../../configs/commonStyles';
import { useAxiosObject } from '../../contexts/axios-context';
import { customShowMessage } from '../../customMessage';
import { updateUserAddress } from '../../services/userService';
import { themeState } from '../../store/slices/themeSlice';
import { setNewAddress, userState } from '../../store/slices/userSlice';

export function AddressEditScreen({ navigation, route }) {
  const axiosInstance = useAxiosObject();
  const id = route.params.id;
  const address = route.params.address;
  const dispatch = useDispatch();
  const addressSelector = useSelector(userState);
  const colors = useSelector(themeState).colors;

  useEffect(() => {
    dispatch(
      setNewAddress({
        initialRegion: {
          latitude: address.latitude,
          longitude: address.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        },
        marker: { latitude: address.latitude, longitude: address.longitude },
      })
    );
  }, []);

  const formStyles = StyleSheet.create({
    label: {
      ...fonts.regular,
      color: colors.textColorPrimary,
      marginBottom: 12,
    },
  });

  async function updateAddress(v) {
    console.log(v);
    v.country = 1;
    // v.state = 1;
    // v.city = 1;
    let obj = { ...v, ...addressSelector.newAddress.marker };
    let r = await updateUserAddress(axiosInstance, obj);
    if (r.status === 200) {
      navigation.navigate('AddressBook');
      return;
    }

    customShowMessage("Couldn't update address", 'danger', colors);
  }

  return (
    <>
      <Actionbar showChild showBackBtn title="Edit" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <Text style={formStyles.label}>Set your location on map*</Text>
          <View
            style={{
              flex: 1,
              marginBottom: 30,
              isplay: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MapView
              style={{ width: '100%', height: 200 }}
              initialRegion={addressSelector.newAddress.initialRegion}
              pitchEnabled={false}
              rotateEnabled={false}
              scrollEnabled={false}
              zoomEnabled={false}
              cacheEnabled={false}
              provider={PROVIDER_GOOGLE}
              region={addressSelector.newAddress.initialRegion}
              onPress={() => {
                navigation.navigate('Map', {
                  initialMapAddress: addressSelector.newAddress,
                });
              }}
            >
              {addressSelector.newAddress.marker && (
                <Marker coordinate={addressSelector.newAddress.marker} />
              )}
            </MapView>
          </View>

          <AddressForm id={id} address={address} onSubmit={updateAddress} />
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
