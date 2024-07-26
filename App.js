import { StyleSheet, StatusBar, View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import PatientTabs from "./navigations/PatientTabs";
import DoctorTabs from "./navigations/DoctorTabs";
import { useState } from "react";
import LandingStack from "./navigations/LandingStack";
import colors from "./utils/colors";

import Toast from "react-native-toast-message";

export default function App() {
  const [userRole, setUserRole] = useState(null);

  return (
    <>
      <View style={styles.container}>
        <StatusBar backgroundColor={colors.darkback} />
        <NavigationContainer>
          {userRole === null && <LandingStack />}
          {userRole === "patient" && <PatientTabs />}
          {userRole === "doctor" && <DoctorTabs />}
        </NavigationContainer>
        <Toast />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    // marginTop: StatusBar.currentHeight,
    flex: 1,
  },
});
