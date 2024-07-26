import React from "react";
import { View, Text, StyleSheet, StatusBar, Image } from "react-native";
import colors from "../../utils/colors";
import Button1 from "../../components/Button1";

export default function LandingScreen({ navigation }) {
  const loginAsPatinet = () => {
    navigation.navigate("Patient login");
    console.log("Navigating to patient login screen");
  };

  const logInAsDoctor = () => {
    navigation.navigate("Doctor login");
    console.log("Navigating to patient login screen");

  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.lightaccent} />
      <Text style={styles.textStyle}>Are you a patient or a doctor?</Text>
      <Image
        source={require("../../assets/blood-pressure-gauge.png")}
        style={[
          styles.imageStyle,
          { height: 160, width: 160, alignSelf: "center" },
        ]}
      />
      <View style={styles.buttonContainer}>
        <Button1
          text="PATIENT"
          style={styles.buttonStyle}
          onPress={loginAsPatinet}
        />
        <Button1
          text="DOCTOR"
          style={styles.buttonStyle}
          onPress={logInAsDoctor}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkback,
    // justifyContent: "center",
    alignItems: "center",
    // borderWidth: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    // gap: 50,
  },

  textStyle: {
    color: colors.whitetext,
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 210,
    // justifyContent: "center",
  },

  imageStyle: {
    marginBottom: 100,
  },

  buttonContainer: {
    // borderWidth: 1,
    marginBottom: 10,
  },

  buttonStyle: {
    marginVertical: 10,
  },
});
