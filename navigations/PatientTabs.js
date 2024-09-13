import { useState, useCallback } from "react";
import { Image, View, Text, StyleSheet, Dimensions } from "react-native";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/Patient/HomeScreen";
import HomeStack from "./HomeStack";
import Appointment from "../screens/Patient/Appointment";
import Messages from "../screens/Patient/Messages";
import Profile from "../screens/Patient/Profile";
import colors from "../utils/colors";
import AppointmentStack from "./AppointmentStack";
import MessagesStack from "./MessagesStack";
import PatientProfileStack from "./PatientProfileStack";
import CustomTabBar from "../components/CustomTabBar";

import { BottomSheetProvider } from "../context/BottomSheetContext";

const Tab = createBottomTabNavigator();

const { width } = Dimensions.get("screen");

export default function PatientTabs() {
  return (
    <BottomSheetProvider>
      <Tab.Navigator
        backBehavior="firstRoute"
        initialRouteName="Home"
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={() => ({
          tabBarHideOnKeyboard: true,
          tabBarStyle: {
            ...styles.bottomtab,
          },
          tabBarShowLabel: false,
          headerTintColor: colors.lightaccent,
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeStack}
          options={{
            headerShown: false,
            // headerStyle: { ...styles.headstyle, opacity: 1 },
          }}
        />
        <Tab.Screen
          name="Appointment"
          component={AppointmentStack}
          options={{
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="Message"
          component={MessagesStack}
          options={{
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="Profiles"
          component={PatientProfileStack}
          options={{
            headerShown: false,
          }}
        />
      </Tab.Navigator>
    </BottomSheetProvider>
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
  },

  locationblock: {
    display: "flex",
    flexDirection: "row",
    gap: 6,
    marginRight: 16,
    justifyContent: "center",
    alignItems: "center",
  },
});
