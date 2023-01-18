import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import * as React from 'react';
import TabScreen from './TabScreen';
import ProfileScreen from './user/ProfileScreen';

export default function TopTabScreen() {
  const Tab = createMaterialTopTabNavigator();

  return (
    <Tab.Navigator
      tabBar={() => <></>}
      screenOptions={({ route }) => ({
        animation: 'slide_from_right',
      })}
    >
      <Tab.Screen
        name="BottomTab"
        component={TabScreen}
        options={() => ({
          animation: 'slide_from_right',
        })}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
