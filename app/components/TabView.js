import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import Icon from "../components/Icon";
import { constants, constraints } from "../configs/constants";
import { utilStyles } from "../configs/utilStyles";
import { useAxiosObject } from "../contexts/axios-context";
import { getUserDetails } from "../services/userService";
import { themeState } from "../store/slices/themeSlice";

export default function TabView({ children, Tab }) {
  const themeSelector = useSelector(themeState);
  const colors = themeSelector.colors;
  const theme = themeSelector.theme;

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            if (theme === "light") {
              return getLightIcon(focused, route);
            }
            return getDarkIcon(focused, route);
          },
          tabBarLabel: ({ focused }) => {
            if (focused)
              return (
                <Text
                  numberOfLines={1}
                  style={{
                    color: colors.textColorSecondary,
                    fontSize: constraints.tabBarLabelSize,
                    lineHeight: 10,
                    marginBottom: 5,
                  }}
                >
                  {route.name}
                </Text>
              );
          },
          // tabBarShowLabel: ({focused}) => !!focused,
          tabBarActiveTintColor: colors.primary,
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colors.backgroundColor,
            borderTopColor: colors.borderColor,
          },
          tabBarIconStyle: { marginTop: 0 },
        })}
      >
        {children}
      </Tab.Navigator>
    </View>
  );
}

function getLightIcon(focused, route) {
  let iconName;
  let iconSize = 10;

  if (route.name === "Home") {
    iconName = focused ? "home_light_active" : "home_light";
    iconSize = focused ? 18 : 20;
  } else if (route.name === "Favorites") {
    iconName = focused ? "heart_light_active" : "heart_light";
    iconSize = focused ? 18 : 20;
  } else if (route.name === "Category") {
    iconName = focused ? "category_light_active" : "category_light";
    iconSize = focused ? 18 : 20;
  } else if (route.name === "Recommendations") {
    iconName = focused ? "plus_light_active" : "plus_light";
    iconSize = focused ? 18 : 20;
  } else if (route.name === "Order") {
    iconName = focused ? "scooter_light_active" : "scooter_light";
    iconSize = focused ? 18 : 20;
  }
  return <Icon name={iconName} size={iconSize} />;
}

function getDarkIcon(focused, route) {
  let iconName;
  let iconSize = 10;

  if (route.name === "Home") {
    iconName = focused ? "home_dark_active" : "home_dark";
    iconSize = focused ? 18 : 20;
  } else if (route.name === "Favorites") {
    iconName = focused ? "heart_dark_active" : "heart_dark";
    iconSize = focused ? 18 : 20;
  } else if (route.name === "Category") {
    iconName = focused ? "category_dark_active" : "category_dark";
    iconSize = focused ? 18 : 20;
  } else if (route.name === "Recommendations") {
    iconName = focused ? "plus_dark_active" : "plus_dark";
    iconSize = focused ? 18 : 20;
  } else if (route.name === "Order") {
    iconName = focused ? "scooter_dark_active" : "scooter_dark";
    iconSize = focused ? 18 : 20;
  }
  return <Icon name={iconName} size={iconSize} />;
}

export function CustomTabScreen(props) {
  const navigation = useNavigation();
  const colors = useSelector(themeState).colors;

  const styles = StyleSheet.create({
    view: {
      position: "relative",
      width: 60,
      height: 60,
      backgroundColor: colors.primary,
      borderRadius: 35,
      top: -30,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 4,
    },
    bag: {
      position: "absolute",
      top: 17,
      left: 18,
    },
  });

  return (
    <TouchableOpacity
      {...props}
      style={styles.view}
      onPress={() => {
        navigation.navigate("Recommendation");
      }}
    >
      <Icon
        name="plus-outline"
        fill="#ffffff"
        width={25}
        height={25}
        style={styles.bag}
      />
    </TouchableOpacity>
  );
}

export function CustomUserTabIcon(props) {
  const [avatar, setAvatar] = useState(null);
  const axiosInstance = useAxiosObject();

  const colors = useSelector(themeState).colors;

  const asyncFunction = async () => {
    let res = await getUserDetails(axiosInstance);
    if (res) {
      setAvatar(res.profile.avatar);
    }
  };

  useEffect(() => {
    asyncFunction();
  }, []);

  const styles = StyleSheet.create({
    image: {
      width: 30,
      height: 30,
      borderRadius: 15,
    },
    view: {
      width: 48,
      height: 48,
      borderRadius: 24,
      ...utilStyles.centerXY,
    },
  });

  return (
    <Pressable {...props}>
      {!avatar ? (
        <View style={styles.view}>
          <Icon
            name="person-outline"
            fill={
              props.accessibilityState.selected ? colors.primary : "#8E8E8F"
            }
            width={25}
            height={25}
          />
        </View>
      ) : (
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            marginBottom: 8,
            backgroundColor: colors.BlackDark,
            ...utilStyles.centerXY,
          }}
        >
          <Image
            style={styles.image}
            source={{
              uri: constants.baseURL + avatar,
            }}
          />
        </View>
      )}
    </Pressable>
  );
}
