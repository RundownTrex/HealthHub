import React from "react";
import { Image, View, Text, StyleSheet, StatusBar } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import DoctorHome from "../screens/Doctor/DoctorHome";
import MessagesStack from "../navigations/MessagesStack";
import DoctorMessages from "../screens/Doctor/DoctorMessages";
import DoctorProfileStack from "./DoctorProfileStack";
import colors from "../utils/colors";
import CustomTabBar from "../components/CustomTabBar";
import { BottomSheetProvider } from "../context/BottomSheetContext";

const Tab = createBottomTabNavigator();

export default function DoctorTabs() {
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
          component={DoctorHome}
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
          component={DoctorProfileStack}
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
    fontSize: 14,
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
