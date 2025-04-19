import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  BackHandler,
  Pressable,
  Image,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useBottomSheet } from "../../context/BottomSheetContext";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { format, parse, compareAsc } from "date-fns";
import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Divider,
  IconButton,
  Tooltip,
} from "react-native-paper";

import colors from "../../utils/colors";
import BackIcon from "../../assets/icons/BackIcon";
import LoadingOverlay from "../../components/LoadingOverlay";

export default function AllAppointments({ navigation }) {
  const { toggleBottomSheet } = useBottomSheet();
  const [isLoading, setIsLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const user = auth().currentUser;

  const fetchAppointments = async () => {
    try {
      const appointmentsSnapshot = await firestore()
        .collection("appointments")
        .where("doctorId", "==", user.uid)
        .where("status", "==", "booked")
        .get();

      let fetchedAppointments = appointmentsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sort the appointments based on appointmentDate and slotTime
      fetchedAppointments = fetchedAppointments.sort((a, b) => {
        const dateTimeA = parse(
          `${a.appointmentDate} ${a.slotTime}`,
          "yyyy-MM-dd hh:mm a",
          new Date()
        );
        const dateTimeB = parse(
          `${b.appointmentDate} ${b.slotTime}`,
          "yyyy-MM-dd hh:mm a",
          new Date()
        );
        return compareAsc(dateTimeA, dateTimeB);
      });

      const appointmentsWithPatientNames = await Promise.all(
        fetchedAppointments.map(async (appointment) => {
          try {
            const patientDoc = await firestore()
              .collection("users")
              .doc(appointment.patientId)
              .get();

            if (patientDoc.exists && patientDoc.data()) {
              const patientData = patientDoc.data();
              const patientName = `${patientData.firstname || "Unknown"} ${
                patientData.lastname || "Patient"
              }`;
              const patientPfp = patientData.pfpUrl || null;

              return { ...appointment, patientName, patientPfp };
            } else {
              console.warn(
                `Patient document with ID ${appointment.patientId} does not exist or has no data.`
              );
              return {
                ...appointment,
                patientName: "Unknown Patient",
                patientPfp: null,
              };
            }
          } catch (error) {
            console.error(
              `Error fetching patient data for appointment ID ${appointment.id}: `,
              error
            );
            return {
              ...appointment,
              patientName: "Error fetching patient",
              patientPfp: null,
            };
          }
        })
      );

      setAppointments(appointmentsWithPatientNames);
    } catch (error) {
      console.error("Error fetching appointments: ", error);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchAppointments();
    setIsLoading(false);
  }, []);

  const onRefresh = async () => {
    setIsLoading(true);
    setRefreshing(true);
    await fetchAppointments();
    setRefreshing(false);
    setIsLoading(false);
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

  const groupByDate = (appointments) => {
    return appointments.reduce((grouped, appointment) => {
      const date = appointment.appointmentDate;
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(appointment);
      return grouped;
    }, {});
  };

  const groupedAppointments = groupByDate(appointments);

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
          All Appointments
        </Text>

        <Tooltip
          title="Pull the list to refresh the appointments"
          enterTouchDelay={0}
        >
          <Image
            source={require("../../assets/icons/info.png")}
            style={{ height: 25, width: 25 }}
          />
        </Tooltip>
      </View>

      {isLoading === true ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: colors.darkback,
          }}
        >
          {/* <ActivityIndicator size={"large"} color={colors.lightaccent} /> */}
        </View>
      ) : (
        <ScrollView
          style={styles.container}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {appointments.length > 0 ? (
            Object.keys(groupedAppointments).map((date) => (
              <View key={date}>
                <Text style={styles.dateHeader}>
                  {format(
                    parse(date, "yyyy-MM-dd", new Date()),
                    "MMMM dd, yyyy"
                  )}
                </Text>
                {groupedAppointments[date].map((appointment) => (
                  <Pressable
                    key={appointment.id}
                    style={styles.appointment}
                    onPress={() => {
                      console.log(appointment);
                      navigation.navigate("PatientProfile", {
                        appointment,
                      });
                    }}
                  >
                    <View style={{ flexDirection: "row" }}>
                      <View style={styles.iconBackground}>
                        <Image
                          source={
                            appointment.appointmentType === "Virtual"
                              ? require("../../assets/icons/video-cam.png")
                              : require("../../assets/icons/clinic.png")
                          }
                          style={styles.icon}
                        />
                      </View>
                      <View style={styles.consulttext}>
                        <Text style={styles.time}>{appointment.slotTime}</Text>
                        <Text style={styles.with}>
                          Consultation with {appointment.patientName}
                        </Text>
                      </View>
                    </View>
                    <Ionicons
                      name={"arrow-forward-outline"}
                      size={24}
                      color={colors.whitetext}
                    />
                  </Pressable>
                ))}
                <Divider style={{ marginVertical: 10 }} />
              </View>
            ))
          ) : (
            <View style={styles.noappointments}>
              <Text style={styles.noappointmentText}>No appointments</Text>
            </View>
          )}
        </ScrollView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: colors.darkback,
  },
  appointment: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  iconBackground: {
    backgroundColor: colors.somewhatlightback,
    padding: 8,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    height: 24,
    width: 24,
  },
  consulttext: {
    marginLeft: 10,
    justifyContent: "center",
  },
  time: {
    fontSize: 16,
    color: colors.whitetext,
    fontWeight: "bold",
  },
  with: {
    color: colors.whitetext,
    fontWeight: "400",
  },
  dateHeader: {
    fontSize: 18,
    color: colors.lightgraytext,
    fontWeight: "bold",
    marginTop: 10,
  },
  noappointments: {
    width: "100%",
    flex: 1,
    alignItems: "center",
    paddingVertical: 15,
    marginVertical: 15,
  },

  noappointmentText: {
    color: colors.whitetext,
    fontWeight: "bold",
    fontSize: 18,
  },
});
