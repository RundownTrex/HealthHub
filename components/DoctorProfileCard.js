import { useEffect, useRef } from "react";
import { View, Text, Image, StyleSheet, Animated, Easing } from "react-native";
import { Avatar, Button } from "react-native-paper";
import colors from "../utils/colors";
import { useNavigation } from "@react-navigation/native";

const DoctorProfileCard = ({ doctor }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.card}>
      <View style={styles.profileSection}>
        <View style={styles.avatarwrap}>
          <Avatar.Image source={doctor.image} size={90} />
          {doctor.virtualConsultation && (
            <View style={styles.cameraIcon}>
              <Image
                source={require("../assets/icons/video-cam.png")}
                style={styles.cameraImage}
              />
            </View>
          )}
        </View>
        <View style={styles.infoSection}>
          <Text style={styles.name}>{doctor.name}</Text>
          <Text style={styles.specialization}>{doctor.specialization}</Text>
          <Text style={styles.experience}>
            {doctor.experience} years of experience
          </Text>
          <Text style={styles.location}>
            {doctor.location} | {doctor.clinic}
          </Text>
          <Text style={styles.fee}>~₹{doctor.fee} consultation fees</Text>
        </View>
      </View>
      <Button
        mode="contained"
        style={styles.button}
        onPress={() => navigation.navigate("BookDoctor", { doctor })}
      >
        View profile
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "column",
    backgroundColor: colors.whitetext,
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 20,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
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
  infoSection: {
    marginLeft: 10,
    flex: 1,
  },
  name: {
    color: colors.blacktext,
    fontWeight: "bold",
    fontSize: 18,
  },
  specialization: {
    color: colors.blacktext,
    fontSize: 14,
  },
  experience: {
    color: colors.blacktext,
    fontSize: 14,
  },
  location: {
    color: colors.blacktext,
    fontSize: 14,
  },
  fee: {
    color: colors.blacktext,
    fontSize: 14,
  },
  button: {
    marginTop: 10,
    backgroundColor: colors.lightaccent,
  },
});

export default DoctorProfileCard;
