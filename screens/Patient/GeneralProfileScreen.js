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

import colors from "../../utils/colors";
import { useBottomSheet } from "../../context/BottomSheetContext";
import BackIcon from "../../assets/icons/BackIcon";
import TextInput1 from "../../components/TextInput1";
import Button1 from "../../components/Button1";
import LoadingOverlay from "../../components/LoadingOverlay";

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

export default function GeneralProfileScreen({ navigation }) {
  const { toggleBottomSheet } = useBottomSheet();

  const [userPfp, setUserPfp] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

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

  useEffect(() => {
    const fetchUserProfile = () => {
      const user = auth().currentUser;

      if (user) {
        setUserPfp(user.photoURL);
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

  const handleDobChange = (input) => {
    const cleaned = input.replace(/[^\d]/g, "");

    let formatted = cleaned;
    if (cleaned.length >= 2) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    }
    if (cleaned.length >= 4) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(
        2,
        4
      )}/${cleaned.slice(4)}`;
    }

    // Limit the input to 10 characters (DD/MM/YYYY)
    if (formatted.length <= 10) {
      setDob(formatted);
    }
  };

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
          General Profile
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

            <View style={styles.editIcon}>
              <Image
                source={require("../../assets/edit.png")}
                style={{ width: 19, height: 19 }}
              />
            </View>
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
              Upload your real photo, as it will be visible to the doctors.
            </Text>
          </View>
        </View>
        <Divider />
        <View style={{ marginVertical: 10 }}>
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
        <View style={{ marginVertical: 10 }}>
          <Text style={styles.label}>Date of Birth</Text>
          <TextInput1
            // type={"datetime"}
            // options={{
            //   format: "DD/MM/YYYY",
            // }}
            placeholder="DD/MM/YYYY"
            placeholderTextColor={colors.lightgraytext}
            value={dob}
            onChangeText={handleDobChange}
            maxLength={10}
            // style={{
            //   height: 45,
            //   borderColor: "gray",
            //   borderWidth: 1,
            //   paddingHorizontal: 10,
            //   paddingVertical: 12,
            //   borderRadius: 2,
            //   color: colors.whitetext,
            //   backgroundColor: colors.somewhatlightback,
            //   fontSize: 16,
            //   marginVertical: 5,
            // }}
            kbtype="numeric"
            maxlen={10}
          />
        </View>
        <View>
          <Text style={[styles.label, { marginBottom: 5 }]}>
            Gender at birth
          </Text>
          <Dropdown
            placeholder="Gender"
            data={genders}
            maxHeight={500}
            value={gender}
            onChange={(item) => {
              setGender(item.value);
            }}
            style={{
              height: 45,
              borderColor: "gray",
              borderWidth: 1,
              paddingHorizontal: 10,
              paddingVertical: 12,
              borderRadius: 2,
              backgroundColor: colors.somewhatlightback,
              fontSize: 16,
              marginVertical: 5,
            }}
            placeholderStyle={{
              color: colors.lightgraytext,
            }}
            labelField="label"
            valueField="value"
            itemContainerStyle={{
              backgroundColor: colors.darkback,
              borderRadius: 8,
            }}
            selectedTextStyle={{
              color: colors.whitetext,
            }}
            mode="modal"
            itemTextStyle={{
              color: colors.whitetext,
            }}
            containerStyle={{
              backgroundColor: colors.darkback,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: colors.darkback,
            }}
            activeColor={colors.somewhatlightback}
            backgroundColor="#000000b3"
          />
        </View>

        <View
          style={{
            alignSelf: "center",
            marginVertical: 20,
          }}
        >
          <Button1
            onPress={() => console.log("Submitted")}
            text="Save Changes"
          />
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
