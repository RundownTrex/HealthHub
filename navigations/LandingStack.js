import React from "react";
import { View, Text, StatusBar } from "react-native";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import LandingSceen from "../screens/Landing/LandingScreen";
import PatientLogin from "../screens/Landing/PatientLogin";
import DoctorLogin from "../screens/Landing/DoctorLogin";
import PatientSignup from "../screens/Landing/PatientSignup";
import DoctorSignup from "../screens/Landing/DoctorSignup";
import colors from "../utils/colors";
import BackIcon from "../assets/icons/BackIcon";

const Stack = new createStackNavigator();

export default function LandingStack() {
  return (
    <>
      <StatusBar backgroundColor={colors.darkback} />
      <Stack.Navigator
        initialRouteName="Landing screen"
        screenOptions={{
          gestureEnabled: true,
          ...TransitionPresets.SlideFromRightIOS,
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: colors.darkback,
            borderWidth: 0,
            elevation: 0,
          },
          headerTitleStyle: {
            color: colors.whitetext,
          },
          headerBackImage: () => <BackIcon />,
        }}
      >
        <Stack.Screen
          name="Landing screen"
          component={LandingSceen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Patient login"
          component={PatientLogin}
          options={{
            headerTitleStyle: {
              display: "none",
            },
          }}
        />
        <Stack.Screen name="Doctor login" component={DoctorLogin} />
        <Stack.Screen
          name="Patient signup"
          component={PatientSignup}
          options={{
            headerTitleStyle: {
              display: "none",
            },
          }}
        />
        <Stack.Screen name="Doctor signup" component={DoctorSignup} />
      </Stack.Navigator>
    </>
  );
}
