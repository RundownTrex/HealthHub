import React from "react";
import { View, Text, StyleSheet, StatusBar, Image, Dimensions } from "react-native";
import colors from "../../utils/colors";
import Button1 from "../../components/Button1";

const { height, width } = Dimensions.get("window"); 

export default function LandingScreen({ navigation }) {
  const loginAsPatient = () => {
    navigation.navigate("Patient login");
    console.log("Navigating to patient login screen");
  };

  const logInAsDoctor = () => {
    navigation.navigate("Doctor login");
    console.log("Navigating to doctor login screen");
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.lightaccent} />
      <Text style={styles.textStyle}>Are you a patient or a doctor?</Text>
      <Image
        source={require("../../assets/blood-pressure-gauge.png")}
        style={styles.imageStyle}
      />
      <View style={styles.buttonContainer}>
        <Button1
          text="PATIENT"
          style={styles.buttonStyle}
          onPress={loginAsPatient}
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
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16, 
  },

  textStyle: {
    color: colors.whitetext,
    fontSize: width > 400 ? 24 : 22, 
    fontWeight: "bold",
    marginTop: height * 0.2, 
    textAlign: "center",
  },

  imageStyle: {
    height: height * 0.30, 
    width: height * 0.30,  
    alignSelf: "center",
    marginBottom: 20, 
  },

  buttonContainer: {
    width: "100%", 
    alignItems: "center",
    marginBottom: 20, 
  },

  buttonStyle: {
    marginVertical: 10,
    width: "100%", 
    maxWidth: 300, 
  },
});
