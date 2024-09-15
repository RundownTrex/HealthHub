import { enableScreens } from "react-native-screens";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DoctorProfile from "../screens/Doctor/DoctorProfile";
import EditDoctorProfile from "../screens/Doctor/EditDoctorProfile";
import ConsultationSettings from "../screens/Doctor/ConsultationSettings";
import ClinicSlots from "../screens/Doctor/ClinicSlots";
import VirtualSlots from "../screens/Doctor/VirtualSlots";
import SupportScreen from "../screens/Patient/SupportScreen";
import SettingsScreen from "../screens/Patient/SettingsScreen";
import PasswordChangeScreen from "../screens/Patient/PasswordChangeScreen";
import PatientAppointmentHistory from "../screens/Doctor/PatientAppointmentHistory";
import SlotType from "../screens/Doctor/SlotType";

enableScreens();
const Stack = createNativeStackNavigator();

export default function DoctorProfileStack() {
  return (
    <Stack.Navigator
      initialRouteName="Profile"
      screenOptions={{
        headerShown: false,
        animation: "ios",
        gestureEnabled: false,
      }}
    >
      <Stack.Screen name="DoctorProfile" component={DoctorProfile} />
      <Stack.Screen name="EditDoctorProfile" component={EditDoctorProfile} />

      <Stack.Screen
        name="ConsultationSettings"
        component={ConsultationSettings}
      />

      <Stack.Screen name="SlotType" component={SlotType} />

      <Stack.Screen name="ClinicSlots" component={ClinicSlots} />
      <Stack.Screen name="VirtualSlots" component={VirtualSlots} />

      <Stack.Screen
        name="AppointmentHistory"
        component={PatientAppointmentHistory}
      />
      <Stack.Screen name="SupportScreen" component={SupportScreen} />
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
      <Stack.Screen
        name="PasswordChangeScreen"
        component={PasswordChangeScreen}
      />
    </Stack.Navigator>
  );
}
