// CustomInput.js
import React from "react";
import { TextInput, View, StyleSheet } from "react-native";
import colors from "../utils/colors";

const TextInput1 = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        style={styles.input}
        placeholderTextColor={colors.lightgraytext}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
  },
  input: {
    height: 45,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 2,
    color: colors.whitetext,
    backgroundColor: colors.somewhatlightback,
    fontSize: 16,
  },
});

export default TextInput1;
