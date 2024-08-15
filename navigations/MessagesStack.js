import React from "react";
import { enableScreens } from "react-native-screens";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Messages from "../screens/Patient/Messages";
import DoctorChat from "../screens/Patient/DoctorChat";

enableScreens();
const Stack = createNativeStackNavigator();

export default function MessagesStack() {
  return (
    <Stack.Navigator
      initialRouteName="Messages"
      screenOptions={{
        headerShown: false,
        animation: "ios",
        gestureEnabled: true,
      }}
    >
      <Stack.Screen name="Messages" component={Messages} />
      <Stack.Screen name="DoctorChat" component={DoctorChat} />
    </Stack.Navigator>
  );
}
