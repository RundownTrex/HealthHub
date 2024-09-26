import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  ScrollView,
  Pressable,
  Image,
  TouchableOpacity,
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
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import * as ImagePicker from "expo-image-picker";
import { Dropdown } from "react-native-element-dropdown";
import { Checkbox } from "react-native-paper";
import storage from "@react-native-firebase/storage";
import MapView, { Marker } from "react-native-maps";
import LoadingOverlay from "../../components/LoadingOverlay";

GoogleSignin.configure({
  webClientId:
    "241519626607-bl6d45ps1pgj89l3fk6e5j45ft67n16e.apps.googleusercontent.com",
});

const doctorDesignations = [
  {
    label: "General physician",
    value: "General physician",
  },
  {
    label: "Skin & Hair",
    value: "Dermatologist",
  },
  {
    label: "Women health",
    value: "Gynecologist",
  },
  {
    label: "Dental care",
    value: "Dentist",
  },
  {
    label: "Mental wellness",
    value: "Psychiatrist",
  },
  {
    label: "Pediatrics",
    value: "Pediatrician",
  },
  {
    label: "Heart specialist",
    value: "Cardiologist",
  },
  {
    label: "Orthopedics",
    value: "Orthopedist",
  },
  {
    label: "Neurology",
    value: "Neurologist",
  },
  {
    label: "ENT",
    value: "Otolaryngologist",
  },
  {
    label: "Urology",
    value: "Urologist",
  },
  {
    label: "Oncology",
    value: "Oncologist",
  },
  {
    label: "Endocrinology",
    value: "Endocrinologist",
  },
  {
    label: "Ophthalmology",
    value: "Ophthalmologist",
  },
  {
    label: "Gastroenterology",
    value: "Gastroenterologist",
  },
  {
    label: "Rheumatology",
    value: "Rheumatologist",
  },
  {
    label: "Nephrology",
    value: "Nephrologist",
  },
  {
    label: "Allergy & Immunology",
    value: "Immunologist",
  },
  {
    label: "Pulmonology",
    value: "Pulmonologist",
  },
  {
    label: "Hematology",
    value: "Hematologist",
  },
];
const initialMarkerPosition = {
  latitude: 18.94024498803612,
  longitude: 72.83573143063485,
};

