import { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  BackHandler,
  Pressable,
  Image,
  ScrollView,
  Linking,
} from "react-native";
import { Divider } from "react-native-paper";
import { format, parseISO, parse, compareAsc } from "date-fns";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import call from "react-native-phone-call";

import colors from "../../utils/colors";
import BackIcon from "../../assets/icons/BackIcon";
import { useBottomSheet } from "../../context/BottomSheetContext";
import Button1 from "../../components/Button1";
import CustomAlert from "../../components/CustomAlert";
import LoadingOverlay from "../../components/LoadingOverlay";

export default function BookedDoctor({ navigation, route }) {
  const { appointment } = route.params;
  const [clinicLocation, setClinicLocation] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const mapRef = useRef(null);
  const user = auth().currentUser;

  useEffect(() => {
    console.log(appointment);
    setClinicLocation(appointment.profileData.cliniclocation);
  }, [appointment]);

  const updateAppointment = async (newStatus) => {
    setModalVisible(false);

    try {
      setIsLoading(true);

      const appointmentsRef = firestore().collection("appointments");

      const querySnapshot = await appointmentsRef
        .where("doctorId", "==", appointment.doctorId)
        .where("patientId", "==", user.uid)
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

  const handleOpenInMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${clinicLocation.latitude},${clinicLocation.longitude}`;
    Linking.openURL(url);
  };

  const handleRecenter = () => {
    mapRef.current.animateToRegion(
      {
        latitude: clinicLocation.latitude,
        longitude: clinicLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      1000
    );
  };

  const dialNumber = () => {
    const args = {
      number: appointment.profileData.phone,
      prompt: true,
      skipCanOpen: true,
    };

    call(args).catch((error) => {
      Toast.show({
        type: "error",
        text1: "Can't place a call right now",
        text2: error,
      });
    });
  };

  const { toggleBottomSheet } = useBottomSheet();

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
      <CustomAlert
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onConfirm={() => updateAppointment("Cancelled")}
      />
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
          Booked Appointment
        </Text>
        <View style={{ height: 20, width: 20 }} />
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.topcontainer}>
          <Image source={{ uri: appointment.doctorPfp }} style={styles.pfp} />
          <View style={styles.vr} />
          <View style={styles.topinfo}>
            <Text style={[styles.infotext, { fontWeight: "bold" }]}>
              {appointment.doctorName}
            </Text>
            <Text style={{ fontSize: 16, color: colors.whitetext }}>
              {appointment.profileData.designation}
            </Text>
            <Text style={{ color: colors.whitetext, fontSize: 16 }}>
              {appointment.profileData.yearsofexperience} years of experience
            </Text>
            <Pressable
              style={styles.chatButton}
              onPress={() => {
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
                            patientUnread: 0,
                          })
                          .then(() => {
                            console.log("Unread count reset for patient.");
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
                    doctorName: appointment.doctorName,
                    patientName: appointment.patientName,
                    userpfp: appointment.doctorPfp,
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

          {appointment.profileData.clinicConsultation && (
            <>
              <View style={{ marginTop: 10, paddingHorizontal: 16 }}>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    alignItems: "center",
                    marginBottom: 5,
                  }}
                >
                  <Image
                    source={require("../../assets/icons/clinic.png")}
                    style={{ width: 18, height: 18 }}
                  />
                  <Text
                    style={{
                      color: colors.whitetext,
                      fontSize: 14,
                    }}
                  >
                    Clinic address
                  </Text>
                </View>
                <Text
                  style={{
                    color: colors.whitetext,
                    fontWeight: "bold",
                    fontSize: 18,
                  }}
                >
                  {appointment.profileData.clinicName}
                </Text>
                <Text
                  style={{
                    color: colors.whitetext,
                    fontWeight: "500",
                    fontSize: 16,
                  }}
                >
                  {appointment.profileData.clinicCity}
                </Text>
                <Text
                  style={{
                    color: colors.whitetext,
                    fontWeight: "500",
                    fontSize: 16,
                  }}
                >
                  {appointment.profileData.clinicAddress}
                </Text>
              </View>
              <View
                style={{
                  marginTop: 10,
                  paddingHorizontal: 16,
                  marginBottom: 10,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    alignItems: "center",
                    marginBottom: 5,
                  }}
                >
                  <Image
                    source={require("../../assets/icons/clinic-location.png")}
                    style={{ width: 18, height: 18 }}
                  />
                  <Text
                    style={{
                      color: colors.whitetext,
                      fontSize: 14,
                    }}
                  >
                    Clinic location
                  </Text>
                </View>

                <View
                  style={{
                    borderRadius: 10,
                    overflow: "hidden",
                    marginBottom: 16,
                  }}
                >
                  <MapView
                    ref={mapRef}
                    style={{ width: "100%", height: 250 }}
                    provider={PROVIDER_GOOGLE}
                    region={
                      clinicLocation
                        ? {
                            latitude: clinicLocation.latitude,
                            longitude: clinicLocation.longitude,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                          }
                        : {
                            latitude: 18.94024498803612, // Default latitude
                            longitude: 72.83573143063485, // Default longitude
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                          }
                    }
                  >
                    <Marker
                      coordinate={{
                        latitude: clinicLocation.latitude,
                        longitude: clinicLocation.longitude,
                      }}
                      title="Clinic Location"
                      description={
                        appointment.profileData.clinicName +
                        ", " +
                        appointment.profileData.clinicCity
                      }
                    />
                  </MapView>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 5,
                  }}
                >
                  <Button1
                    text="Get Directions"
                    onPress={handleOpenInMaps}
                    style={{ flex: 3, height: 50 }}
                    textStyle={{ fontSize: 14 }}
                  />
                  <Pressable style={{ padding: 10 }} onPress={handleRecenter}>
                    <Image
                      source={require("../../assets/icons/recenter.png")}
                      style={{ width: 30, height: 30 }}
                    />
                  </Pressable>
                </View>
              </View>
            </>
          )}
          <View style={{ marginTop: 5, paddingHorizontal: 16 }}>
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
                marginVertical: 5,
              }}
            >
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
                Mode of Payment
              </Text>
            </View>
            <Text
              style={{
                color: colors.whitetext,
                fontWeight: "bold",
                fontSize: 18,
              }}
            >
              Online
            </Text>
          </View>
          <View style={[styles.bill]}>
            <Text style={styles.billHeading}>Bill details</Text>
            <View style={{ marginVertical: 10 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: colors.whitetext,
                    fontSize: 18,
                    fontWeight: "bold",
                  }}
                >
                  Consultation fee
                </Text>

                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 18,
                    color: colors.whitetext,
                  }}
                >
                  ₹ {appointment.consultFees}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginVertical: 15,
                }}
              >
                <Text
                  style={{
                    color: colors.whitetext,
                    fontSize: 18,
                    fontWeight: "bold",
                  }}
                >
                  Service fee and taxes
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 18,
                      color: colors.darkgraytext,
                      textDecorationLine: "line-through",
                    }}
                  >
                    ₹ 50
                  </Text>
                  <Text
                    style={{
                      color: colors.green,
                      fontSize: 17,
                      fontWeight: "500",
                    }}
                  >
                    FREE
                  </Text>
                </View>
              </View>
              <Divider
                style={{
                  marginBottom: 10,
                  backgroundColor: colors.tenpercent,
                }}
              />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    color: colors.whitetext,
                    fontWeight: "bold",
                    fontSize: 20,
                  }}
                >
                  Total payable
                </Text>

                <Text
                  style={{
                    color: colors.whitetext,
                    fontSize: 20,
                    fontWeight: "bold",
                  }}
                >
                  ₹ {appointment.consultFees}
                </Text>
              </View>
            </View>
          </View>

          <>
            <View
              style={{
                padding: 20,
                paddingTop: 15,
                paddingBottom: 0,
                gap: 5,
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <Image
                  source={require("../../assets/icons/alert.png")}
                  style={{ height: 17, width: 17 }}
                />
                <Text
                  style={{
                    color: colors.alert,
                    fontWeight: "bold",
                    fontSize: 18,
                  }}
                >
                  Cancellation policy
                </Text>
              </View>
              <Text style={[styles.itemText, { color: colors.alert }]}>
                <Text style={[styles.bullet, { color: colors.alert }]}>
                  {"\u2022  "}
                </Text>
                If you wish to cancel or reschedule the appointment, you can do
                it up to 2 hours before the appointment time
              </Text>
              <Text style={[styles.itemText, { color: colors.alert }]}>
                <Text style={[styles.bullet, { color: colors.alert }]}>
                  {"\u2022  "}
                </Text>
                You will be charged ₹ 50 cancellation fee if you cancel within 2
                hours of your appointment time or absent
              </Text>
            </View>
          </>
        </View>
      </ScrollView>
      <View style={styles.bottomPanel}>
        <Pressable style={styles.button} onPress={dialNumber}>
          <Text style={styles.buttonText}>Contact</Text>
        </Pressable>
        <Pressable
          style={[styles.button, { backgroundColor: colors.cancelled }]}
          onPress={() => {
            setModalVisible(true);
          }}
        >
          <Text style={styles.buttonText}>Cancel Appointment</Text>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.darkback,
    paddingBottom: 80,
  },
  pfp: {
    height: 100,
    width: 100,
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
    fontSize: 16,
    color: colors.tenpercent,
    paddingHorizontal: 16,
  },

  whitehead: {
    color: colors.whitetext,
    fontSize: 16,
    fontWeight: "500",
    marginTop: 5,
  },

  billHeading: {
    color: colors.whitetext,
    fontSize: 16,
    fontWeight: "500",
    alignSelf: "center",
  },
  bill: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: colors.somewhatlightback,
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
    fontWeight: "bold",
    textAlign: "center",
  },
  bullet: {
    fontSize: 20,
    marginRight: 8,
    color: colors.whitetext,
  },
  itemText: {
    fontSize: 16,
    color: colors.whitetext,
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
});
