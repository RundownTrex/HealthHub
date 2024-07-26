import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Pressable,
  Image,
  Dimensions,
} from "react-native";
import colors from "../../utils/colors";
import TextInput1 from "../../components/TextInput1";
import Button1 from "../../components/Button1";
import ContinueGoogle from "../../assets/ContinueGoogle";
import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../firebaseconfig";
import Toast from "react-native-toast-message";
import { signInWithCredential } from "firebase/auth";
// import { GoogleSignin } from "@react-native-google-signin/google-signin";

const { width } = Dimensions.get("window");

const provider = new GoogleAuthProvider();

// GoogleSignin.configure({
//   webClientId:
//     "241519626607-bl6d45ps1pgj89l3fk6e5j45ft67n16e.apps.googleusercontent.com",
// });

export default function PatientLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigation = useNavigation();

  const registerPatient = () => {
    navigation.navigate("Patient signup");
  };

  //Email signin
  const login = () => {
    //Firebase stuff
    signInWithEmailAndPassword(auth, email, password)
      .then((userCreds) => {
        Toast.show({
          type: "success",
          text1: "Logged in successfully!",
          text2: "Redirecting to home screen...",
        });
        console.log("Right user!");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.messsage;
        console.log("Something went wrong!");
        Toast.show({
          type: "error",
          text1: "Error logging in",
          text2: "Please recheck your credentials",
        });
      });
  };

  //Google signin
  const googleSignin = async () => {
    // try {
    //   await GoogleSignin.hasPlayServices();
    //   const userInfo = await GoogleSignin.signIn();
    //   const googleCredential = auth.GoogleAuthProvider.credential(
    //     userInfo.idToken
    //   );
    //   const user = await auth().signInWithCredential(googleCredential);

    //   Toast.show({
    //     type: "success",
    //     text1: "Signed in with google",
    //     text2: "Redirecting to home screen",
    //   });
    // } catch (error) {
    //   console.log(error);
    //   Toast.show({
    //     type: "error",
    //     text1: error,
    //     text2: "Please try again",
    //   });
    // }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.darkback} />
      <Text style={styles.textStyle}>Patient login</Text>
      <TextInput1
        placeholder="Email address"
        value={email}
        onChangeText={(text) => setEmail(text)}
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
      <Pressable onPress={registerPatient}>
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
  },

  textStyle: {
    color: colors.whitetext,
    fontSize: 28,
    alignSelf: "center",
    fontWeight: "bold",
    marginBottom: 16,
  },

  registerText: {
    color: colors.lightgraytext,
    alignSelf: "center",
    marginTop: 25,
  },
});
