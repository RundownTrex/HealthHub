import { enableScreens } from "react-native-screens";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profile from "../screens/Patient/Profile";
import GeneralProfileScreen from "../screens/Patient/GeneralProfileScreen";
import MedicalProfileScreen from "../screens/Patient/MedicalProfileScreen";
import MedicalRecordsScreen from "../screens/Patient/MedicalRecordsScreen";
import SupportScreen from "../screens/Patient/SupportScreen";
import SettingsScreen from "../screens/Patient/SettingsScreen";
import PasswordChangeScreen from "../screens/Patient/PasswordChangeScreen";
import AppointmentHistory from "../screens/Patient/AppointmentHistory";

enableScreens();
const Stack = createNativeStackNavigator();

export default function PatientProfileStack() {
  return (
    <Stack.Navigator
      initialRouteName="Profile"
      screenOptions={{
        headerShown: false,
        animation: "ios",
        gestureEnabled: false,
      }}
    >
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen
        name="GeneralProfileScreen"
        component={GeneralProfileScreen}
      />
      <Stack.Screen
        name="MedicalProfileScreen"
        component={MedicalProfileScreen}
      />
      <Stack.Screen
        name="MedicalRecordsScreen"
        component={MedicalRecordsScreen}
      />

      <Stack.Screen name="AppointmentHistory" component={AppointmentHistory} />
      <Stack.Screen name="SupportScreen" component={SupportScreen} />
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
      <Stack.Screen
        name="PasswordChangeScreen"
        component={PasswordChangeScreen}
      />
    </Stack.Navigator>
  );
}
