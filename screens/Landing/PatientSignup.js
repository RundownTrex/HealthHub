import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  ScrollView,
  Pressable,
  Alert,
  Image,
} from "react-native";
import colors from "../../utils/colors";
import TextInput1 from "../../components/TextInput1";
import Button1 from "../../components/Button1";
import Toast from "react-native-toast-message";
import SignupGoogle from "../../assets/SignupGoogle";
import RoleContext from "../../context/RoleContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import * as ImagePicker from "expo-image-picker";

import LoadingOverlay from "../../components/LoadingOverlay";

GoogleSignin.configure({
  webClientId:
    "241519626607-bl6d45ps1pgj89l3fk6e5j45ft67n16e.apps.googleusercontent.com",
});

export default function PatientSignup({ navigation }) {
  const [userPfp, setUserPfp] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { userRole, setUserRole } = useContext(RoleContext);

  const pickImage = async () => {
    // Ask for permission to access media library
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permission to access the camera roll is required!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setUserPfp(result.assets[0].uri);
    }
  };

  const uploadImageToFirebase = async (userId) => {
    console.log(userPfp);
    if (!userPfp) return null;

    const fileName = userPfp.substring(userPfp.lastIndexOf("/") + 1);
    const storageRef = storage().ref(`userPfps/${userId}/${fileName}`);

    try {
      console.log("Uploading image to Firebase:", userPfp);
      await storageRef.putFile(userPfp);
      const downloadURL = await storageRef.getDownloadURL();
      console.log("Image uploaded successfully. Download URL:", downloadURL);
      return downloadURL;
    } catch (error) {
      console.log("Image upload error: ", error);
      return null;
    }
  };

  const registerwemail = async () => {
    setIsLoading(true);
    if (
      !userPfp ||
      !email ||
      !password ||
      !cpassword ||
      !firstname ||
      !lastname
    ) {
      Toast.show({
        type: "error",
        text1: "Enter credentials",
        text2: "All the fields are mandatory",
      });
      setIsLoading(false);
      return;
    }

    if (password !== cpassword) {
      Toast.show({
        type: "error",
        text1: "Enter proper password",
        text2: "The password and confirm password should be same",
      });
      setIsLoading(false);
      return;
    }

    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password
      );

      const user = userCredential.user;
      console.log("Before verification");
      await user.sendEmailVerification();
      console.log("After verification");

      const profileImageUrl = await uploadImageToFirebase(user.uid);
      console.log(profileImageUrl);
      await firestore()
        .collection("users")
        .doc(user.uid)
        .set({
          email: user.email,
          firstname,
          lastname,
          pfpUrl: profileImageUrl || "",
          accountType: "patient",
        });

      Toast.show({
        type: "info",
        text1: "Verification email sent",
        text2: "Check your inbox for the verification email",
      });
      navigation.pop();
    } catch (error) {
      console.log(error);
      if (error.code.includes("email-already-in-use")) {
        Toast.show({
          type: "error",
          text1: "Email is already in use",
          text2: "Try logging in instead",
        });
        setIsLoading(false);
      } else {
        Toast.show({
          type: "error",
          text1: "Error signing up!",
          text2: error,
        });
        setIsLoading(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signupwgoogle = async () => {
    setIsLoading(true);
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
          accountType: "patient",
          pfpUrl: user.photoURL,
        });

        setUserRole("patient");
        await AsyncStorage.setItem("userRole", "patient");

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
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <LoadingOverlay isVisible={isLoading} />
      <KeyboardAvoidingView behavior={"height"} style={styles.container}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 16 }}>
          <StatusBar backgroundColor={colors.darkback} />
          <Text style={styles.textStyle}>Patient Sign up</Text>
          <View style={{ flexDirection: "row", alignSelf: "center" }}>
            <Pressable onPress={pickImage}>
              <View style={styles.avatar}>
                {userPfp !== null ? (
                  <Image
                    source={{ uri: userPfp }}
                    style={{ width: 90, height: 90, borderRadius: 100 }}
                  />
                ) : (
                  <Image
                    source={require("../../assets/avatar.png")}
                    style={{ width: 90, height: 90, borderRadius: 100 }}
                  />
                )}
              </View>

              <View style={styles.editIcon}>
                <Image
                  source={require("../../assets/edit.png")}
                  style={{ width: 19, height: 19 }}
                />
              </View>
            </Pressable>
          </View>

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
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 20,
            }}
          >
            <View
              style={{
                flex: 1,
                height: 1,
                backgroundColor: colors.darkgraytext,
              }}
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
              style={{
                flex: 1,
                height: 1,
                backgroundColor: colors.darkgraytext,
              }}
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
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkback,
    padding: 16,
    paddingTop: 0,
    paddingBottom: 0,
  },

  textStyle: {
    color: colors.whitetext,
    fontSize: 28,
    alignSelf: "center",
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 0,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 100,
    overflow: "hidden",
    marginTop: 16,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  editIcon: {
    position: "absolute",
    bottom: 15,
    right: 0,
    backgroundColor: colors.complementary,
    borderRadius: 100,
    padding: 3,
    borderWidth: 4,
    borderColor: colors.darkback,
  },
});
