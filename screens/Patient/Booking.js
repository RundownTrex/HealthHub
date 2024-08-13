import React from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { Avatar, Divider } from "react-native-paper";

import colors from "../../utils/colors";
import BackIcon from "../../assets/icons/BackIcon";

export default function Booking({ navigation, route }) {
  const { doctor, slotno, appointmentType, selectedDate } = route.params;

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
          Book {appointmentType} appointment
        </Text>
        <View style={{ height: 20, width: 20 }} />
      </View>
      <View style={styles.container}>
        {/* <Text
          style={{ color: colors.whitetext, fontSize: 20, fontWeight: "bold" }}
        >
          Book {appointmentType} appointment
        </Text>
        <Text
          style={{ color: colors.whitetext, fontSize: 20, fontWeight: "bold" }}
        >
          Slot: {slotno}
        </Text>
        <Text
          style={{ color: colors.whitetext, fontSize: 20, fontWeight: "bold" }}
        >
          Date: {selectedDate}
        </Text> */}

        <View style={styles.profileSection}>
          <View style={styles.avatarwrap}>
            <Avatar.Image source={doctor.image} size={100} />
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
            <Text style={styles.name}>{doctor.name}</Text>
            <Text
              style={{
                fontSize: 14,
                color: colors.whitetext,
                fontWeight: "bold",
              }}
            >
              {doctor.specialization}
            </Text>
          </View>
        </View>
        <Divider style={{ marginBottom: 10 }} />
        <View style={{ flexDirection: "row", gap: 10, padding: 5 }}>
          <Image
            source={require("../../assets/icons/calender.png")}
            style={{ width: 20, height: 20 }}
          />
          <Text style={{ color: colors.whitetext, fontSize: 14 }}>
            Appointment time
          </Text>
        </View>
        <Text
          style={{ color: colors.whitetext, fontWeight: "bold", fontSize: 18 }}
        >
          {selectedDate} {slotno}
        </Text>
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

  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
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
});
