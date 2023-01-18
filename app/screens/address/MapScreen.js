import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-eva-icons';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { useDispatch, useSelector } from 'react-redux';
import ButtonRipple from '../../components/inputs/buttons/ButtonRipple';
import { fonts } from '../../configs/commonStyles';
import { constraints } from '../../configs/constants';
import { customShowMessage } from '../../customMessage';
import { themeState } from '../../store/slices/themeSlice';
import { setNewAddress } from '../../store/slices/userSlice';

export default function MapScreen({ navigation, route }) {
  const mapRef = useRef(null);
  const dispatch = useDispatch();
  const [gettingLocation, setGettingLocation] = useState(false);
  const [moving, setMoving] = useState(false);
  let [mapState, setMapState] = useState({
    initialRegion: {
      latitude: 27.7020407,
      longitude: 85.3129003,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
    marker: null,
  });
  const colors = useSelector(themeState).colors;
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!!route.params.initialMapAddress) {
      setMapState(route.params.initialMapAddress);
    }
  }, []);
  const myLocationPressed = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      customShowMessage('Location permission not granted!!', 'danger', colors);
      return;
    }
    setGettingLocation(true);
    let location = await Location.getCurrentPositionAsync({});
    setGettingLocation(false);
    mapRef.current.animateCamera({
      center: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
    });
    setMapState({
      initialRegion: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      marker: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
    });
  };
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      <StatusBar translucent={false} />
      <View
        style={{
          position: 'absolute',
          zIndex: 1,
          top: 0,
          left: 0,
          paddingLeft: 10,
          paddingTop: 30,
        }}
      >
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center', padding: 20 }}
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
          {
            <Text
              style={{
                ...fonts.regular,
                fontSize: 16,
                textAlignVertical: 'bottom',
                color: colors.textColorPrimary,
              }}
            >
              Go Back
            </Text>
          }
        </TouchableOpacity>
      </View>
      <View style={{ width: '100%', flex: 1, flexDirection: 'column' }}>
        <MapView
          style={{ flexGrow: 1, flex: 1 }}
          // region={mapState.initialRegion}
          ref={mapRef}
          showsUserLocation={true}
          initialRegion={mapState.initialRegion}
          onRegionChange={() => {
            if (!mapState.marker) {
              return;
            }
            setMapState({ ...mapState, marker: null });
            // bottomRef.current.close();
            setMoving(true);
          }}
          onRegionChangeComplete={(e) => {
            // bottomRef.current.expand();
            setMapState({
              initialRegion: { ...e },
              marker: { latitude: e.latitude, longitude: e.longitude },
            });
            setMoving(false);
          }}
          provider={PROVIDER_GOOGLE}
        />

        <View
          style={{
            width: '100%',
            height: 50,
          }}
        >
          <ButtonRipple
            title={
              gettingLocation ? 'Getting your locaiton' : 'CONFIRM ADDRESS'
            }
            containerStyle={{
              width: '100%',
              borderRadius: 2,
              padding: 4,
              // maxWidth: 400,
            }}
            style={{
              justifyContent: 'center',
              borderRadius: 2,
              height: 42,
              paddingHorizontal: 16,
              backgroundColor: colors.textColorPrimary,
            }}
            textStyle={{
              ...fonts.bold,
              fontSize: constraints.textSizeHeading4,
              color: colors.backgroundColor,
            }}
            disabled={!mapState.marker || gettingLocation}
            onPress={() => {
              dispatch(setNewAddress(mapState));
              navigation.goBack();
            }}
          />
        </View>
        <TouchableOpacity
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            position: 'absolute',
            bottom: 55,
            right: 5,
            backgroundColor: 'black',
            borderRadius: 1000,
            height: 50,
            width: 50,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
          onPress={() => {
            myLocationPressed();
          }}
        >
          <Icon name="pin-outline" fill={'white'} width={20} height={20} />
          {
            <Text
              style={{
                ...fonts.regular,
                fontSize: 11,
                textAlignVertical: 'bottom',
                color: colors.textColorPrimary,
              }}
            >
              Me
            </Text>
          }
        </TouchableOpacity>
      </View>

      <View
        style={{
          position: 'absolute',
          transform: [{ translateY: -35 }],
        }}
      >
        <Icon
          name={!moving ? 'pin' : 'pin-outline'}
          fill="#000"
          width={30}
          height={30}
        />
      </View>

      {/* <BottomSheet
            index={0}
            snapPoints={[50]}
            ref={bottomRef}
            backgroundStyle={{ borderRadius: 0 }}
            handleStyle={{ display: "none" }}
        >
            
        </BottomSheet> */}
    </View>
  );
}
