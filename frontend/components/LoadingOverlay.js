import React from "react";
import { View, ActivityIndicator, StyleSheet, Text } from "react-native";
import colors from "../utils/colors";

const LoadingOverlay = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <View style={styles.overlay}>
      <View
        style={{
          backgroundColor: colors.darkback,
          paddingVertical: 10,
          paddingHorizontal: 25,
        }}
      >
        <ActivityIndicator size="large" color={colors.complementary} />
        <Text style={styles.text}>Loading...</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  text: {
    color: colors.whitetext,
    marginTop: 10,
    fontWeight: "bold",
    fontSize: 15,
  },
});

export default LoadingOverlay;
