import { StyleSheet, StatusBar, View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import PatientTabs from "./navigations/PatientTabs";
import DoctorTabs from "./navigations/DoctorTabs";
import { useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LandingStack from "./navigations/LandingStack";

const Stack = createStackNavigator();

export default function App() {
  const [userRole, setUserRole] = useState(null);

  return (
    <View style={styles.container}>
      <NavigationContainer>
        {userRole === null && <LandingStack />}
        {userRole === "patient" && <PatientTabs />}
        {userRole === "doctor" && <DoctorTabs />}
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // marginTop: StatusBar.currentHeight,
    flex: 1,
  },
});
