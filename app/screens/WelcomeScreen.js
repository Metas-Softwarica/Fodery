import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  Image,
  NativeModules,
  Platform,
  SafeAreaView,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { ExpandingDot } from 'react-native-animated-pagination-dots';
import { Icon } from 'react-native-eva-icons';
import { useSelector } from 'react-redux';
import { ButtonOpacity } from '../components/inputs/buttons/ButtonOpacity';
import ButtonRipple from '../components/inputs/buttons/ButtonRipple';
import { fonts } from '../configs/commonStyles';
import { constraints } from '../configs/constants';
import { utilStyles } from '../configs/utilStyles';
import { registerFirstOpen } from '../services/appService';
import { themeState } from '../store/slices/themeSlice';

const { StatusBarManager } = NativeModules;

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 0 : StatusBarManager.HEIGHT;

export function WelcomeScreen({ navigation }) {
  const colors = useSelector(themeState).colors;
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const { width, height } = useWindowDimensions();

  const [information, setInformation] = useState([
    {
      id: 1,
      title: 'Choose Your Meal',
      content:
        'Order hundreds of types of food, drinks, and many more at any time, right from your phone.',
      image:
        'https://i.pinimg.com/564x/54/b5/86/54b586b19c7d3e63d330be316892883c.jpg',
    },
    {
      id: 2,
      title: 'Fast Delivery',
      content:
        'Get ready for our delivery heroes to deliver food to your door.',
      image:
        'https://i.pinimg.com/564x/1b/6c/28/1b6c2881cc0c3a548c308103528ec352.jpg',
    },
    {
      id: 3,
      title: 'Bon appetite!',
      content: 'Enjoy your tasty and hot food, as if there was no tomorrow.',
      image:
        'https://i.pinimg.com/564x/46/5a/48/465a48492a7ef0c042b7f3bd404e5b92.jpg',
    },
  ]);

  const [currentInfoIndex, setCurrentInfoIndex] = useState(0);

  const [showSkipBtn, setShowSkipBtn] = useState(true);

  const flatListRef = useRef(null);
  const onViewRef = useRef(({ viewableItems, changed }) => {
    setCurrentInfoIndex(viewableItems[0].index);
  });
  const viewConfigRef = React.useRef({ viewAreaCoveragePercentThreshold: 50 });

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    registerFirstOpen();
    fadeOut();
    fadeIn();

    if (currentInfoIndex === information.length - 1) {
      setShowSkipBtn(false);
      return;
    }
    setShowSkipBtn(true);
  }, [currentInfoIndex]);

  function fadeIn() {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }

  function fadeOut() {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 0,
      useNativeDriver: false,
    }).start();
  }

  function navigateNext() {
    if (currentInfoIndex === information.length - 1) {
      navigation.replace('Auth');

      return;
    }

    flatListRef.current.scrollToIndex({
      animated: true,
      index: currentInfoIndex + 1,
    });
    registerFirstOpen();
  }

  return (
    <View>
      <View style={{}}>
        <FlatList
          ref={flatListRef}
          data={information}
          renderItem={({ item }) => <InfoCard information={item} />}
          pagingEnabled
          style={{}}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            {
              useNativeDriver: false,
            }
          )}
          keyExtractor={(item) => item.id}
          horizontal
          decelerationRate={'normal'}
          scrollEventThrottle={16}
          onViewableItemsChanged={onViewRef.current}
          viewabilityConfig={viewConfigRef.current}
          overScrollMode="never"
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ justifyContent: 'center' }}
        />
      </View>
      <SafeAreaView
        style={{
          flex: 1,
          paddingTop: STATUSBAR_HEIGHT + 12,
          position: 'absolute',
          width: width,
          height: height,
        }}
      >
        <StatusBar style="auto" />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: constraints.screenPaddingHorizontal,
          }}
        >
          <View>
            <ExpandingDot
              data={information}
              expandingDotWidth={24}
              scrollX={scrollX}
              inActiveDotOpacity={0.3}
              dotStyle={{
                width: 7,
                height: 7,
                borderRadius: 5,
              }}
              containerStyle={{
                top: 0,
                left: -5,
                bottom: 0,
                alignItems: 'center',
              }}
              activeDotColor="white"
              inActiveDotColor="white"
            />
          </View>
          <View>
            <ButtonOpacity
              title="Skip"
              textStyle={{
                fontFamily: fonts.light.fontFamily,
                fontSize: 12,
              }}
              containerStyle={{
                opacity: showSkipBtn ? 1 : 0,
              }}
              btnStyle={{}}
              onPress={() => {
                navigation.navigate('Auth');
              }}
            />
          </View>
        </View>
        <View
          style={{
            marginHorizontal: constraints.screenPaddingHorizontal,
            marginTop: 18,
          }}
        >
          <Text
            style={{
              fontSize: 26,
              fontFamily: fonts.extraBold.fontFamily,
              marginBottom: 5,
              color: colors.onboardingTextColor,
            }}
          >
            {information[currentInfoIndex].title}
          </Text>

          <Text
            style={{
              fontSize: 12,
              fontFamily: fonts.light.fontFamily,
              color: colors.onboardingTextColor,
            }}
          >
            {information[currentInfoIndex].content}
          </Text>
        </View>

        <View
          style={{
            flex: 1,
            alignItems: 'flex-end',
            marginHorizontal: constraints.screenPaddingHorizontal,
          }}
        >
          <Animated.View
            style={{
              flex: 1,
              marginTop: 12,
              opacity: fadeAnim,
              ...utilStyles.centerX,
            }}
          >
            <ButtonRipple
              style={{
                padding: 8,
                width: 42,
                height: 42,
                borderRadius: 8,
              }}
              containerStyle={{
                marginTop: 'auto',
                marginBottom: 32,
                backgroundColor: 'white',
                borderRadius: 8,
              }}
              children={
                <Icon
                  name="chevron-right-outline"
                  fill="#000"
                  width={30}
                  height={30}
                />
              }
              onPress={navigateNext}
            />
          </Animated.View>
        </View>
      </SafeAreaView>
    </View>
  );
}

export function InfoCard({ information, index }) {
  const { width, height } = useWindowDimensions();

  return (
    <Animated.View
      style={{ justifyContent: 'center', alignItems: 'center', width: width }}
    >
      <Image
        source={{ uri: information.image }}
        style={{ width: width, height: height }}
      />
    </Animated.View>
  );
}
