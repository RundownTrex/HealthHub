import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  BackHandler,
  Pressable,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import { Divider } from "react-native-paper";
import { format, parse, parseISO } from "date-fns";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

import colors from "../../utils/colors";
import BackIcon from "../../assets/icons/BackIcon";
import { useBottomSheet } from "../../context/BottomSheetContext";
import LoadingOverlay from "../../components/LoadingOverlay";
import Toast from "react-native-toast-message";
import CustomAlert from "../../components/CustomAlert";
import MarkAsCompletedModal from "../../components/MarkAsCompletedModal";

const smoking = [
  { label: "Never smoked", value: "never_smoked" },
  { label: "Former smoker (quit)", value: "former_smoker" },
  { label: "Social smoker", value: "social_smoker" },
  { label: "Occasional smoker", value: "occasional_smoker" },
  { label: "Light smoker (1-10 cigarettes per day)", value: "light_smoker" },
  {
    label: "Moderate smoker (11-20 cigarettes per day)",
    value: "moderate_smoker",
  },
  { label: "Heavy smoker (21+ cigarettes per day)", value: "heavy_smoker" },
  { label: "Vaper (uses e-cigarettes)", value: "vaper" },
  { label: "Cigar smoker", value: "cigar_smoker" },
  { label: "Pipe smoker", value: "pipe_smoker" },
  { label: "Chews tobacco", value: "chews_tobacco" },
];

const drinking = [
  { label: "Never drinks", value: "never_drinks" },
  { label: "Former drinker (quit)", value: "former_drinker" },
  { label: "Social drinker", value: "social_drinker" },
  { label: "Occasional drinker", value: "occasional_drinker" },
  { label: "Light drinker (1-2 drinks per week)", value: "light_drinker" },
  {
    label: "Moderate drinker (3-7 drinks per week)",
    value: "moderate_drinker",
  },
  { label: "Heavy drinker (8+ drinks per week)", value: "heavy_drinker" },
  {
    label: "Binge drinker (5+ drinks in a single occasion)",
    value: "binge_drinker",
  },
  { label: "Non-alcoholic beverages only", value: "non_alcoholic" },
];

const activity = [
  { label: "Sedentary (little or no exercise)", value: "sedentary" },
  {
    label: "Lightly active (light exercise 1-3 days a week)",
    value: "lightly_active",
  },
  {
    label: "Moderately active (moderate exercise 3-5 days a week)",
    value: "moderately_active",
  },
  {
    label: "Very active (hard exercise 6-7 days a week)",
    value: "very_active",
  },
  {
    label: "Extremely active (intense exercise every day)",
    value: "extremely_active",
  },
  {
    label: "Athlete/Competitive (training for competitions)",
    value: "athlete",
  },
];

const diet = [
  { label: "Omnivore (eats all types of food)", value: "omnivore" },
  { label: "Vegetarian (avoids meat and fish)", value: "vegetarian" },
  { label: "Vegan (avoids all animal products)", value: "vegan" },
  { label: "Pescatarian (avoids meat but eats fish)", value: "pescatarian" },
  {
    label: "Flexitarian (primarily vegetarian, but occasionally eats meat)",
    value: "flexitarian",
  },
  {
    label: "Paleo (focuses on whole foods, avoids grains and legumes)",
    value: "paleo",
  },
  { label: "Keto (high-fat, low-carb diet)", value: "keto" },
  {
    label: "Gluten-Free (avoids gluten-containing foods)",
    value: "gluten_free",
  },
  {
    label: "Lactose-Free (avoids dairy products with lactose)",
    value: "lactose_free",
  },
  { label: "Halal (permissible under Islamic law)", value: "halal" },
  { label: "Kosher (follows Jewish dietary laws)", value: "kosher" },
  { label: "Low Carb (reduces carbohydrate intake)", value: "low_carb" },
  { label: "Low Fat (reduces fat intake)", value: "low_fat" },
  {
    label: "Whole Foods (emphasizes minimally processed foods)",
    value: "whole_foods",
  },
  { label: "Organic (prefers organically grown foods)", value: "organic" },
];

const { height, width } = Dimensions.get("screen");

