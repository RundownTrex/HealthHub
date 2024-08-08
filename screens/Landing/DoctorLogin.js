import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, StatusBar, Pressable } from "react-native";
import colors from "../../utils/colors";
import TextInput1 from "../../components/TextInput1";
import Button1 from "../../components/Button1";
import ContinueGoogle from "../../assets/ContinueGoogle";
import { useNavigation } from "@react-navigation/native";
import RoleContext from "../../context/RoleContext";
import Toast from "react-native-toast-message";

import firestore from "@react-native-firebase/firestore";

import { GoogleSignin } from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";
// const { width } = Dimensions.get("window");

GoogleSignin.configure({
  webClientId:
    "241519626607-bl6d45ps1pgj89l3fk6e5j45ft67n16e.apps.googleusercontent.com",
});

export default function DoctorLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { userRole, setUserRole } = useContext(RoleContext);

  const navigation = useNavigation();

  const registerDoc = () => {
    navigation.navigate("Doctor signup");
  };

  //Email signin
  const login = async () => {
    //Firebase stuff
    if (!email || !password) {
      Toast.show({
        type: "error",
        text1: "Enter credentials",
        text2: "Email and password should not be empty!",
      });
      return;
    }
    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password
      );
      const user = userCredential.user;

      const userDoc = await firestore().collection("users").doc(user.uid).get();
      console.log(userDoc);
      if (userDoc.exists) {
        const userData = userDoc.data();

        if (userData.accountType === "doctor") {
          setUserRole("doctor");
          Toast.show({
            type: "success",
            text1: "Logged in successfully!",
            text2: "Redirecting to home screen...",
          });
          setEmail(() => "");
          setPassword(() => "");
        } else {
          await auth().signOut();
          setUserRole(null);
          Toast.show({
            type: "info",
            text1: "Patient account detected",
            text2: "Kindly login with a doctor account",
          });
        }
      } else {
        await auth().signOut();
        setUserRole(null);
        Toast.show({
          type: "error",
          text1: "Account not found",
          text2: "Try registering for a new account",
        });
      }
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.messsage;
      Toast.show({
        type: "error",
        text1: "Error logging in",
        text2: errorMessage,
      });
      setEmail(() => "");
      setPassword(() => "");
    }
  };

  //Google signin
  const googleSignin = async () => {
    try {
      await GoogleSignin.signOut();

      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      const { idToken } = await GoogleSignin.signIn({
        prompt: "select_account",
      });

      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      const userCredential = await auth().signInWithCredential(
        googleCredential
      );
      const user = userCredential.user;

      const userDoc = await firestore().collection("users").doc(user.uid).get();

      if (userDoc.exists) {
        const userData = userDoc.data();
        if (userData.accountType === "doctor") {
          setUserRole("doctor");
          Toast.show({
            type: "success",
            text1: "Success",
            text2: "Signed in successfully!",
          });
        } else if (userData.accountType === "patient") {
          await auth().signOut();
          setUserRole(null);
          Toast.show({
            type: "info",
            text1: "Patient account detected",
            text2: "Use doctor account instead",
          });
        }
      } else {
        await auth().signOut();
        setUserRole(null);
        Toast.show({
          type: "error",
          text1: "Account not found",
          text2: "Try registering for a new account",
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: error,
        text2: "Please try again",
      });
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.darkback} />
      <Text style={styles.textStyle}>Doctor login</Text>
      <TextInput1
        placeholder="Email address"
        value={email}
        onChangeText={(text) => setEmail(text)}
        autoCapitalize="none"
        style={{ marginBottom: 10 }}
      />
      <TextInput1
        placeholder="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry={true}
        style={{ marginBottom: 10 }}
      />
      <Text
        style={{ fontSize: 14, color: colors.darkgraytext, marginBottom: 20 }}
      >
        Forgot your password?
      </Text>
      <Button1 text="LOGIN" onPress={login} />
      <View
        style={{ flexDirection: "row", alignItems: "center", marginTop: 20 }}
      >
        <View
          style={{ flex: 1, height: 1, backgroundColor: colors.darkgraytext }}
        />
        <View>
          <Text
            style={{
              width: 50,
              textAlign: "center",
              color: colors.darkgraytext,
            }}
          >
            OR
          </Text>
        </View>
        <View
          style={{ flex: 1, height: 1, backgroundColor: colors.darkgraytext }}
        />
      </View>
      <Pressable
        style={({ pressed }) => [
          {
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20,
          },
          pressed && { opacity: 0.8 },
        ]}
        onPress={googleSignin}
      >
        <View
          style={{
            width: "100%",
            height: 52,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ContinueGoogle />
        </View>
      </Pressable>
      <Pressable onPress={registerDoc}>
        <Text style={styles.registerText}>
          Don't have an account?
          <Text style={{ color: colors.lightaccent }}> Register now</Text>
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkback,
    padding: 16,
    paddingTop: 0,
  },

  textStyle: {
    color: colors.whitetext,
    fontSize: 28,
    alignSelf: "center",
    fontWeight: "bold",
    marginBottom: 20,
  },

  registerText: {
    color: colors.lightgraytext,
    alignSelf: "center",
    marginTop: 25,
  },
});