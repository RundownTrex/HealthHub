import React from "react";
import { View, Text, StyleSheet } from "react-native";
import colors from "../../utils/colors";
export default function Messages() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Messages screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkback,
    alignItems: "center",
    justifyContent: "center",
  },

  text: {
    color: colors.whitetext,
    fontSize: 20,
  },
});
