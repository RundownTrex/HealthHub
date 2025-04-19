import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Dimensions,
  BackHandler,
  KeyboardAvoidingView,
} from "react-native";
import BackIcon from "../../assets/icons/BackIcon";
import { Dropdown } from "react-native-element-dropdown";
import Toast from "react-native-toast-message";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

import colors from "../../utils/colors";
import { useBottomSheet } from "../../context/BottomSheetContext";
import Button1 from "../../components/Button1";
import LoadingOverlay from "../../components/LoadingOverlay";
import TextInput1 from "../../components/TextInput1";

const { width } = Dimensions.get("window");

export default function ReportScreen({ navigation, route }) {
  const { doctor } = route.params;

  const { toggleBottomSheet } = useBottomSheet();
  const [desc, setDesc] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const user = auth().currentUser;

  useEffect(() => {
    console.log(doctor);
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

  const submitReport = async () => {
    try {
      setIsLoading(true);

      // Define the report data
      const reportData = {
        description: desc,
        userId: user.uid,
        doctorId: doctor.id,
        doctorName: `${doctor.firstname} ${doctor.lastname}`,
        timestamp: firestore.FieldValue.serverTimestamp(),
      };

      await firestore()
        .collection("profile")
        .doc(doctor.id)
        .collection("reports")
        .add(reportData);

      Toast.show({
        type: "success",
        text1: "Report submitted successfully",
      });

      setIsLoading(false);
      navigation.pop();
    } catch (error) {
      console.error("Error submitting report: ", error);
      Toast.show({
        type: "error",
        text1: "Failed to submit report",
      });
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
          Report {doctor.firstname} {doctor.lastname}
        </Text>
        <View style={{ height: 20, width: 20 }} />
      </View>
      <KeyboardAvoidingView style={styles.container}>
        <Text style={styles.label}>Description</Text>
        <TextInput1
          placeholder="Enter description"
          value={desc}
          onChangeText={(e) => setDesc(e)}
          multi={true}
          numberOfLines={100}
        />

        {desc.trim() !== "" && (
          <Button1
            style={{ marginTop: 10 }}
            onPress={() => {
              console.log(desc);
              submitReport();
            }}
            text="Report"
          />
        )}
      </KeyboardAvoidingView>
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

  label: {
    color: colors.lightgraytext,
    fontSize: 14,
  },
});
