import React from "react";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import colors from "../utils/colors";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

import {
  GestureDetector,
  Gesture,
} from "react-native-gesture-handler";

const IconButton = ({ icon, label, fun }) => {
  const pressed = useSharedValue(false);

  const pan = Gesture.Pan()
    .onBegin(() => {
      pressed.value = true;
    })
    .onFinalize(() => {
      pressed.value = false;
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: withTiming(pressed.value ? 0.95 : 1, {
        duration: 100,
      }) },
    ],
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.iconButtonContainer, animatedStyle]}>
        <Pressable style={styles.iconContainer} onPress={fun}>
          <Image source={icon} style={styles.icon} />
        </Pressable>
        <Text style={styles.label}>{label}</Text>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  iconButtonContainer: {
    alignItems: "center",
    width: "30%",
  },
  iconContainer: {
    backgroundColor: colors.complementary,
    borderRadius: 100,
    padding: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 55,
    height: 55,
  },
  label: {
    marginTop: 8,
    color: colors.whitetext,
    fontWeight: "400",
    textAlign: "center",
    fontSize: 16,
  },
});

export default IconButton;
