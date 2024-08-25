import { useState, useCallback } from "react";
import { Image, View, Text, StyleSheet, Dimensions } from "react-native";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/Patient/HomeScreen";
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
    <BottomSheetProvider>
      <Tab.Navigator
        backBehavior="firstRoute"
        initialRouteName="Home"
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={({ route }) => ({
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
          component={HomeScreen}
          options={{
            headerShown: false,
            headerStyle: { ...styles.headstyle, opacity: 1 },
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
