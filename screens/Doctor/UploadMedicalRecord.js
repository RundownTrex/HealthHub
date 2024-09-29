import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Dimensions,
  BackHandler,
} from "react-native";
import BackIcon from "../../assets/icons/BackIcon";
import { Dropdown } from "react-native-element-dropdown";
import * as DocumentPicker from "expo-document-picker";
import Toast from "react-native-toast-message";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import * as FileSystem from "expo-file-system";

import colors from "../../utils/colors";
import { useBottomSheet } from "../../context/BottomSheetContext";
import Button1 from "../../components/Button1";
import LoadingOverlay from "../../components/LoadingOverlay";
import TextInput1 from "../../components/TextInput1";

const { width } = Dimensions.get("window");

const bgroup = [
  { label: "Reports", value: "reports" },
  { label: "Prescriptions", value: "prescriptions" },
  { label: "Invoices", value: "invoices" },
  { label: "Vaccination records", value: "vaccinationrecords" },
];

export default function UploadMedicalRecord({ navigation, route }) {
  const { appointment } = route.params;

  const { toggleBottomSheet } = useBottomSheet();
  const [recordType, setRecordType] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [rname, setRname] = useState("");
  const user = auth().currentUser;

  useEffect(() => {
    console.log(appointment);
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
      backHandler.remove();
    };
  }, [toggleBottomSheet, navigation]);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*", // Allows all file types
        copyToCacheDirectory: false,
      });

      console.log(result);

      if (result.assets && result.assets.length > 0) {
        const fileUri = result.assets[0].uri;
        const fileName = result.assets[0].name;

        const cacheFileUri = `${FileSystem.cacheDirectory}${fileName}`;
        await FileSystem.copyAsync({
          from: fileUri,
          to: cacheFileUri,
        });

        setSelectedFile(cacheFileUri);
        setSelectedFileName(fileName);

        console.log("Document picked and copied to cache:", cacheFileUri);
      } else if (result.canceled) {
        console.log("Document picking canceled.");
      } else {
        console.log("No file selected.");
      }
    } catch (error) {
      console.error("Error picking document:", error);
    }
  };

  const save = async () => {
    if (!rname || !recordType || !selectedFile) {
      Toast.show({
        type: "error",
        text1: "Please complete all fields",
      });
      return;
    }

    const lab = bgroup.find((option) => option.value === recordType);
    const selectedLabel = lab.label;

    const fileUri = selectedFile;
    const fileName = selectedFileName;
    const fileExtension = fileName.split(".").pop();

    setIsLoading(true);

    try {
      const storageRef = storage().ref(
        `medicalRecords/${appointment.id}/${fileName}`
      );
      await storageRef.putFile(fileUri);

      console.log("here!!!!!!!!");

      const downloadURL = await storageRef.getDownloadURL();

      const docDoc = await firestore().collection("users").doc(user.uid).get();

      const docData = docDoc.data();

      const doctorName = `${docData.firstname} ${docData.lastname}`;

      const record = {
        name: rname,
        type: selectedLabel,
        fileName: fileName,
        fileUrl: downloadURL,
        createdAt: new Date(),
        appointmentId: appointment.id,
        patientId: appointment.patientId,
        doctorId: appointment.doctorId,
        doctorName: doctorName,
      };

      await firestore()
        .collection("users")
        .doc(appointment.patientId)
        .collection("medicalRecords")
        .add(record);

      const API_URL = `http://${LOCAL_IP}:3000/add-medical-record`;
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appointmentId: appointment.id,
          doctorName: doctorName,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Notification sent successfully:", result.message);
      } else {
        console.error("Error sending notification:", result.error);
      }

      Toast.show({
        type: "success",
        text1: "Record uploaded successfully!",
      });

      navigation.pop();
    } catch (error) {
      console.error("Error uploading record:", error);
      Toast.show({
        type: "error",
        text1: "Failed to upload record",
      });
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
          Upload a medical record
        </Text>
        <View style={{ height: 20, width: 20 }} />
      </View>
      <View style={styles.container}>
        <Pressable
          style={({ pressed }) => [styles.button, pressed && { opacity: 0.8 }]}
          onPress={pickDocument}
        >
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Image
              source={require("../../assets/upload.png")}
              style={{ height: 30, width: 30 }}
            />
            <Text style={[styles.buttonText]}>Select a file to upload</Text>
            <View style={{ height: 30, width: 30 }} />
          </View>
          {selectedFile && (
            <Text style={styles.selectedfiletext}>
              <Text style={{ fontWeight: "bold" }}>Selected File:</Text>
              {selectedFileName}
            </Text>
          )}
        </Pressable>

        <View style={{ marginVertical: 10 }}>
          <Text style={styles.label}>Record name</Text>
          <TextInput1
            placeholder="Ex. Corona Report 2024"
            value={rname}
            onChangeText={(p) => setRname(p)}
          />
        </View>
        <View style={{ marginBottom: 16 }}>
          <Text style={styles.label}>Type of record</Text>
          <Dropdown
            placeholder="Medical Records"
            data={bgroup}
            maxHeight={500}
            value={recordType}
            onChange={(item) => {
              setRecordType(item.value);
            }}
            style={{
              height: 50,
              borderColor: "gray",
              borderWidth: 1,
              paddingHorizontal: 10,
              paddingVertical: 12,
              backgroundColor: colors.somewhatlightback,
              fontSize: 16,
              marginVertical: 5,
              borderRadius: 2,
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

        {selectedFile && <Button1 text="Save" onPress={save} />}
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkback,
    padding: 16,
    // justifyContent: "center",
    // alignItems: "center",
  },

  rercordscontainer: {
    flex: 1,
    justifyContent: "center",
  },

  noRecords: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    gap: 50,
  },

  button: {
    backgroundColor: colors.lightaccent,
    paddingVertical: 14,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "space-between",
    width: width - 32,
    borderRadius: 8,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: colors.whitetext,
    fontSize: 17,
    fontWeight: "500",
  },

  selectedfiletext: {
    color: colors.whitetext,
    paddingTop: 10,
  },
  label: {
    color: colors.lightgraytext,
    fontSize: 14,
  },
});
