import { useEffect } from "react";
import { StyleSheet, StatusBar, View, } from "react-native";
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
import { Provider as PaperProvider } from "react-native-paper";
import messaging from "@react-native-firebase/messaging";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider>
        <BottomSheetModalProvider>
          <UserProvider>
            <Main />
          </UserProvider>
        </BottomSheetModalProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

function Main() {
  const { userRole } = useContext(RoleContext);

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log("Notification permission granted.");
    } else {
      console.log("Notification permission denied.");
    }
  };

  useEffect(() => {
    requestUserPermission();
  }, []);

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
