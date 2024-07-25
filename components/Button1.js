import React from "react";
import { TouchableOpacity, Text, StyleSheet, Dimensions } from "react-native";
import colors from "../utils/colors";

const { width } = Dimensions.get("window");

const Button1 = ({ text, onPress, style, textStyle }) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={[styles.buttonText, textStyle]}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.lightaccent,
    paddingVertical: 15,
    // paddingHorizontal: 20,
    // marginVertical: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    width: width - 32,
    borderRadius: 30,
  },
  buttonText: {
    color: colors.whitetext,
    fontSize: 16,
  },
});

export default Button1;
