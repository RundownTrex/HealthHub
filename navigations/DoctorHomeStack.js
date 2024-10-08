import { enableScreens } from "react-native-screens";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DoctorHome from "../screens/Doctor/DoctorHome";
import PatientProfile from "../screens/Doctor/PatientProfile";
import AllAppointments from "../screens/Doctor/AllAppointments";
import UploadMedicalRecord from "../screens/Doctor/UploadMedicalRecord";

enableScreens();
const Stack = createNativeStackNavigator();

export default function DoctorHomeStack() {
  return (
    <Stack.Navigator
      initialRouteName="DoctorHome"
      screenOptions={{
        headerShown: false,
        animation: "ios",
        gestureEnabled: false,
      }}
    >
      <Stack.Screen name="DoctorHome" component={DoctorHome} />
      <Stack.Screen name="PatientProfile" component={PatientProfile} />
      <Stack.Screen name="AllAppointments" component={AllAppointments} />
      <Stack.Screen
        name="UploadMedicalRecord"
        component={UploadMedicalRecord}
      />
    </Stack.Navigator>
  );
}
