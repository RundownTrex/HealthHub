import React from "react";
import { View, Text } from "react-native";
import { CardStyleInterpolators, createStackNavigator } from "@react-navigation/stack";
import LandingSceen from "../screens/Landing/LandingScreen";
import PatientLogin from "../screens/Landing/PatientLogin";
import DoctorLogin from "../screens/Landing/DoctorLogin";

const Stack = new createStackNavigator();

export default function LandingStack() {
  return (
    <Stack.Navigator initialRouteName="Landing screen" >
      <Stack.Screen name="Landing screen" component={LandingSceen} options={{headerShown: false }} />
      <Stack.Screen name="Patient login" component={PatientLogin} />
      <Stack.Screen name="Doctor login" component={DoctorLogin} />
    </Stack.Navigator>
  );
}
