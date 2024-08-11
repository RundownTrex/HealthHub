import React, { useState, useCallback } from "react";
import { View, Text, Pressable, StyleSheet, LayoutAnimation, UIManager } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Enable LayoutAnimation on Android
if (UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const DropdownMenu = ({ title, content }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleDropdown = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(prev => !prev);
  }, []);

  return (
    <View style={styles.container}>
      <Pressable style={styles.header} onPress={toggleDropdown}>
        <Text style={styles.headerText}>{title}</Text>
        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={20}
          color="white"
        />
      </Pressable>
      {expanded && (
        <View style={styles.content}>
          <Text style={styles.contentText}>{content}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 5,
    overflow: "hidden",
    marginVertical: 10,
    backgroundColor: "#333",
  },
  header: {
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#333",
  },
  headerText: {
    color: "white",
    fontSize: 16,
  },
  content: {
    backgroundColor: "#444",
    padding: 15,
  },
  contentText: {
    color: "white",
    fontSize: 14,
  },
});

export default DropdownMenu;
