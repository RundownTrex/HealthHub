import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  ScrollView,
  Pressable,
} from "react-native";
import colors from "../../utils/colors";
import TextInput1 from "../../components/TextInput1";
import Button1 from "../../components/Button1";
import Toast from "react-native-toast-message";
import SignupGoogle from "../../assets/SignupGoogle";

import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

GoogleSignin.configure({
  webClientId:
    "241519626607-bl6d45ps1pgj89l3fk6e5j45ft67n16e.apps.googleusercontent.com",
});

export default function DoctorSignup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");

  const registerwemail = async () => {
    if (!email || !password || !cpassword || !firstname || !lastname) {
      Toast.show({
        type: "error",
        text1: "Enter credentials",
        text2: "All the fields are mandatory",
      });
      return;
    }

    if (password !== cpassword) {
      Toast.show({
        type: "error",
        text1: "Enter proper password",
        text2: "The password and confirm password should be same",
      });
      return;
    }

    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password
      );
      const user = userCredential.user;

      await user.sendEmailVerification();

      await firestore().collection("users").doc(user.uid).set({
        email: user.email,
        firstname,
        lastname,
        accountType: "doctor",
      });

      Toast.show({
        type: "info",
        text1: "Verification email sent",
        text2: "Check your inbox for the verification email",
      });
    } catch (error) {
      console.log(error);
      Toast.show({
        type: "error",
        text1: "Error signing up!",
        text2: error,
      });
    }
  };

  const signupwgoogle = async () => {
    try {
      await GoogleSignin.signOut();
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const { idToken } = await GoogleSignin.signIn({
        prompt: "select_account",
      });

      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      const userCredential = await auth().signInWithCredential(googleCredential);

      const user = userCredential.user;

      const userDoc = firestore().collection("users").doc(user.uid);
      const docSnap = await userDoc.get();

      if (docSnap.exists) {
        Toast.show({
          type: "info",
          text1: "User already present",
          text2: "Try signing in instead",
        });
      } else {
        await userDoc.set({
          email: user.email,
          firstname: user.displayName.split(" ")[0],
          lastname: user.displayName.split(" ")[1],
          accountType: "doctor",
        });

        Toast.show({
          type: "success",
          text1: "Signed up with google!",
          text2: "Redirecting...",
        });
      }
    } catch (error) {
      console.log(error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Could not sign up with google",
      });
    }
  };

  return (
    <KeyboardAvoidingView behavior={"height"} style={styles.container}>
      <ScrollView style={{ flexGrow: 1 }}>
        <StatusBar backgroundColor={colors.darkback} />
        <Text style={styles.textStyle}>Patient Sign up</Text>

        <TextInput1
          placeholder="First name"
          value={firstname}
          onChangeText={(text) => setFirstname(text)}
          style={{ marginBottom: 10 }}
        />

        <TextInput1
          placeholder="Last name"
          value={lastname}
          onChangeText={(text) => setLastname(text)}
          style={{ marginBottom: 10 }}
        />

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

        <TextInput1
          placeholder="Confirm password"
          value={cpassword}
          onChangeText={(text) => setCpassword(text)}
          secureTextEntry={true}
          style={{ marginBottom: 20 }}
        />

        <Button1 text="SIGNUP" onPress={registerwemail} />
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
          onPress={() => {
            signupwgoogle();
          }}
        >
          <View
            style={{
              width: "100%",
              height: 52,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <SignupGoogle />
          </View>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
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
    marginTop: 0,
  },
});
