import React from "react";
import {
  Image,
  View,
  Text,
  StyleSheet,
  StatusBar,
  Dimensions,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/Patient/HomeScreen";
import Appointment from "../screens/Patient/Appointment";
import Messages from "../screens/Patient/Messages";
import Profile from "../screens/Patient/Profile";
import colors from "../utils/colors";

const Tab = createBottomTabNavigator();

function LocationIcon(props) {
  return (
    <Svg
      width={15}
      height={15}
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M13.023.103L.842 5.725c-1.405.656-.937 2.718.562 2.718h5.154v5.153c0 1.5 2.061 1.968 2.717.562l5.622-12.18c.469-1.125-.75-2.344-1.874-1.875z"
        fill="#fff"
      />
    </Svg>
  );
}

const { width } = Dimensions.get("screen");

export default function PatientTabs() {
  return (
    <Tab.Navigator
      backBehavior="firstRoute"
      initialRouteName="Home"
      screenOptions={{
        tabBarStyle: { ...styles.bottomtab },
        tabBarShowLabel: false,
        headerTintColor: colors.lightaccent,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          // headerTitleAlign: "left",
          headerStyle: { ...styles.headstyle, opacity: 1 },
          tabBarIcon: ({ focused, color, size }) => (
            <View style={styles.iconContainer}>
              <Image
                source={
                  focused
                    ? require("../assets/icons/home-selected.png")
                    : require("../assets/icons/home.png")
                }
                style={{
                  width: 30,
                  height: 30,
                  tintColor: focused ? colors.lightaccent : colors.tenpercent,
                }}
              />
              {focused && (
                <Text
                  style={[
                    styles.label,
                    {
                      color: focused ? colors.lightaccent : colors.tenpercent,
                    },
                  ]}
                >
                  Home
                </Text>
              )}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Appointment"
        component={Appointment}
        options={{
          headerTitleAlign: "center",

          tabBarIcon: ({ focused, color, size }) => (
            <View style={styles.iconContainer}>
              <Image
                source={
                  focused
                    ? require("../assets/icons/appointments-selected.png")
                    : require("../assets/icons/appointments.png")
                }
                style={{
                  width: 30,
                  height: 30,
                  tintColor: focused ? colors.lightaccent : colors.tenpercent,
                }}
              />
              {focused && (
                <Text
                  style={[
                    styles.label,
                    {
                      color: focused ? colors.lightaccent : colors.tenpercent,
                    },
                  ]}
                >
                  Appointments
                </Text>
              )}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Messages"
        component={Messages}
        options={{
          headerTitleAlign: "center",

          tabBarIcon: ({ focused, color, size }) => (
            <View style={styles.iconContainer}>
              <Image
                source={
                  focused
                    ? require("../assets/icons/message-selected.png")
                    : require("../assets/icons/message.png")
                }
                style={{
                  width: 30,
                  height: 30,
                  tintColor: focused ? colors.lightaccent : colors.tenpercent,
                }}
              />
              {focused && (
                <Text
                  style={[
                    styles.label,
                    {
                      color: focused ? colors.lightaccent : colors.tenpercent,
                    },
                  ]}
                >
                  Messages
                </Text>
              )}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <View style={styles.iconContainer}>
              <Image
                source={
                  focused
                    ? require("../assets/icons/profile-selected.png")
                    : require("../assets/icons/profile.png")
                }
                style={{
                  width: 30,
                  height: 30,
                  tintColor: focused ? colors.lightaccent : colors.tenpercent,
                }}
              />
              {focused && (
                <Text
                  style={[
                    styles.label,
                    {
                      color: focused ? colors.lightaccent : colors.tenpercent,
                    },
                  ]}
                >
                  Profile
                </Text>
              )}
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  bottomtab: {
    height: 60,
    backgroundColor: colors.darkback,
    paddingTop: 0,
    marginTop: 0,
    borderTopWidth: 1,
    borderTopColor: colors.somewhatlightback,
  },
  iconContainer: {
    alignItems: "center",
  },
  label: {
    fontSize: width / 26,
  },

  headstyle: {
    backgroundColor: colors.lightaccent,
    height: 100,
    // overflow: "hidden",
    // backgroundColor: "transparent",
  },

  locationblock: {
    display: "flex",
    flexDirection: "row",
    gap: 6,
    marginRight: 16,
    // borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
