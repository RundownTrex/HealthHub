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
import storage from "@react-native-firebase/storage";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

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

  const [canChangePassword, setCanChangePassword] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const user = auth().currentUser;

    if (user) {
      const providerData = user.providerData;
      const isPasswordAuth = providerData.some(
        (provider) => provider.providerId === "password"
      );
      setCanChangePassword(isPasswordAuth);
      setIsLoading(false);
    }
  }, []);

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
  const deleteSubcollections = async (docRef) => {
    try {
      const subcollections = await docRef.listCollections();
      
      if (subcollections.length === 0) {
        console.log("No subcollections to delete.");
        return;
      }
  
      const deletePromises = subcollections.map(async (subcollection) => {
        const subcollectionSnapshot = await subcollection.get();
        const deleteDocsPromises = subcollectionSnapshot.docs.map((doc) =>
          doc.ref.delete()
        );
        await Promise.all(deleteDocsPromises);
        console.log(`Deleted subcollection: ${subcollection.id}`);
      });
      
      await Promise.all(deletePromises);
      console.log("All subcollections deleted successfully");
    } catch (error) {
      console.error("Error deleting subcollections:", error);
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
      const profileDoc = firestore().collection("profile").doc(user.uid);

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

      await deleteAvatarFolder(user.uid);

      await userDoc.delete();

      const profileDocSnapshot = await profileDoc.get();
      if (profileDocSnapshot.exists) {
        await deleteSubcollections(profileDoc);

        await profileDoc.delete();
        console.log(
          "Profile document and its subcollections deleted successfully"
        );
      } else {
        console.log("Profile document not found, no deletion needed");
      }

      await user.delete();

      setUserRole(null);
      await AsyncStorage.removeItem("userRole");

      Toast.show({
        type: "success",
        text1: "Account deleted successfully!",
      });
      console.log("User account deleted successfully");
      setIsLoading(false);
    } catch (error) {
      console.log(
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

  const deleteAvatarFolder = async (uid) => {
    const folderRef = storage().ref(`userPfps/${uid}`);

    try {
      const folderContents = await folderRef.listAll();

      const deletePromises = folderContents.items.map((fileRef) =>
        fileRef.delete()
      );
      await Promise.all(deletePromises);

      console.log("Deleted avatar folder in Firebase Storage");
    } catch (error) {
      console.log("Error deleting avatar folder:", error.message);
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
              {/* <Ionicons
                name="chevron-forward-outline"
                size={22}
                color={colors.whitetext}
              /> */}
            </View>
          </Pressable>
          <Divider />
          {canChangePassword ? (
            <Pressable
              style={styles.menuitem}
              onPress={() => navigation.navigate("PasswordChangeScreen")}
            >
              <Text style={styles.menuitemText}>Change password</Text>
              <View>
                <Ionicons
                  name="chevron-forward-outline"
                  size={22}
                  color={colors.whitetext}
                />
              </View>
            </Pressable>
          ) : (
            <View style={[styles.menuitem]}>
              <Text
                style={[styles.menuitemText, { color: colors.lightgraytext }]}
              >
                Change password
              </Text>
              <View>
                <Text style={styles.googleAuth}>Authenticated with Google</Text>
              </View>
            </View>
          )}
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
  googleAuth: {
    color: colors.whitetext,
    fontSize: wp("2.5%"),
    width: "60%",
    alignSelf: "flex-end",
    textAlign: "left",
  },
});
