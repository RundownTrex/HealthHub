import { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  BackHandler,
  Pressable,
  Image,
  ScrollView,
} from "react-native";
import { Divider } from "react-native-paper";

import colors from "../../utils/colors";
import BackIcon from "../../assets/icons/BackIcon";
import { useBottomSheet } from "../../context/BottomSheetContext";

export default function BookedDoctor({ navigation }) {
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
          <Image
            source={require("../../assets/doctor-pfp.jpg")}
            style={styles.pfp}
          />
          <View style={styles.vr} />
          <View style={styles.topinfo}>
            <Text style={[styles.infotext, { fontWeight: "bold" }]}>
              Dr. Sigma
            </Text>
            <Text style={{ fontSize: 16, color: colors.whitetext }}>
              General Physician
            </Text>
            <Text style={{ color: colors.whitetext, fontSize: 16 }}>
              10 years of experience
            </Text>
          </View>
        </View>
        <View style={styles.bottomContent}>
          <Text style={styles.label}>Virtual Appointment</Text>

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
                Fri, 14 Sep 6:15 PM
              </Text>
              <View
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
                Today
              </Text>
            </View>
          </View>

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
              Fit clinic
            </Text>
          </View>
          <View style={{ marginTop: 5, paddingHorizontal: 16 }}>
            <Text
              style={{
                color: colors.whitetext,
                fontSize: 14,
              }}
            >
              Mode of payment
            </Text>
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
                  ₹ 5000
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
                  ₹ 5000
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
        <Pressable
          style={styles.button}
          onPress={() => {
            console.log("Hello world");
          }}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </Pressable>
        {/* <Pressable
          style={styles.button}
          onPress={() => console.log("Hello world")}
        >
          <Text style={[styles.buttonText]}>Reschedule</Text>
        </Pressable> */}
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
});
