import React from "react";
import { enableScreens } from "react-native-screens";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/Patient/HomeScreen";
import BookedDoctor from "../screens/Patient/BookedDoctor";

enableScreens();
const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{
        headerShown: false,
        animation: "ios",
        gestureEnabled: false,
      }}
    >
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="BookedDoctor" component={BookedDoctor} />
    </Stack.Navigator>
  );
}
