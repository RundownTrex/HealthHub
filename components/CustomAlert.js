import React, { useState } from "react";
import { View, Text, Pressable, Modal, StyleSheet } from "react-native";
import colors from "../utils/colors";

export default function CustomAlert({ visible, onCancel, onConfirm }) {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={onCancel} 
    >
      <View style={styles.modalOverlay}>
        <View style={styles.alertBox}>
          <Text style={styles.title}>Cancel Appointment</Text>
          <Text style={styles.message}>
            Are you sure you want to cancel this appointment?
          </Text>

          <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
            >
              <Text style={styles.buttonText}>Back</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.confirmButton]}
              onPress={onConfirm}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  alertBox: {
    width: 300,
    padding: 20,
    backgroundColor: colors.darkback,
    borderRadius: 10,
    elevation: 5,
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  title: {
    color: colors.whitetext,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    color: colors.whitetext,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    minWidth: 100,
  },
  cancelButton: {
    backgroundColor: colors.complementary,
  },
  confirmButton: {
    backgroundColor: colors.cancelled,
  },
  buttonText: {
    color: colors.whitetext,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
});
