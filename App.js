import { StyleSheet, StatusBar, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import PatientTabs from "./navigations/PatientTabs";

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar />
      <NavigationContainer >
        <PatientTabs />
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
