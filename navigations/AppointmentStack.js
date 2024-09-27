import React from "react";
import { enableScreens } from "react-native-screens";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Appointment from "../screens/Patient/Appointment";
import Providers from "../screens/Patient/Providers";
import BookDoctor from "../screens/Patient/BookDoctor";
import SlotScreen from "../screens/Patient/SlotScreen";
import Booking from "../screens/Patient/Booking";
import ReportScreen from "../screens/Patient/ReportScreen";
import BookedDoctor from "../screens/Patient/BookedDoctor";

enableScreens();
const Stack = createNativeStackNavigator();

export default function AppointmentStack() {
  return (
    <Stack.Navigator
      initialRouteName="Appointments"
      screenOptions={{
        headerShown: false,
        animation: "ios",
        gestureEnabled: false,
      }}
    >
      <Stack.Screen name="Appointments" component={Appointment} />
      <Stack.Screen name="Providers" component={Providers} />
      <Stack.Screen name="BookDoctor" component={BookDoctor} />
      <Stack.Screen name="Slots" component={SlotScreen} />
      <Stack.Screen name="Booking" component={Booking} />
      <Stack.Screen name="ReportScreen" component={ReportScreen} />
    </Stack.Navigator>
  );
}
