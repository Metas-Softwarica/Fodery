import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Platform, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import PlusDarkIcon from '../../assets/icons/svgs/plus_dark.svg';
import PlusLightIcon from '../../assets/icons/svgs/plus_light.svg';
import TabView from '../components/TabView';
import CategoryTab from '../components/tabs/CategoryTab';
import FavoritesTab from '../components/tabs/FavoritesTab';
import Home from '../components/tabs/HomeTab';
import OrderTab from '../components/tabs/OrderTab';
import { utilStyles } from '../configs/utilStyles';
import { themeState } from '../store/slices/themeSlice';

function Recommendations() {
  return <></>;
}

function disableSwipeTab(navigation) {
  return {
    listeners: {
      tabPress: (e) => {
        navigation.setOptions({ swipeEnabled: false });
      },
    },
  };
}
function enableSwipeTab(navigation) {
  return {
    listeners: {
      tabPress: (e) => {
        navigation.setOptions({ swipeEnabled: true });
      },
    },
  };
}

export default function TabScreen({ navigation }) {
  const themeSelector = useSelector(themeState);
  const Tab = createBottomTabNavigator();
  const colors = themeSelector.colors;

  return (
    <>
      <StatusBar
        style={themeSelector.theme === 'light' ? 'dark' : 'light'}
        backgroundColor={colors.backgroundColor}
      />
      {Platform.OS == 'ios' ? (
        <View style={{ backgroundColor: colors.backgroundColor, height: 15 }} />
      ) : null}
      <TabView Tab={Tab}>
        <Tab.Screen
          name="Home"
          component={Home}
          {...enableSwipeTab(navigation)}
        />
        <Tab.Screen
          name="Favorites"
          component={FavoritesTab}
          {...disableSwipeTab(navigation)}
        />
        <Tab.Screen
          name="Recommendations"
          component={Recommendations}
          options={() => ({
            tabBarButton: () => (
              <TouchableOpacity
                style={{ ...utilStyles.centerXY, width: 60 }}
                onPress={() => navigation.push('Recommendation')}
              >
                {themeSelector.theme == 'dark' ? (
                  <PlusDarkIcon width={24} height={24} />
                ) : (
                  <PlusLightIcon width={24} height={24} />
                )}
                {/* <Icon name="plus_light_active" size={24}/> */}
              </TouchableOpacity>
            ),
          })}
          {...disableSwipeTab(navigation)}
        />
        <Tab.Screen
          name="Category"
          component={CategoryTab}
          {...disableSwipeTab(navigation)}
        />
        <Tab.Screen
          name="Order"
          component={OrderTab}
          {...disableSwipeTab(navigation)}
        />
      </TabView>
    </>
  );
}