export default function DoctorSignup({ navigation }) {
  const { userRole, setUserRole } = useContext(RoleContext);
  const [userPfp, setUserPfp] = useState(null);
  const [cpassword, setCpassword] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [region, setRegion] = useState({
    latitude: 18.94024498803612,
    longitude: 72.83573143063485,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [markerPosition, setMarkerPosition] = useState(initialMarkerPosition);

  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  const [doctorProfile, setDoctorProfile] = useState({
    email: "",
    firstname: "",
    lastname: "",
    designation: "",
    licenseNumber: "",
    yearsofexperience: "",
    consultFees: "",
    phone: "",
    clinicConsultation: false,
    virtualConsultation: false,
    clinicName: null,
    clinicCity: null,
    clinicAddress: null,
  });

  const handleInputChange = (name, value) => {
    setDoctorProfile((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const formatTime = (time) => {
    if (!time) return "Set time";
    let hours = time.getHours();
    let minutes = time.getMinutes();
    const isPM = hours >= 12;
    hours = hours % 12 || 12;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours}:${minutes} ${isPM ? "PM" : "AM"}`;
  };

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
      !doctorProfile.email ||
      !password ||
      !doctorProfile.email ||
      !doctorProfile.firstname ||
      !doctorProfile.lastname ||
      !doctorProfile.designation ||
      !doctorProfile.licenseNumber ||
      !doctorProfile.yearsofexperience ||
      !doctorProfile.phone ||
      !doctorProfile.consultFees 
    ) {
      Toast.show({
        type: "error",
        text1: "Enter credentials",
        text2: "All the fields are mandatory",
      });
      setIsLoading(false);
      return;
    }

    if (doctorProfile.licenseNumber.length !== 10 || isNaN(doctorProfile.licenseNumber)) {
      Toast.show({
        type: "error",
        text1: "Invalid License Number",
        text2: "The license number must be exactly 10 digits",
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

    if (
      !doctorProfile.clinicConsultation &&
      !doctorProfile.virtualConsultation
    ) {
      Toast.show({
        type: "error",
        text1: "Please select at least one consultation type",
      });
      setIsLoading(false);
      return;
    }

    if (doctorProfile.clinicConsultation) {
      if (
        !doctorProfile.clinicName ||
        !doctorProfile.clinicCity ||
        !doctorProfile.clinicAddress
      ) {
        Toast.show({
          type: "error",
          text1:
            "Please provide clinic name, city, and address for clinic consultation",
        });
        setIsLoading(false);
        return;
      }
  
      if (
        markerPosition.latitude === initialMarkerPosition.latitude &&
        markerPosition.longitude === initialMarkerPosition.longitude
      ) {
        Toast.show({
          type: "error",
          text1: "Please move the clinic marker to your clinic location",
        });
        setIsLoading(false);
        return;
      }
    }

    console.log(doctorProfile);
    console.log(userPfp);
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        doctorProfile.email,
        password
      );
      const user = userCredential.user;

      await user.sendEmailVerification();

      const profileImageUrl = await uploadImageToFirebase(user.uid);

      const profileData = {
        designation: doctorProfile.designation,
        licenseNumber: doctorProfile.licenseNumber,
        yearsofexperience: doctorProfile.yearsofexperience,
        phone: doctorProfile.phone,
        consultFees: doctorProfile.consultFees,
        clinicConsultation: doctorProfile.clinicConsultation,
        virtualConsultation: doctorProfile.virtualConsultation,
      };

      if (doctorProfile.clinicConsultation) {
        profileData.clinicName = doctorProfile.clinicName;
        profileData.clinicCity = doctorProfile.clinicCity;
        profileData.clinicAddress = doctorProfile.clinicAddress;
      }

      await firestore().collection("profile").doc(user.uid).set(profileData);

      const profileDocRef = firestore().collection("profile").doc(user.uid);

      await firestore().collection("users").doc(user.uid).set({
        email: user.email,
        firstname: doctorProfile.firstname,
        lastname: doctorProfile.lastname,
        pfpUrl: profileImageUrl,
        accountType: "doctor",
        profileRef: profileDocRef,
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

  return (
    <>
      <LoadingOverlay isVisible={isLoading} />

      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}>
          <StatusBar backgroundColor={colors.darkback} />
          <Text style={styles.textStyle}>Doctor Sign up</Text>

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
                    style={{ width: 90, height: 90 }}
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

          <View>
            <Text style={styles.label}>First Name</Text>
            <TextInput1
              placeholder="First name"
              value={doctorProfile.firstname}
              onChangeText={(text) => handleInputChange("firstname", text)}
              style={{ marginBottom: 10 }}
            />
          </View>

          <View>
            <Text style={styles.label}>Last Name</Text>
            <TextInput1
              placeholder="Last name"
              value={doctorProfile.lastname}
              onChangeText={(text) => handleInputChange("lastname", text)}
              style={{ marginBottom: 10 }}
            />
          </View>

          <View>
            <Text style={styles.label}>Email Address</Text>
            <TextInput1
              placeholder="Email address"
              value={doctorProfile.email}
              onChangeText={(text) => handleInputChange("email", text)}
              autoCapitalize="none"
              style={{ marginBottom: 10 }}
            />
          </View>

          <View>
            <Text style={styles.label}>Password</Text>
            <TextInput1
              placeholder="Password"
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry={true}
              style={{ marginBottom: 10 }}
            />
          </View>

          <View>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput1
              placeholder="Confirm password"
              value={cpassword}
              onChangeText={(text) => setCpassword(text)}
              secureTextEntry={true}
              style={{ marginBottom: 10 }}
            />
          </View>

          <View style={{ marginBottom: 5 }}>
            <Text style={[styles.label]}>Designation</Text>
            <Dropdown
              placeholder="Designation"
              data={doctorDesignations}
              maxHeight={500}
              value={doctorProfile.designation}
              onChange={(item) => {
                handleInputChange("designation", item.value);
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

          <View>
            <Text style={styles.label}>Consultation Fees (in ₹)</Text>
            <TextInput1
              placeholder="Consultation Fees"
              value={doctorProfile.consultFees}
              onChangeText={(text) => handleInputChange("consultFees", text)}
              style={{ marginBottom: 10 }}
              kbtype="numeric"
              maxlen={10}
            />
          </View>

          <View>
            <Text style={styles.label}>Medical License Number</Text>
            <TextInput1
              placeholder="Medical License Number"
              value={doctorProfile.licenseNumber}
              onChangeText={(text) => handleInputChange("licenseNumber", text)}
              style={{ marginBottom: 10 }}
              kbtype="numeric"
              maxlen={10}
              minlen={10}
            />
          </View>

          <View>
            <Text style={styles.label}>Years of Experience</Text>
            <TextInput1
              placeholder="Years of experience"
              value={doctorProfile.yearsofexperience}
              onChangeText={(text) =>
                handleInputChange("yearsofexperience", text)
              }
              style={{ marginBottom: 10 }}
              kbtype="numeric"
              maxlen={2}
            />
          </View>

          <View>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput1
              placeholder="Phone number"
              value={doctorProfile.phone}
              onChangeText={(text) => handleInputChange("phone", text)}
              style={{ marginBottom: 10 }}
              kbtype="numeric"
              maxlen={10}
            />
          </View>

          <View>
            <Text style={styles.label}>Available for: </Text>
            <Pressable
              style={[styles.checkItem, { marginBottom: 5 }]}
              onPress={() => {
                handleInputChange("clinicCity", null);
                handleInputChange("clinicName", null);
                handleInputChange("clinicAddress", null);
                handleInputChange(
                  "clinicConsultation",
                  !doctorProfile.clinicConsultation
                );
              }}
            >
              <Checkbox
                status={
                  doctorProfile.clinicConsultation ? "checked" : "unchecked"
                }
                onPress={() => {
                  handleInputChange("clinicCity", null);
                  handleInputChange("clinicName", null);
                  handleInputChange("clinicAddress", null);
                  handleInputChange(
                    "clinicConsultation",
                    !doctorProfile.clinicConsultation
                  );
                }}
                color={colors.lightaccent}
              />
              <Text style={styles.checktext}>Clinic consulation</Text>
            </Pressable>
            <Pressable
              style={styles.checkItem}
              onPress={() => {
                handleInputChange(
                  "virtualConsultation",
                  !doctorProfile.virtualConsultation
                );
              }}
            >
              <Checkbox
                status={
                  doctorProfile.virtualConsultation ? "checked" : "unchecked"
                }
                onPress={() => {
                  handleInputChange(
                    "virtualConsultation",
                    !doctorProfile.virtualConsultation
                  );
                }}
                color={colors.lightaccent}
              />
              <Text style={styles.checktext}>Virtual consulation</Text>
            </Pressable>
          </View>

          {doctorProfile.clinicConsultation && (
            <>
              <View style={{ marginBottom: 10 }}>
                <Text style={styles.label}>Clinic Name</Text>
                <TextInput1
                  placeholder="Clinic name"
                  value={doctorProfile.clinicName}
                  onChangeText={(text) => handleInputChange("clinicName", text)}
                />
              </View>
              <View style={{ marginBottom: 10 }}>
                <Text style={styles.label}>Clinic City</Text>
                <TextInput1
                  placeholder="Clinic city"
                  value={doctorProfile.clinicCity}
                  onChangeText={(text) => handleInputChange("clinicCity", text)}
                />
              </View>
              <View style={{ marginBottom: 10 }}>
                <Text style={styles.label}>Clinic Address</Text>
                <TextInput1
                  placeholder="Clinic address"
                  value={doctorProfile.clinicAddress}
                  onChangeText={(text) =>
                    handleInputChange("clinicAddress", text)
                  }
                  style={{ marginBottom: 10 }}
                  multi={true}
                  no={10}
                />
              </View>
              <View>
                <Text style={[styles.label]}>Clinic Location</Text>
                <Text
                  style={{
                    color: colors.whitetext,
                    fontSize: 16,
                    marginBottom: 5,
                  }}
                >
                  Place the marker on the clinic location
                </Text>
                <View style={{ borderRadius: 10, overflow: "hidden" }}>
                  <MapView
                    style={styles.map}
                    region={region}
                    onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
                    onPress={(e) => {
                      setMarkerPosition(e.nativeEvent.coordinate);
                    }}
                  >
                    <Marker
                      coordinate={markerPosition}
                      draggable
                      onDragEnd={(e) => {
                        setMarkerPosition(e.nativeEvent.coordinate);
                      }}
                    />
                  </MapView>
                </View>
              </View>
            </>
          )}

          <View style={{ padding: 16 }}>
            <Text style={{ color: colors.whitetext, fontSize: 13 }}>
              *By signing up you agree to HealthHub's{" "}
              <Text
                style={{
                  color: colors.linkblue,
                  textDecorationLine: "underline",
                }}
                onPress={() => {
                  console.log("Terms and conditions");
                }}
              >
                Terms and Conditions
              </Text>
              .
            </Text>
          </View>
          <Button1 text="SIGNUP" onPress={registerwemail} />
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

  label: {
    color: colors.darkgraytext,
    fontSize: 14,
  },

  checkItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },

  checktext: {
    color: colors.lightgraytext,
    fontSize: 16,
    fontWeight: "500",
  },
  map: {
    width: "100%",
    height: 300,
  },
});
