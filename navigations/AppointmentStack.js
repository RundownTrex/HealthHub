import React from "react";
import { enableScreens } from "react-native-screens";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Appointment from "../screens/Patient/Appointment";
import Providers from "../screens/Patient/Providers";
import BookDoctor from "../screens/Patient/BookDoctor";

enableScreens();
const Stack = createNativeStackNavigator();

export default function AppointmentStack() {
  return (
    <Stack.Navigator
      initialRouteName="Appointments"
      screenOptions={{
        headerShown: false,
        animation: 'ios',
        gestureEnabled: true,
      }}
    >
      <Stack.Screen name="Appointments" component={Appointment} />
      <Stack.Screen name="Providers" component={Providers} />
      <Stack.Screen name="BookDoctor" component={BookDoctor} />
    </Stack.Navigator>
  );
}
