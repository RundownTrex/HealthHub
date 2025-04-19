import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  BackHandler,
  Pressable,
  Image,
} from "react-native";
import { useBottomSheet } from "../../context/BottomSheetContext";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { Divider } from "react-native-paper";

import colors from "../../utils/colors";
import BackIcon from "../../assets/icons/BackIcon";
import LoadingOverlay from "../../components/LoadingOverlay";

export default function SlotType({ navigation }) {
  const { toggleBottomSheet } = useBottomSheet();
  const [isLoading, setIsLoading] = useState(false);
  const [doctorData, setDoctorData] = useState({});

  const user = auth().currentUser;

  useEffect(() => {
    setIsLoading(true);
    const fetchUserProfile = async () => {
      if (user) {
        try {
          const profileDoc = await firestore()
            .collection("profile")
            .doc(user.uid)
            .get();

          if (profileDoc.exists) {
            data = profileDoc.data();
            setDoctorData(data);
          } else {
            console.log("No such document!");
          }
          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching document: ", error);
          setIsLoading(false);
        } finally {
          setIsLoading(false);
        }
      } else {
        console.log("No user is logged in");
        setIsLoading(false);
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
          Select Type
        </Text>
        <View style={{ height: 20, width: 20 }} />
      </View>
      <View style={styles.container}>
        {doctorData.clinicConsultation && (
          <Pressable
            style={styles.item}
            onPress={() => navigation.navigate("ClinicSlots")}
          >
            <Image
              source={require("../../assets/icons/clinic.png")}
              style={styles.icon}
            />
            <Text style={styles.itemText}>Clinic Appointment Slots</Text>
          </Pressable>
        )}
        {doctorData.virtualConsultation && (
          <>
            <Divider style={{ marginVertical: 2 }} />

            <Pressable
              style={styles.item}
              onPress={() => navigation.navigate("VirtualSlots")}
            >
              <Image
                source={require("../../assets/icons/video-cam.png")}
                style={styles.icon}
              />
              <Text style={styles.itemText}>Virtual Appointment Slots</Text>
            </Pressable>
          </>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkback,
    padding: 16,
  },
  icon: {
    height: 35,
    width: 35,
  },
  itemText: {
    color: colors.whitetext,
    fontWeight: "500",
    fontSize: 18,
    marginLeft: 25,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    // borderWidth: 1,
    paddingVertical: 12,
  },
});
