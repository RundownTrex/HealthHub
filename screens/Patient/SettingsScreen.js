import { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  BackHandler,
  Pressable,
  Image,
  Linking,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import auth, { deleteUser } from "@react-native-firebase/auth";
import { Divider } from "react-native-paper";
import NotificationSetting from "react-native-open-notification";
import Toast from "react-native-toast-message";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firestore from "@react-native-firebase/firestore";

import colors from "../../utils/colors";
import { useBottomSheet } from "../../context/BottomSheetContext";
import RoleContext from "../../context/RoleContext";
import BackIcon from "../../assets/icons/BackIcon";
import PasswordModal from "../../components/PasswordModal";
import LoadingOverlay from "../../components/LoadingOverlay";

GoogleSignin.configure({
  webClientId:
    "241519626607-bl6d45ps1pgj89l3fk6e5j45ft67n16e.apps.googleusercontent.com",
});

export default function SettingsScreen({ navigation }) {
  const { toggleBottomSheet } = useBottomSheet();
  const { userRole, setUserRole } = useContext(RoleContext);
  const [email, setEmail] = useState(auth().currentUser.email);
  const [isPasswordModalVisible, setPasswordModalVisible] = useState(false);
  const [passwordPromise, setPasswordPromise] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // const deleteUserAccount = async () => {

  //   try {
  //     const user = auth().currentUser;
  //     const providers = user.providerData.map(
  //       (provider) => provider.providerId
  //     );

  //     if (user) {
  //       await user.delete();
  //       setUserRole(null);
  //       AsyncStorage.removeItem("userRole");
  //       Toast.show({
  //         type: "success",
  //         text1: "Account deleted successfully!",
  //       });
  //       console.log("User account deleted successfully");
  //     } else {
  //       Toast.show({
  //         type: "error",
  //         text1: "Problem deleting user account!",
  //       });
  //       console.log("No user is signed in");
  //     }
  //   } catch (error) {
  //     if (error.code === "auth/requires-recent-login") {
  //       console.log(
  //         "User needs to re-authenticate before deleting the account."
  //       );

  //       if (providers.includes("google.com")) {
  //         const { idToken } = await GoogleSignin.signIn();

  //         const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  //         await user.reauthenticateWithCredential(googleCredential);

  //         console.log("Re-authenticated with Google");
  //       } else if (providers.includes("password")) {
  //         // Re-authenticate with Email/Password
  //         const email = user.email;
  //         const password = "user_password_here";

  //         const credential = auth.EmailAuthProvider.credential(email, password);
  //         await user.reauthenticateWithCredential(credential);

  //         console.log("Re-authenticated with Email/Password");
  //       }
  //       await user.delete();
  //       setUserRole(null);
  //       AsyncStorage.removeItem("userRole");
  //       Toast.show({
  //         type: "success",
  //         text1: "Account deleted successfully!",
  //       });
  //       console.log("User account deleted successfully");
  //     } else {
  //       console.error("Error deleting account:", error.message);
  //     }
  //   }
  // };

  const promptForPassword = async () => {
    return new Promise((resolve) => {
      setPasswordModalVisible(true);
      setPasswordPromise(() => resolve);
    });
  };

  const handleSubmit = (password) => {
    if (passwordPromise) {
      passwordPromise(password);
    }
  };

  const confirmDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account permanently!?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: deleteUserAccount,
        },
      ],
      { cancelable: true }
    );
  };

  const deleteUserAccount = async () => {
    console.log("trying to delete...");
    setIsLoading(true);
    try {
      const user = auth().currentUser;
      const userDoc = firestore().collection("users").doc(user.uid);

      if (!user) {
        Toast.show({
          type: "error",
          text1: "No user is signed in",
        });
        setIsLoading(false);
        return;
      }

      const providers = user.providerData.map(
        (provider) => provider.providerId
      );

      console.log(providers);

      if (providers.includes("google.com")) {
        // Re-authenticate with Google

        const { idToken } = await GoogleSignin.signIn();
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
        await user.reauthenticateWithCredential(googleCredential);
        console.log("Re-authenticated with Google");
      } else if (providers.includes("password")) {
        // Re-authenticate with Email/Password
        const email = user.email;
        const password = await promptForPassword(); // Function to prompt user for password
        const credential = auth.EmailAuthProvider.credential(email, password);
        await user.reauthenticateWithCredential(credential);
        console.log("Re-authenticated with Email/Password");
      }

      // Delete the user account after successful re-authentication

      userDoc.delete().then(async () => {
        await user.delete();
        setUserRole(null);
        AsyncStorage.removeItem("userRole");

        Toast.show({
          type: "success",
          text1: "Account deleted successfully!",
        });
        console.log("User account deleted successfully");
        setIsLoading(false);
      });
    } catch (error) {
      console.error(
        "Error during re-authentication or account deletion:",
        error.message
      );
      Toast.show({
        type: "error",
        text1: "Problem deleting user account!",
        text2: "Check if the password you entered is correct",
      });
      setPasswordModalVisible(false);
      setIsLoading(false);
    }
  };

  const openNotificationSettings = () => {
    NotificationSetting.open();
  };

  useEffect(() => {
    toggleBottomSheet(true);
    const backAction = () => {
      navigation.pop();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => {
      toggleBottomSheet(false);
      backHandler.remove();
    };
  }, [toggleBottomSheet, navigation]);

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
          Settings
        </Text>
        <View style={{ height: 20, width: 20 }} />
      </View>
      <View style={styles.container}>
        <Text style={styles.label}>Account settings</Text>
        <View style={styles.menucontainer}>
          <Pressable style={styles.menuitem}>
            <Text style={styles.menuitemText}>Email</Text>
            <View style={{ flexDirection: "row", gap: 5 }}>
              <Text style={styles.email}>{email}</Text>
              <Ionicons
                name="chevron-forward-outline"
                size={22}
                color={colors.whitetext}
              />
            </View>
          </Pressable>
          <Divider />
          <Pressable style={styles.menuitem}>
            <Text style={styles.menuitemText}>Password</Text>
            <View>
              <Ionicons
                name="chevron-forward-outline"
                size={22}
                color={colors.whitetext}
              />
            </View>
          </Pressable>
          <Divider />
          <Pressable style={styles.menuitem} onPress={confirmDeleteAccount}>
            <Text style={[styles.menuitemText, { color: "red" }]}>
              Delete account
            </Text>
            <View>
              <Ionicons
                name="chevron-forward-outline"
                size={22}
                color={colors.whitetext}
              />
            </View>
          </Pressable>
        </View>

        <Text style={styles.label}>General settings</Text>
        <View style={styles.menucontainer}>
          <Pressable style={styles.menuitem} onPress={openNotificationSettings}>
            <Text style={styles.menuitemText}>Notification settings</Text>
            <View style={{ flexDirection: "row", gap: 5 }}>
              <Ionicons
                name="chevron-forward-outline"
                size={22}
                color={colors.whitetext}
              />
            </View>
          </Pressable>
        </View>
      </View>
      <PasswordModal
        visible={isPasswordModalVisible}
        onClose={() => {
          setPasswordModalVisible(false);
          setIsLoading(false);
        }}
        onSubmit={handleSubmit}
      />
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkback,
    padding: 16,
  },
  label: {
    color: colors.lightgraytext,
    fontSize: 14,
  },
  menucontainer: {
    marginTop: 10,
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: colors.somewhatlightback,
  },
  menuitem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 15,
  },
  menuitemText: {
    color: colors.whitetext,
    fontWeight: "bold",
    fontSize: 17,
  },
  email: {
    color: colors.lightgraytext,
    alignSelf: "center",
  },
});
