import React from "react";
import { Image, View, Text, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/Patient/HomeScreen";
import Appointment from "../screens/Patient/Appointment";
import Messages from "../screens/Patient/Messages";
import Profile from "../screens/Patient/Profile";
import colors from "../utils/colors";
const Tab = createBottomTabNavigator();

export default function PatientTabs() {
  return (
    <Tab.Navigator
      backBehavior="firstRoute"
      initialRouteName="Home"
      screenOptions={{
        // tabBarActiveTintColor: colors.darkgraytext,
        // tabBarInactiveTintColor: colors.blacktext,
        tabBarStyle: { ...styles.bottomtab },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerTitle: "Home",
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: colors.lightaccent },
          headerTitleStyle: {
            color: colors.whitetext,
            fontWeight: 200,
            fontSize: 20,
            fontFamily: "Roboto",
          },
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
                  tintColor: focused ? colors.lightaccent : colors.whitetext,
                }}
              />
              {focused && (
                <Text
                  style={[
                    styles.label,
                    {
                      color: focused ? colors.lightaccent : colors.darkgraytext,
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
                  tintColor: focused ? colors.lightaccent : colors.whitetext,
                }}
              />
              {focused && (
                <Text
                  style={[
                    styles.label,
                    {
                      color: focused ? colors.lightaccent : colors.darkgraytext,
                    },
                  ]}
                >
                  Appointment
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
                  tintColor: focused ? colors.lightaccent : colors.whitetext,
                }}
              />
              {focused && (
                <Text
                  style={[
                    styles.label,
                    {
                      color: focused ? colors.lightaccent : colors.darkgraytext,
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
          headerTitleAlign: "center",

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
                  tintColor: focused ? colors.lightaccent : colors.whitetext,
                }}
              />
              {focused && (
                <Text
                  style={[
                    styles.label,
                    {
                      color: focused ? colors.lightaccent : colors.darkgraytext,
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
    backgroundColor: colors.blacktext,
    paddingTop: 0,
    marginTop: 0,
    borderTopWidth: 0,
  },
  iconContainer: {
    alignItems: "center",
  },
  label: {
    fontSize: 14,
  },
});
