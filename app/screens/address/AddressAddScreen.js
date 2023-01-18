import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useSelector } from 'react-redux';
import Actionbar from '../../components/Actionbar';
import { AddressForm } from '../../components/address/AddressForm';
import { fonts } from '../../configs/commonStyles';
import { useAxiosObject } from '../../contexts/axios-context';
import { customShowMessage } from '../../customMessage';
import { addUserAddress } from '../../services/userService';
import { themeState } from '../../store/slices/themeSlice';
import { userState } from '../../store/slices/userSlice';

export default function AddressAddScreen({ route, navigation }) {
  const axiosInstance = useAxiosObject();
  const addressSelector = useSelector(userState);
  const colors = useSelector(themeState).colors;

  async function addAddress(v) {
    if (!addressSelector.newAddress.marker) {
      customShowMessage('Choose a location from the map', 'danger', colors);
      return;
    }
    delete v.id;
    v.country = 1;
    // v.state = 1;
    // v.city = 1;
    let obj = { ...v, ...addressSelector.newAddress.marker };
    let r = await addUserAddress(axiosInstance, obj);
    if (r.status === 200) {
      // navigation.navigate("AddressBook", { refresh: true });
      navigation.goBack();
      customShowMessage('Address Added', 'success', colors);
      return;
    }
    customShowMessage("Couldn't save address", 'danger', colors);
  }
  const formStyles = StyleSheet.create({
    label: {
      ...fonts.regular,
      color: colors.textColorPrimary,
      marginBottom: 12,
    },
  });

  return (
    <>
      <Actionbar showBackBtn title="Add" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
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
              region={addressSelector.newAddress.initialRegion}
              onPress={() => {
                navigation.navigate('Map', {
                  initialMapAddress: addressSelector.newAddress,
                });
              }}
              provider={PROVIDER_GOOGLE}
            >
              {addressSelector.newAddress.marker && (
                <Marker coordinate={addressSelector.newAddress.marker} />
              )}
            </MapView>
          </View>
          <AddressForm onSubmit={addAddress} />
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
