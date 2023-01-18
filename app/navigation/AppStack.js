import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import RecommendationScreen from '../navigation/RecommendationStack';
import AboutScreen from '../screens/AboutScreen';
import AllReview from '../screens/AllReview';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import EmailVerificationSentScreen from '../screens/EmailVerificationSentScreen';
import ItemByCategoryScreen from '../screens/ItemByCategoryScreen';
import Item from '../screens/ItemScreen';
import RewardShop from '../screens/RewardShop';
import TermsScreen from '../screens/TermsScreen';
import TopTabScreen from '../screens/TopTabScreen';
import { WelcomeScreen } from '../screens/WelcomeScreen';
import AddressAddScreen from '../screens/address/AddressAddScreen';
import { AddressBookScreen } from '../screens/address/AddressBookScreen';
import { AddressEditScreen } from '../screens/address/AddressEditScreen';
import MapScreen from '../screens/address/MapScreen';
import AuthScreen from '../screens/auth/AuthScreen';
import PasswordChanged from '../screens/auth/PasswordChangedScreen';
import HelpCenterScreen from '../screens/help/HelpCenterScreen';
import HelpTopicDetailScreen from '../screens/help/HelpTopicDetailScreen';
import HelpTopicScreen from '../screens/help/HelpTopicScreen';
import OrderInfoScreen from '../screens/orders/OrderInfoScreen';
import OrderReceiptScreen from '../screens/orders/OrderReceiptScreen';
import OrdersListScreen from '../screens/orders/OrdersListScreen';
import ContactScreen from '../screens/settings/ContactScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import ChangePasswordScreen from '../screens/user/ChangePasswordScreen';
import EditProfileScreen from '../screens/user/EditProfileScreen';
import UserScreen from '../screens/user/UserScreen';

export default function AppStack({ selector, showWelcomeScreen, firstOpen }) {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator mode="modal" headerMode="none">
      {!selector.tokens || selector.phoneVerified !== 1 ? (
        <>
          {showWelcomeScreen === firstOpen.yes && (
            <Stack.Screen
              name="Welcome"
              component={WelcomeScreen}
              options={() => ({
                headerShown: false,
              })}
            />
          )}

          {selector.passwordReset && (
            <Stack.Screen
              name="PasswordChanged"
              component={PasswordChanged}
              options={() => ({
                headerShown: false,
              })}
            />
          )}

          <Stack.Screen
            name="Auth"
            component={AuthScreen}
            options={() => ({
              headerShown: false,
            })}
          />

          <Stack.Screen
            name="Terms"
            component={TermsScreen}
            options={() => ({
              headerShown: false,
            })}
          />

          <Stack.Screen
            name="EmailVerificationScreen"
            component={EmailVerificationSentScreen}
            options={() => ({
              headerShown: false,
            })}
          />
        </>
      ) : (
        <>
          {/*<Stack.Screen name="Tab" component={TabScreen} options={() => ({*/}
          {/*    headerShown: false*/}
          {/*})} />*/}

          <Stack.Screen
            name="TopTab"
            component={TopTabScreen}
            options={() => ({
              headerShown: false,
              animation: 'slide_from_right',
            })}
          />

          <Stack.Screen
            name="AllReview"
            component={AllReview}
            options={() => ({
              headerShown: false,
              animation: 'slide_from_right',
            })}
          />

          <Stack.Screen
            name="Item"
            component={Item}
            options={() => ({
              headerShown: false,
            })}
          />

          <Stack.Screen
            name="Recommendation"
            component={RecommendationScreen}
            options={() => ({
              header: () => null,
            })}
          />

          <Stack.Screen
            name="ItemByCategory"
            component={ItemByCategoryScreen}
            options={() => ({
              headerShown: false,
              animation: 'none',
            })}
          />

          <Stack.Screen
            name="Checkout"
            component={CheckoutScreen}
            options={() => ({
              headerShown: false,
            })}
          />

          <Stack.Screen
            name="OrdersList"
            component={OrdersListScreen}
            options={() => ({
              headerShown: false,
            })}
          />

          <Stack.Screen
            name="OrderInfo"
            component={OrderInfoScreen}
            options={() => ({
              headerShown: false,
            })}
          />

          <Stack.Screen
            name="OrderReceipt"
            component={OrderReceiptScreen}
            options={() => ({
              headerShown: false,
            })}
          />

          <Stack.Screen
            name="HelpCenter"
            component={HelpCenterScreen}
            options={() => ({
              headerShown: false,
            })}
          />

          <Stack.Screen
            name="HelpTopic"
            component={HelpTopicScreen}
            options={() => ({
              headerShown: false,
            })}
          />
          <Stack.Screen
            name="HelpTopicDetail"
            component={HelpTopicDetailScreen}
            options={() => ({
              headerShown: false,
            })}
          />

          <Stack.Screen
            name="Cart"
            component={CartScreen}
            options={({ navigation }) => ({
              headerShown: false,
            })}
          />

          <Stack.Screen
            name="EditProfile"
            component={EditProfileScreen}
            options={() => ({
              headerShown: false,
            })}
          />

          <Stack.Screen
            name="User"
            component={UserScreen}
            options={() => ({
              headerShown: false,
            })}
          />

          <Stack.Screen
            name="Contact"
            component={ContactScreen}
            options={({ navigation }) => ({
              headerShown: false,
            })}
          />

          <Stack.Screen
            name="Terms"
            component={TermsScreen}
            options={() => ({
              headerShown: false,
            })}
          />

          <Stack.Screen
            name="About"
            component={AboutScreen}
            options={() => ({
              headerShown: false,
            })}
          />

          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={({ navigation }) => ({
              headerShown: false,
            })}
          />

          <Stack.Screen
            name="AddressBook"
            component={AddressBookScreen}
            options={() => ({
              headerShown: false,
            })}
          />

          <Stack.Screen
            name="AddressEdit"
            component={AddressEditScreen}
            options={() => ({
              headerShown: false,
            })}
          />

          <Stack.Screen
            name="AddressAdd"
            component={AddressAddScreen}
            options={() => ({
              headerShown: false,
            })}
          />

          <Stack.Screen
            name="Map"
            component={MapScreen}
            options={() => ({
              headerShown: false,
            })}
          />

          <Stack.Screen
            name="ChangePassword"
            component={ChangePasswordScreen}
            options={() => ({
              headerShown: false,
            })}
          />

          <Stack.Screen
            name="RewardShop"
            component={RewardShop}
            options={() => ({
              headerShown: false,
            })}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