export default function PatientProfile({ navigation, route }) {
  const { appointment } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [complete, setComplete] = useState(false);

  const [healthProfile, setHealthProfile] = useState({
    age: "",
    gender: "",
    height: "",
    weight: "",
    maritalStatus: "",
    bloodGroup: "",
    allergies: "",
    injuries: "",
    chronicDiseases: "",
    pastIllnesses: "",
    currentMedications: "",
    pastMedications: "",
    previousSurgeries: "",
    emergencyContact: "",
    smokingHabits: "",
    drinkingHabits: "",
    activityLevel: "",
    foodPreference: "",
    occupation: "",
  });

  const { toggleBottomSheet } = useBottomSheet();
  const user = auth().currentUser;

  const getLabel = (value, data) => {
    const lab = data.find((item) => item.value === value);
    return lab ? lab.label : "Unknown";
  };

  const updateAppointment = async (newStatus) => {
    setModalVisible(false);

    try {
      setIsLoading(true);

      const appointmentsRef = firestore().collection("appointments");

      const querySnapshot = await appointmentsRef
        .where("doctorId", "==", user.uid)
        .where("patientId", "==", appointment.patientId)
        .where("appointmentDate", "==", appointment.appointmentDate)
        .where("appointmentType", "==", appointment.appointmentType)
        .where("slotTime", "==", appointment.slotTime)
        .get();

      if (!querySnapshot.empty) {
        querySnapshot.forEach(async (doc) => {
          await appointmentsRef.doc(doc.id).update({
            status: newStatus,
            updatedAt: firestore.FieldValue.serverTimestamp(),
          });

          Toast.show({
            type: "success",
            text1: `Appointment ${newStatus} successfully!`,
          });
        });
      } else {
        Toast.show({
          type: "error",
          text1: "No matching appointment found",
        });
      }
      setIsLoading(false);
      navigation.pop();
    } catch (error) {
      console.error("Error updating appointment status:", error);
      Toast.show({
        type: "error",
        text1: "Failed to update appointment status",
      });
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  //   const confirmCancellation = () => {
  //     Alert.alert(
  //       "Cancel Appointment",
  //       "Are you sure you want to cancel this appointment?",
  //       [
  //         { text: "Back", style: "cancel" },
  //         {
  //           text: "Cancel",
  //           onPress: cancelAppointment,
  //         },
  //       ],
  //       { cancelable: true }
  //     );
  //   };

  useEffect(() => {
    setIsLoading(true);
    const fetchUserProfile = async () => {
      if (appointment) {
        try {
          const profileDoc = await firestore()
            .collection("profile")
            .doc(appointment.patientId)
            .get();

          if (profileDoc.exists) {
            profileData = profileDoc.data();

            setHealthProfile(profileData);

            console.log("Profile data: ", profileData);
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
  }, [appointment]);

  useEffect(() => {
    console.log(appointment);
  }, [appointment]);

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
      <CustomAlert
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onConfirm={() => updateAppointment("Cancelled")}
      />

      <MarkAsCompletedModal
        visible={complete}
        onCancel={() => setComplete(false)}
        onConfirm={() => updateAppointment("Completed")}
      />
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
          Booked Appointment
        </Text>
        <View style={{ height: 20, width: 20 }} />
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.topcontainer}>
          <View style={{ borderRadius: 100, overflow: "hidden" }}>
            <Image
              source={{ uri: appointment.patientPfp }}
              style={styles.pfp}
            />
          </View>
          <View style={styles.vr} />
          <View style={styles.topinfo}>
            <Text style={[styles.infotext, { fontWeight: "bold" }]}>
              {appointment.patientName}
            </Text>
            <Pressable
              style={styles.chatButton}
              onPress={() => {
                navigation.pop();
                navigation.pop();
                navigation.navigate("Message");
                setTimeout(() => {
                  firestore()
                    .collection("recentChats")
                    .where("doctorId", "==", appointment.doctorId)
                    .where("patientId", "==", appointment.patientId)
                    .get()
                    .then((querySnapshot) => {
                      querySnapshot.forEach((doc) => {
                        firestore()
                          .collection("recentChats")
                          .doc(doc.id)
                          .update({
                            doctorUnread: 0,
                          })
                          .then(() => {
                            console.log("Unread count reset for doctor.");
                          })
                          .catch((error) => {
                            console.error(
                              "Error updating unread count: ",
                              error
                            );
                          });
                      });
                    })
                    .catch((error) => {
                      console.error("Error fetching recent chats: ", error);
                    });

                  navigation.navigate("DoctorChat", {
                    patientName: appointment.patientName,
                    doctorName: appointment.doctorName,
                    userpfp: appointment.patientPfp,
                    doctorId: appointment.doctorId,
                    patientId: appointment.patientId,
                  });
                }, 10);
              }}
            >
              <Image
                source={require("../../assets/icons/chat-now.png")}
                style={{ height: 20, width: 20 }}
              />
              <Text style={styles.chatbuttonText}>Chat now</Text>
            </Pressable>
          </View>
        </View>
        <Pressable
          style={styles.recordButton}
          onPress={() => {
            navigation.navigate("UploadMedicalRecord", { appointment });
          }}
        >
          <Text style={styles.recordButtonText}>Add a record</Text>
        </Pressable>
        <View style={styles.bottomContent}>
          <Text style={styles.label}>
            {appointment.appointmentType} Appointment
          </Text>

          <View style={{ marginTop: 5, paddingHorizontal: 16 }}>
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                marginBottom: 5,
              }}
            >
              <Image
                source={require("../../assets/icons/calender.png")}
                style={{ width: 20, height: 20 }}
              />
              <Text
                style={{
                  color: colors.whitetext,
                  fontSize: 14,
                }}
              >
                Appointment time
              </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  color: colors.whitetext,
                  fontWeight: "bold",
                  fontSize: 18,
                }}
              >
                {format(
                  parseISO(appointment.appointmentDate),
                  "EEEE, dd MMMM yyyy"
                )}
              </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  color: colors.whitetext,
                  fontWeight: "bold",
                  fontSize: 18,
                }}
              >
                {appointment.slotTime}
              </Text>
            </View>
          </View>

          <View
            style={{
              marginTop: 8,
              paddingHorizontal: 16,
            }}
          >
            <View style={{ flexDirection: "row", gap: 10, marginBottom: 5 }}>
              <Image
                source={require("../../assets/rupee.png")}
                style={{ width: 18, height: 18 }}
              />
              <Text
                style={{
                  color: colors.whitetext,
                  fontSize: 14,
                }}
              >
                Mode of payment
              </Text>
            </View>
            <Text
              style={{
                color: colors.whitetext,
                fontWeight: "bold",
                fontSize: 18,
              }}
            >
              {appointment.paymentMethod}
            </Text>
          </View>
        </View>
        <Divider style={{ marginTop: 15, marginBottom: 10 }} />
        <View style={{ marginVertical: 5 }}>
          <Text style={styles.label}>Height</Text>
          <Text style={styles.content}>{healthProfile.height}</Text>
        </View>
        <View style={{ marginVertical: 5 }}>
          <Text style={styles.label}>Weight</Text>
          <Text style={styles.content}>{healthProfile.weight} Kg</Text>
        </View>
        <View style={{ marginVertical: 5 }}>
          <Text style={styles.label}>Age</Text>
          <Text style={styles.content}>{healthProfile.age} years</Text>
        </View>
        <View style={{ marginVertical: 5 }}>
          <Text style={styles.label}>Gender at birth</Text>
          <Text style={styles.content}>{healthProfile.gender}</Text>
        </View>
        <View style={{ marginVertical: 5 }}>
          <Text style={styles.label}>Marital status</Text>
          <Text style={styles.content}>{healthProfile.maritalStatus}</Text>
        </View>
        <View style={{ marginVertical: 5 }}>
          <Text style={styles.label}>Blood group</Text>
          <Text style={styles.content}>{healthProfile.bloodGroup}</Text>
        </View>
        <View style={{ marginVertical: 5 }}>
          <Text style={styles.label}>Allergies</Text>
          <Text style={styles.content}>{healthProfile.allergies}</Text>
        </View>
        <View style={{ marginVertical: 5 }}>
          <Text style={styles.label}>Injuries</Text>
          <Text style={styles.content}>{healthProfile.injuries}</Text>
        </View>
        <View style={{ marginVertical: 5 }}>
          <Text style={styles.label}>Chronic diseases</Text>
          <Text style={styles.content}>{healthProfile.chronicDiseases}</Text>
        </View>
        <View style={{ marginVertical: 5 }}>
          <Text style={styles.label}>Past illnesses</Text>
          <Text style={styles.content}>{healthProfile.pastIllnesses}</Text>
        </View>
        <View style={{ marginVertical: 5 }}>
          <Text style={styles.label}>Current medications</Text>
          <Text style={styles.content}>{healthProfile.currentMedications}</Text>
        </View>
        <View style={{ marginVertical: 5 }}>
          <Text style={styles.label}>Past medications</Text>
          <Text style={styles.content}>{healthProfile.pastMedications}</Text>
        </View>
        <View style={{ marginVertical: 5 }}>
          <Text style={styles.label}>Previous surgeries</Text>
          <Text style={styles.content}>{healthProfile.previousSurgeries}</Text>
        </View>
        <View style={{ marginVertical: 5 }}>
          <Text style={styles.label}>Contact number</Text>
          <Text style={styles.content}>{healthProfile.emergencyContact}</Text>
        </View>
        <View style={{ marginVertical: 5 }}>
          <Text style={styles.label}>Smoking habits</Text>
          <Text style={styles.content}>
            {getLabel(healthProfile.smokingHabits, smoking)}
          </Text>
        </View>
        <View style={{ marginVertical: 5 }}>
          <Text style={styles.label}>Drinking habits</Text>
          <Text style={styles.content}>
            {getLabel(healthProfile.drinkingHabits, drinking)}
          </Text>
        </View>
        <View style={{ marginVertical: 5 }}>
          <Text style={styles.label}>Activity level</Text>
          <Text style={styles.content}>
            {getLabel(healthProfile.activityLevel, activity)}
          </Text>
        </View>
        <View style={{ marginVertical: 5 }}>
          <Text style={styles.label}>Food preference</Text>
          <Text style={styles.content}>
            {getLabel(healthProfile.foodPreference, diet)}
          </Text>
        </View>
        <View style={{ marginVertical: 5 }}>
          <Text style={styles.label}>Occupation</Text>
          <Text style={styles.content}>{healthProfile.occupation}</Text>
        </View>
      </ScrollView>
      <View style={styles.bottomPanel}>
        <Pressable
          style={[styles.button, { backgroundColor: colors.cancelled }]}
          onPress={() => {
            setModalVisible(true);
          }}
        >
          <Text style={[styles.buttonText]}>Cancel Appointment</Text>
        </Pressable>
        <Pressable
          style={[styles.button, { backgroundColor: colors.complementary }]}
          onPress={() => setComplete(true)}
        >
          <Text style={[styles.buttonText]}>Mark as Completed</Text>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.darkback,
    paddingBottom: height * 0.14,
  },
  pfp: {
    height: 90,
    width: 90,
    borderRadius: 100,
  },

  vr: {
    width: 4,
    backgroundColor: colors.somewhatlightback,
  },

  topcontainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 15,
    width: "100%",
    padding: 16,
    paddingBottom: 0,
  },
  topinfo: {
    justifyContent: "center",
    width: "65%",
  },
  infotext: {
    color: colors.whitetext,
    fontSize: 20,
    textAlign: "left",
  },
  bottomContent: {
    marginTop: 20,
  },

  label: {
    fontSize: 14,
    color: colors.tenpercent,
    paddingHorizontal: 16,
  },

  bottomPanel: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: colors.darkback,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    gap: 8,
    alignItems: "center",
    justifyContent: "space-between",
    borderTopColor: colors.tenpercent,
    borderTopWidth: 1,
    height: height * 0.12,
  },

  button: {
    backgroundColor: colors.lightaccent,
    paddingVertical: 10,
    borderRadius: 5,
    flex: 1,
  },

  buttonText: {
    color: colors.whitetext,
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },

  content: {
    color: colors.whitetext,
    fontSize: 16,
    fontWeight: "500",
    paddingHorizontal: 16,
  },
  chatButton: {
    marginTop: 10,
    flexDirection: "row",
    backgroundColor: colors.complementary,
    alignSelf: "flex-start",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: "center",
  },

  chatbuttonText: {
    color: colors.whitetext,
    fontWeight: "500",
    marginLeft: 5,
    fontSize: 16,
  },

  recordButton: {
    marginTop: 10,
    marginHorizontal: 16,
    backgroundColor: colors.complementary,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },

  recordButtonText: {
    color: colors.whitetext,
    fontWeight: "500",
    fontSize: 16,
  },
});
