import { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

import colors from "../../utils/colors";
import BackIcon from "../../assets/icons/BackIcon";
import LoadingOverlay from "../../components/LoadingOverlay";
import TextInput1 from "../../components/TextInput1";
import Button1 from "../../components/Button1";
import Toast from "react-native-toast-message";

GoogleSignin.configure({
  webClientId:
    "241519626607-bl6d45ps1pgj89l3fk6e5j45ft67n16e.apps.googleusercontent.com",
});

export default function PasswordChangeScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [curPass, setCurPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const user = auth().currentUser;

  const updatePassword = async (newPass, curPass) => {
    setIsLoading(true);
    if (newPass !== confirmPass) {
      Toast.show({
        type: "error",
        text1: "Passwords do not match",
        text2: "Ensure both passwords match.",
      });
      setIsLoading(false);
      return;
    }

    try {
      const email = user.email;
      const credential = auth.EmailAuthProvider.credential(email, curPass); 
      await user.reauthenticateWithCredential(credential); 
      console.log("User reauthenticated successfully");
      await user.updatePassword(newPass);
      console.log("Password updated successfully!");
      Toast.show({
        type: "success",
        text1: "Password updated successfully!",
        text2: "Try logging in again with updated password",
      });
      setCurPass("");
      setNewPass("");
      setConfirmPass("");
    } catch (error) {
      console.error("Error updating password: ", error.code);
      if (error.code.includes("weak-password")) {
        console.log(error.code);
        Toast.show({
          type: "error",
          text1: "Weak password",
          text2: "Try using numbers and special characters",
        });
        setIsLoading(false);
      } else {
        Toast.show({
          type: "error",
          text1: "Error updating password",
        });
        setIsLoading(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <LoadingOverlay isVisible={isLoading} />
      <View
        style={{
          height: 60,
          backgroundColor: colors.lightaccent,
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
          paddingVertical: 10,
          paddingHorizontal: 16,
        }}
      >
        <Pressable style={{ padding: 5 }} onPress={() => navigation.pop()}>
          <BackIcon style={{ alignItems: "flex-start" }} />
        </Pressable>
        <Text
          style={{
            color: colors.whitetext,
            fontWeight: "bold",
            fontSize: 18,
          }}
        >
          Change Password
        </Text>
        <View style={{ height: 20, width: 20 }} />
      </View>
      <View style={styles.container}>
        <Text style={styles.label}>Enter current password</Text>
        <TextInput1
          placeholder="Current password here"
          value={curPass}
          onChangeText={(p) => setCurPass(p)}
          secureTextEntry={true}
          kbtype="visible-password"
        />
        <Text style={[styles.label, { marginTop: 10 }]}>
          Enter new password
        </Text>
        <TextInput1
          placeholder="New password here"
          value={newPass}
          onChangeText={(p) => setNewPass(p)}
          secureTextEntry={true}
          kbtype="visible-password"
        />
        <Text style={[styles.label, { marginTop: 10 }]}>
          Confirm new password
        </Text>
        <TextInput1
          placeholder="Confirm new password"
          value={confirmPass}
          onChangeText={(p) => setConfirmPass(p)}
          secureTextEntry={true}
          kbtype="visible-password"
        />
        {curPass !== "" && newPass !== "" && confirmPass !== "" && (
          <Button1
            text="Change Password"
            onPress={() => updatePassword(newPass, curPass)}
            style={{ marginVertical: 25 }}
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.darkback,
  },
  label: {
    color: colors.lightgraytext,
    fontSize: 14,
  },
});
