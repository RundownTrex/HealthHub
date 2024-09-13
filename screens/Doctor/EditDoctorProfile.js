import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  BackHandler,
  Pressable,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import auth from "@react-native-firebase/auth";
import * as ImagePicker from "expo-image-picker";
import { Divider } from "react-native-paper";
import { TextInputMask } from "react-native-masked-text";
import { Dropdown } from "react-native-element-dropdown";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import Toast from "react-native-toast-message";

import colors from "../../utils/colors";
import { useBottomSheet } from "../../context/BottomSheetContext";
import BackIcon from "../../assets/icons/BackIcon";
import TextInput1 from "../../components/TextInput1";
import Button1 from "../../components/Button1";
import LoadingOverlay from "../../components/LoadingOverlay";

let data;
let profileData;

const genders = [
  {
    label: "Male",
    value: "male",
  },
  {
    label: "Female",
    value: "female",
  },
  {
    label: "Other",
    value: "other",
  },
];

export default function EditDoctorProfile({ navigation }) {
  const { toggleBottomSheet } = useBottomSheet();

  const [userPfp, setUserPfp] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [about, setAbout] = useState("");
  const [specializations, setSpecializations] = useState("");
  const [workexperience, setWorkExperience] = useState("");
  const [education, setEducation] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const user = auth().currentUser;

  const pickImage = async () => {
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

    console.log(result.assets[0].uri);

    if (!result.canceled) {
      setUserPfp(result.assets[0].uri);
    }
  };

  const clearFolderInFirebase = async (folderPath) => {
    const storageRef = storage().ref(folderPath);
    try {
      const folderContents = await storageRef.listAll();
      const deletePromises = folderContents.items.map((itemRef) =>
        itemRef.delete()
      );
      await Promise.all(deletePromises);
      console.log("Folder emptied successfully.");
    } catch (error) {
      console.error("Error emptying folder: ", error);
    }
  };

  const uploadImageToFirebase = async () => {
    let userId = user.uid;
    console.log("UID: ", userId);

    if (!userPfp) return null;

    const folderPath = `userPfps/${userId}`;

    await clearFolderInFirebase(folderPath);

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

  const saveChanges = async () => {
    setIsLoading(true);
    try {
      if (userPfp === data.pfpUrl) {
        await firestore().collection("users").doc(user.uid).update({
          firstname: firstName,
          lastname: lastName,
        });
      } else {
        let newPfpLink = await uploadImageToFirebase();
        await firestore().collection("users").doc(user.uid).update({
          pfpUrl: newPfpLink,
          firstname: firstName,
          lastname: lastName,
        });
      }

      await firestore().collection("profile").doc(user.uid).update({
        about,
        specializations,
        workexperience,
        education,
      });

      setIsLoading(false);
      Toast.show({
        type: "success",
        text1: "Profile edited successfully",
      });
    } catch (error) {
      console.error("Error updating profile : ", error);
      setIsLoading(false);
      Toast.show({
        type: "error",
        text1: "Failed to update profile",
        text2: "Make sure none of the fields are left empty",
      });
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        try {
          const userDoc = await firestore()
            .collection("users")
            .doc(user.uid)
            .get();

          const profileDoc = await firestore()
            .collection("profile")
            .doc(user.uid)
            .get();

          if (userDoc.exists) {
            data = userDoc.data();
            profileData = profileDoc.data();
            setUserPfp(data.pfpUrl);
            setFirstName(data.firstname);
            setLastName(data.lastname);
            setAbout(profileData.about);
            setSpecializations(profileData.specializations);
            setWorkExperience(profileData.workexperience);
            setEducation(profileData.education);

            console.log(data);
            console.log(profileData);
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching document: ", error);
        }
      } else {
        console.log("No user is logged in");
      }
    };

    fetchUserProfile();
  }, []);

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
          Edit Profile
        </Text>
        <View style={{ height: 20, width: 20 }} />
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "flex-start",
            alignSelf: "center",
          }}
        >
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
            {userPfp === null && (
              <View style={styles.editIcon}>
                <Image
                  source={require("../../assets/edit.png")}
                  style={{ width: 19, height: 19 }}
                />
              </View>
            )}
          </Pressable>
          <View style={{ alignSelf: "center", marginLeft: 20, flex: 1 }}>
            <Text
              style={{
                color: colors.whitetext,
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              Edit Profile Picture
            </Text>
            <Text
              style={{
                color: colors.lightgraytext,
                fontSize: 14,
              }}
            >
              Upload your real photo, as it will be visible to others.
            </Text>
          </View>
        </View>
        <Divider />
        <View style={{ marginTop: 10 }}>
          <Text style={styles.label}>First Name</Text>
          <TextInput1
            placeholder="Ex. John"
            value={firstName}
            onChangeText={(p) => setFirstName(p)}
          />
        </View>
        <View>
          <Text style={styles.label}>Last Name</Text>
          <TextInput1
            placeholder="Ex. Doe"
            value={lastName}
            onChangeText={(p) => setLastName(p)}
          />
        </View>

        <View style={{ marginBottom: 0 }}>
          <Text style={styles.label}>About</Text>
          <TextInput1
            placeholder="About"
            value={about}
            onChangeText={(text) => setAbout(text)}
            style={{ marginBottom: 10 }}
            multi={true}
            no={10}
          />
        </View>
        <View style={{ marginBottom: 10 }}>
          <Text style={styles.label}>Specializations</Text>
          <TextInput1
            placeholder="Specializations"
            value={specializations}
            onChangeText={(text) => setSpecializations(text)}
            style={{ marginBottom: 10 }}
            multi={true}
            no={3}
          />
        </View>
        <View style={{ marginBottom: 10 }}>
          <Text style={styles.label}>Work Experience</Text>
          <TextInput1
            placeholder="Work Experience"
            value={workexperience}
            onChangeText={(text) => setWorkExperience(text)}
            style={{ marginBottom: 10 }}
            multi={true}
            no={5}
          />
        </View>
        <View style={{ marginBottom: 10 }}>
          <Text style={styles.label}>Education/Degree</Text>
          <TextInput1
            placeholder="Degrees"
            value={education}
            onChangeText={(text) => setEducation(text)}
            style={{ marginBottom: 10 }}
            multi={true}
            no={5}
          />
        </View>

        <View
          style={{
            alignSelf: "center",
            marginVertical: 20,
          }}
        >
          <Button1 onPress={() => saveChanges()} text="Save Changes" />
        </View>
      </ScrollView>
      <LoadingOverlay isVisible={isLoading} />
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.darkback,
    // alignItems: "center",
    padding: 16,
    // height: "100%",
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

  label: {
    color: colors.lightgraytext,
    fontSize: 14,
  },
});
