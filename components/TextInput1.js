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
  maxlen,
  kbtype,
  multi,
  no,
}) => {
  return (
    <View style={[styles.container, style]}>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        style={[styles.input, multi && styles.multilineInput]}
        placeholderTextColor={colors.lightgraytext}
        maxLength={maxlen}
        keyboardType={kbtype}
        keyboardAppearance="dark"
        multiline={multi}
        numberOfLines={no}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
  },
  input: {
    maxHeight: 50,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 2,
    color: colors.whitetext,
    backgroundColor: colors.somewhatlightback,
    fontSize: 16,
  },
  multilineInput: {
    maxHeight: 1000,
    textAlignVertical: "top", // Ensures text starts at the top
  },
});

export default TextInput1;
