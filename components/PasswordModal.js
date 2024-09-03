import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  TextInput,
  Pressable,
  StyleSheet,
  Text,
} from "react-native";
import Toast from "react-native-toast-message";

import colors from "../utils/colors";

export default function PasswordModal({ visible, onClose, onSubmit }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [dis, setDis] = useState(true);

  useEffect(() => {
    if (!password.trim()) {
      setDis(true);
      setError("*Password field should not be empty!");
      return;
    }
    setError(null);
    setDis(false);
  }, [password]);

  const handlePress = () => {
    onSubmit(password);
    setPassword(""); // Clear the input field after submission
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.cautionContainer}>
            <Text style={styles.cautionText}>
              Your account will be deleted permanently! Proceed with caution!
            </Text>
          </View>
          <TextInput
            placeholder="Enter your password to confirm"
            placeholderTextColor={colors.lightgraytext}
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
            style={styles.input}
          />
          {error && <Text style={styles.errortext}>{error}</Text>}

          <View style={styles.buttonContainer}>
            <Pressable
              style={styles.submitButton}
              onPress={handlePress}
              disabled={dis}
            >
              <Text style={styles.buttonLabel}>Submit</Text>
            </Pressable>
            <Pressable style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonLabel}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "85%",
    paddingVertical: 35,
    paddingHorizontal: 20,
    backgroundColor: colors.darkback,
    borderRadius: 10,
  },
  input: {
    borderWidth: 2,
    borderColor: "gray",
    color: colors.whitetext,
    borderRadius: 2,
    marginBottom: 2,
    paddingHorizontal: 10,
    fontSize: 16,
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  buttonLabel: {
    color: colors.whitetext,
    fontSize: 16,
    fontWeight: "500",
    alignSelf: "center",
  },
  submitButton: {
    backgroundColor: colors.complementary,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: "10%",
    // marginHorizontal: 50,
  },

  cancelButton: {
    backgroundColor: "red",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: "10%",
    // marginHorizontal: 50,
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 40,
    marginTop: 20,
  },

  errortext: {
    color: "red",
  },

  cautionContainer: {
    marginBottom: 16,
  },

  cautionText: {
    color: "red",
    fontSize: 18,
  },
});
