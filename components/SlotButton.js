import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import colors from "../utils/colors";

const SlotButton = ({ time, onPress, style }) => {
  return (
    <Pressable style={[styles.slotButton, style]} onPress={onPress}>
      <Text style={styles.slottext}>{time}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  slotButton: {
    marginHorizontal: 5,
    marginVertical: 5,
    padding: 10,
    backgroundColor: colors.whitetext,
    borderRadius: 8,
    alignItems: "center",
    width: "30%",
  },

  slottext: {
    color: colors.blacktext,
    fontWeight: "500",
  },
});

export default SlotButton;
