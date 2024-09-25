import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
} from "react-native";
import { Avatar, Divider, RadioButton } from "react-native-paper";
import {
  format,
  formatDistanceToNow,
  addDays,
  parseISO,
  parse,
} from "date-fns";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import Toast from "react-native-toast-message";

import colors from "../../utils/colors";
import BackIcon from "../../assets/icons/BackIcon";
import Button1 from "../../components/Button1";
import LoadingOverlay from "../../components/LoadingOverlay";

const items = [
  "Wearing a mask",
  "Temperature check at clinic",
  "Sanitization of visitors",
];

export default function Booking({ navigation, route }) {
  const { doctor, slotno, appointmentType, selectedDate } = route.params;
  const [paymentMethod, setPaymentMethod] = useState("Online");
  const [isLoading, setIsLoading] = useState(false);
  const user = auth().currentUser;

  // useEffect(() => {
  //   console.log(slotno);
  // }, [slotno]);

  const updateSlotStatus = async (date, time, type) => {
    try {
      console.log("Date: ", date);
      console.log("Time: ", time);
      console.log("Type: ", type);
      const slotRef = firestore()
        .collection("profile")
        .doc(doctor.id)
        .collection(type === "Clinic" ? "clinicSlots" : "virtualSlots")
        .doc(date);

      const docSnapshot = await slotRef.get();

      if (docSnapshot.exists) {
        const data = docSnapshot.data();
        const slots = data.slots;

        const slotIndex = slots.findIndex((slot) => slot.time === time);

        if (slotIndex !== -1) {
          slots[slotIndex].status = "booked";

          await slotRef.update({
            slots: slots,
          });

          console.log(`Slot at ${time} on ${date} updated to booked`);
        } else {
          console.log(`Slot with time ${time} not found on ${date}`);
        }
      } else {
        console.log(`Document for date ${date} does not exist`);
      }
    } catch (error) {
      console.error("Error updating slot status:", error);
    }
  };

  const createAppointment = async (appointmentData) => {
    try {
      setIsLoading(true);
      const appointmentsRef = firestore().collection("appointments");

      updateSlotStatus(selectedDate, slotno, appointmentType);

      const appointmentData = {
        doctorId: doctor.id,
        patientId: user.uid,
        appointmentDate: selectedDate,
        appointmentType: appointmentType,
        slotTime: slotno,
        status: "booked",
        paymentMethod,
        consultFees: doctor.profileData.consultFees,
        reminderSent: false,
      };

      await appointmentsRef.add({
        ...appointmentData,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      console.log(appointmentData);
      Toast.show({
        type: "success",
        text1: "Appointment booked successfully!",
      });
      console.log("Appointment created successfully!");
      setIsLoading(false);
      navigation.pop();
      navigation.pop();
      navigation.pop();
      navigation.pop();
      navigation.navigate("Home");
    } catch (error) {
      setIsLoading(false);
      Toast.show({
        type: "error",
        text1: "Appointment booking failed",
        text2: "Check if the slot is not booked!",
      });
      console.error("Error creating appointment:", error);
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
          Book {appointmentType} appointment
        </Text>
        <View style={{ height: 20, width: 20 }} />
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.profileSection}>
          <View style={styles.avatarwrap}>
            <Avatar.Image source={{ uri: doctor.pfpUrl }} size={90} />
            {doctor.virtualConsultation && (
              <View style={styles.cameraIcon}>
                <Image
                  source={require("../../assets/icons/video-cam.png")}
                  style={styles.cameraImage}
                />
              </View>
            )}
          </View>
          <View style={styles.textwrap}>
            <Text style={styles.name}>
              {`${doctor.firstname} ${doctor.lastname}`}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: colors.whitetext,
                fontWeight: "bold",
              }}
            >
              {doctor.profileData.designation}
            </Text>
          </View>
        </View>
        <Divider style={{ marginBottom: 10 }} />
        <View style={{ padding: 16, paddingBottom: 0 }}>
          <View style={{ flexDirection: "row", gap: 10, marginBottom: 5 }}>
            <Image
              source={require("../../assets/icons/calender.png")}
              style={{ width: 20, height: 20 }}
            />
            <Text
              style={{
                color: colors.whitetext,
                fontSize: 14,
                fontWeight: "500",
              }}
            >
              Appointment time
            </Text>
          </View>
          <View style={{ flexDirection: "column" }}>
            <Text
              style={{
                color: colors.whitetext,
                fontWeight: "bold",
                fontSize: 18,
              }}
            >
              {format(parseISO(selectedDate), "EEEE, dd MMMM yyyy")}
            </Text>
            <Text
              style={{
                color: colors.whitetext,
                fontWeight: "bold",
                fontSize: 18,
              }}
            >
              {slotno}
            </Text>
            {/* <View
              style={{
                height: "100%",
                width: 1,
                backgroundColor: colors.darkgraytext,
                marginHorizontal: 10,
              }}
            />
            <Text
              style={{
                color: colors.whitetext,
                fontSize: 14,
                alignSelf: "center",
              }}
            >
              {inx}
            </Text> */}
          </View>
        </View>
        {appointmentType === "Clinic" && (
          <View style={{ padding: 16, marginTop: 10, paddingBottom: 0 }}>
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
                  fontWeight: "500",
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
              {doctor.profileData.clinicAddress}
            </Text>
          </View>
        )}

        {appointmentType === "Clinic" ? (
          <>
            <View style={{ padding: 16, paddingBottom: 0 }}>
              <Text
                style={{
                  color: colors.whitetext,
                  fontSize: 18,
                  fontWeight: "bold",
                }}
              >
                Choose a mode of payment
              </Text>
              <View style={{ marginTop: 10 }}>
                <Pressable
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 8,
                  }}
                  onPress={() => setPaymentMethod("Online")}
                >
                  <RadioButton
                    value="online"
                    status={
                      paymentMethod === "Online" ? "checked" : "unchecked"
                    }
                    onPress={() => setPaymentMethod("Online")}
                    color={colors.lightaccent}
                    uncheckedColor={colors.darkgraytext}
                  />
                  <Text style={styles.radioText}>Online payment</Text>
                </Pressable>
                <Pressable
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 8,
                  }}
                  onPress={() => setPaymentMethod("Clinic")}
                >
                  <RadioButton
                    value="clinic"
                    status={
                      paymentMethod === "Clinic" ? "checked" : "unchecked"
                    }
                    onPress={() => setPaymentMethod("Clinic")}
                    color={colors.lightaccent}
                    uncheckedColor={colors.darkgraytext}
                  />
                  <Text style={styles.radioText}>In-clinic payment</Text>
                </Pressable>
              </View>
            </View>
          </>
        ) : (
          <>
            <View style={{ padding: 16, marginTop: 10, paddingBottom: 0 }}>
              <View
                style={{
                  flexDirection: "row",
                  gap: 10,
                  alignItems: "center",
                  marginBottom: 5,
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
                    fontWeight: "500",
                  }}
                >
                  Mode of Payment
                </Text>
              </View>
              <Pressable
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 8,
                }}
                onPress={() => setPaymentMethod("Online")}
              >
                <RadioButton
                  value="online"
                  status={paymentMethod === "Online" ? "checked" : "unchecked"}
                  onPress={() => setPaymentMethod("online")}
                  color={colors.lightaccent}
                  uncheckedColor={colors.darkgraytext}
                />
                <Text style={styles.radioText}>Online payment</Text>
              </Pressable>
            </View>
          </>
        )}
        <Divider style={{ marginTop: 15 }} />
        <View
          style={{
            padding: 20,
            paddingTop: 15,
            paddingBottom: 0,
            gap: 5,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
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
            If you wish to cancel or reschedule the appointment, you can do it
            up to 2 hours before the appointment time
          </Text>
          <Text style={[styles.itemText, { color: colors.alert }]}>
            <Text style={[styles.bullet, { color: colors.alert }]}>
              {"\u2022  "}
            </Text>
            You will be charged ₹ 50 cancellation fee is you cancel within 2
            hours of your appointment time or absent
          </Text>
        </View>
        <Divider style={{ marginVertical: 16, marginBottom: 0 }} />

        <View style={{ padding: 16, paddingBottom: 0 }}>
          <Text
            style={{ color: colors.whitetext, fontSize: 18, fontWeight: "400" }}
          >
            Bill details
          </Text>
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
                ₹ {doctor.profileData.consultFees}
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
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
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
              style={{ marginBottom: 10, backgroundColor: colors.tenpercent }}
            />
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
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
                ₹ {doctor.profileData.consultFees}
              </Text>
            </View>
          </View>
        </View>
        <Divider style={{ marginVertical: 5 }} />
        <View style={{ padding: 16 }}>
          <Text
            style={{
              color: colors.whitetext,
              fontSize: 20,
              fontWeight: "bold",
              marginBottom: 5,
            }}
          >
            Safety measures to be followed
          </Text>
          <View>
            {items.map((item, index) => (
              <View key={index} style={styles.listItem}>
                <Text style={styles.bullet}>{"\u2022"}</Text>
                <Text style={styles.itemText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>
        <Divider />
        <View style={{ padding: 16 }}>
          <Text style={{ color: colors.whitetext, fontSize: 13 }}>
            *By booking the appointment you agree to HealthHub's{" "}
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
        <View>
          <Button1
            text={"Book Appointment"}
            style={{ alignSelf: "center", marginBottom: 16 }}
            onPress={createAppointment}
          />
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: colors.darkback,
    // padding: 16,
  },

  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    // borderWidth: 1,
    marginBottom: 10,
  },

  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: colors.complementary,
    borderRadius: 20,
    padding: 7,
  },
  cameraImage: {
    width: 20,
    height: 20,
  },

  textwrap: {
    alignSelf: "flex-start",
    marginLeft: 18,
    marginTop: 5,
  },

  name: {
    fontSize: 18,
    color: colors.whitetext,
    fontWeight: "bold",
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 0,
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

  radioText: {
    color: colors.whitetext,
    fontSize: 16,
    fontWeight: "400",
    marginLeft: 10,
  },
});
