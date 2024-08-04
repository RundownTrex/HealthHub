import { StyleSheet, StatusBar, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import PatientTabs from "./navigations/PatientTabs";
import DoctorTabs from "./navigations/DoctorTabs";
import LandingStack from "./navigations/LandingStack";
import colors from "./utils/colors";
import Toast from "react-native-toast-message";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useContext } from "react";
import RoleContext, { UserProvider } from "./context/RoleContext";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <UserProvider>
          <Main />
        </UserProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

function Main() {
  const { userRole } = useContext(RoleContext);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.lightaccent} />
      <NavigationContainer>
        {console.log("In the main app: ", userRole)}
        {userRole === null && <LandingStack />}
        {userRole === "patient" && <PatientTabs />}
        {userRole === "doctor" && <DoctorTabs />}
      </NavigationContainer>
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
