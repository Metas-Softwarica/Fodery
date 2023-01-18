import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useSelector } from 'react-redux';
import Actionbar from '../components/Actionbar';
import BudgetRange from '../screens/recommendations/BudgetRange';
import CustomerType from '../screens/recommendations/CustomerType';
import DietsCount from '../screens/recommendations/DietsCount';
import DietsSelect from '../screens/recommendations/DietsSelect';
import FoodMultiType from '../screens/recommendations/FoodMultiType';
import HungerLevel from '../screens/recommendations/HungerLevel';
import SuggestionScreen from '../screens/recommendations/SuggestionScreen';
import { selectState } from '../store/slices/recommendationSlice';
import { themeState } from '../store/slices/themeSlice';

export default function RecommendationScreen() {
  const RecommendationStack = createNativeStackNavigator();
  const theme = useSelector(themeState).theme;
  const colors = useSelector(themeState).colors;
  const selector = useSelector(selectState);

  const { title, route } = selector.currentScreen;

  return (
    <>
      <StatusBar
        style={theme === 'light' ? 'dark' : 'light'}
        backgroundColor={colors.statusBarColor}
      />
      <Actionbar title={title} showCloseBtn />
      <RecommendationStack.Navigator
        screenOptions={screenOptions}
        initialRouteName={'CustomerType'}
      >
        <RecommendationStack.Screen
          name="CustomerType"
          component={CustomerType}
          options={({ navigation }) => ({
            animation: 'slide_from_right',
          })}
        />

        <RecommendationStack.Screen
          name="DietsCount"
          component={DietsCount}
          options={({ navigation }) => ({
            animation: 'slide_from_right',
          })}
        />

        <RecommendationStack.Screen
          name="DietsSelect"
          component={DietsSelect}
          options={({ navigation }) => ({
            animation: 'slide_from_right',
          })}
        />

        <RecommendationStack.Screen
          name="FoodMultiType"
          component={FoodMultiType}
          options={({ navigation }) => ({
            animation: 'slide_from_right',
          })}
        />

        <RecommendationStack.Screen
          name="BudgetRange"
          component={BudgetRange}
          options={({ navigation }) => ({
            animation: 'slide_from_right',
          })}
        />

        <RecommendationStack.Screen
          name="HungerLevel"
          component={HungerLevel}
          options={({ navigation }) => ({
            animation: 'slide_from_right',
          })}
        />

        <RecommendationStack.Screen
          name="Suggestion"
          component={SuggestionScreen}
          options={() => ({
            animation: 'slide_from_right',
          })}
        />
      </RecommendationStack.Navigator>
    </>
  );
}

const screenOptions = {
  headerShown: false,
};
