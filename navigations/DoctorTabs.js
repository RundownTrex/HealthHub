import React from "react";
import { Image, View, Text, StyleSheet, StatusBar } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import DoctorHome from "../screens/Doctor/DoctorHome";
import DoctorMessages from "../screens/Doctor/DoctorMessages";
import DoctorProfile from "../screens/Doctor/DoctorProfile";
import colors from "../utils/colors";

const Tab = createBottomTabNavigator();

export default function DoctorTabs() {
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
        component={DoctorHome}
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
        name="Messages"
        component={DoctorMessages}
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
        component={DoctorProfile}
        options={{
          headerTitleAlign: "center",
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
