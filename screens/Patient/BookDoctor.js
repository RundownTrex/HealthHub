import { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
  BackHandler,
  Linking,
  LayoutAnimation,
  UIManager,
} from "react-native";
import { Avatar, Divider, SegmentedButtons } from "react-native-paper";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import call from "react-native-phone-call";
import Toast from "react-native-toast-message";
import firestore from "@react-native-firebase/firestore";

import { format, isAfter, parse, set } from "date-fns";

import colors from "../../utils/colors";
import BackIcon from "../../assets/icons/BackIcon";
import Button1 from "../../components/Button1";
import DropdownMenu from "../../components/DropdownMenu";

if (UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const generateDate = () => {
  const date = new Date();
  date.setDate(date.getDate());
  return format(date, "EEE, dd MMM"); // Format the date as "Tue, 13 Aug"
};

export default function BookDoctor({ navigation, route }) {
  const { doctor } = route.params;
  const [value, setValue] = useState(
    doctor.profileData.clinicConsultation ? "clinic" : "virtual"
  );
  const mapRef = useRef(null);

  const [clinicLocation, setClinicLocation] = useState({});
  const [clinicSlots, setClinicSlots] = useState([]);
  const [virtualSlots, setVirtualSlots] = useState([]);

  const [expanded, setExpanded] = useState(false);

  //Expanding about text
  const toggleRead = useCallback(() => {
    const customAnimation = {
      duration: 200,
      update: {
        type: LayoutAnimation.Types.spring,
        springDamping: 1,
      },
    };

    LayoutAnimation.configureNext(customAnimation);
    setExpanded((prev) => !prev);
  }, []);

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

  useEffect(() => {
    const backAction = () => {
      navigation.pop();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [navigation]);

  const fetchClinicSlots = async (userId, date) => {
    try {
      const clinicSlotsDoc = await firestore()
        .collection("profile")
        .doc(userId)
        .collection("clinicSlots")
        .doc(date)
        .get();

      if (clinicSlotsDoc.exists) {
        const clinicData = clinicSlotsDoc.data();
        return clinicData.slots;
      } else {
        console.log("No clinic slots found for this date");
        return [];
      }
    } catch (error) {
      console.error("Error fetching clinic slots: ", error);
      return [];
    }
  };

  const fetchVirtualSlots = async (userId, date) => {
    try {
      const clinicSlotsDoc = await firestore()
        .collection("profile")
        .doc(userId)
        .collection("virtualSlots")
        .doc(date)
        .get();

      if (clinicSlotsDoc.exists) {
        const clinicData = clinicSlotsDoc.data();
        return clinicData.slots;
      } else {
        console.log("No clinic slots found for this date");
        return [];
      }
    } catch (error) {
      console.error("Error fetching clinic slots: ", error);
      return [];
    }
  };

  useEffect(() => {
    if (doctor.profileData.clinicConsultation === true) {
      setClinicLocation(
        doctor.profileData.cliniclocation
          ? JSON.parse(doctor.profileData.cliniclocation)
          : null
      );
      const loadClinicSlots = async () => {
        const fetchedSlots = await fetchClinicSlots(
          doctor.id,
          format(new Date(), "yyyy-MM-dd")
        );
        setClinicSlots(fetchedSlots);
      };

      loadClinicSlots();
    }

    if (doctor.profileData.virtualConsultation === true) {
      const loadVirtualSlots = async () => {
        const fetchedSlots = await fetchVirtualSlots(
          doctor.id,
          format(new Date(), "yyyy-MM-dd")
        );
        setVirtualSlots(fetchedSlots);
      };

      loadVirtualSlots();
    }

    console.log(format(new Date(), "yyyy-MM-dd"));
  }, []);

  useEffect(() => {
    console.log(virtualSlots);
  }, [virtualSlots]);

  const buttons = [];
  if (doctor.profileData.clinicConsultation) {
    buttons.push({
      value: "clinic",
      label: "Clinic",
      checkedColor: colors.whitetext,
      uncheckedColor: colors.whitetext,
      labelStyle: {
        color: colors.whitetext,
        fontSize: 16,
      },
      style: [
        { borderRadius: 5 },
        {
          backgroundColor:
            value === "clinic" ? colors.complementary : colors.darkback,
        },
      ],
    });
  }

  if (doctor.profileData.virtualConsultation) {
    buttons.push({
      value: "virtual",
      label: "Virtual",
      checkedColor: colors.whitetext,
      uncheckedColor: colors.whitetext,
      labelStyle: {
        color: colors.whitetext,
        fontSize: 16,
      },
      style: [
        { borderRadius: 5 },
        {
          backgroundColor:
            value === "virtual" ? colors.complementary : colors.darkback,
        },
      ],
    });
  }

  const dialNumber = () => {
    const args = {
      number: doctor.profileData.phone,
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

  const about = doctor.profileData.about || "Not set by the doctor";

  const SlotComponent = ({ slots }) => {
    const currentTime = new Date();

    const filteredSlots = slots
      .filter((slot) => {
        if (slot.status !== "not booked") return false;

        let slotTime = parse(slot.time, "hh:mm a", new Date());

        // Set the same year, month, and day as the current date to make the comparison
        slotTime = set(new Date(), {
          hours: slotTime.getHours(),
          minutes: slotTime.getMinutes(),
        });

        return isAfter(slotTime, currentTime);
      })
      .slice(0, 6);

    return (
      <View style={styles.slots}>
        {filteredSlots.length > 0 ? (
          filteredSlots.map((slot, index) => (
            <Pressable key={index} style={styles.slot}>
              <Text style={styles.slotText}>{slot.time}</Text>
            </Pressable>
          ))
        ) : (
          <View style={{ width: "100%" }}>
            <View
              style={{
                alignSelf: "center",
                width: "100%",
                marginTop: 5,
                marginBottom: 10,
              }}
            >
              <Text style={styles.noSlots}>No available slots for today</Text>
              <Text style={styles.noSlotsDesc}>
                Contact the clinic/doctor for further enquiry
              </Text>
            </View>

            <Pressable
              style={[
                styles.button,
                {
                  width: "50%",
                  alignSelf: "center",
                  flexDirection: "row",
                  justifyContent: "space-around",
                  alignItems: "center",
                },
              ]}
              onPress={dialNumber}
            >
              <Image
                source={require("../../assets/icons/phone.png")}
                style={{
                  height: 20,
                  width: 20,
                  alignSelf: "flex-end",
                  marginLeft: 5,
                }}
              />
              <Text style={[styles.buttonText, { marginRight: 5 }]}>
                Contact clinic
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    );
  };

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
          {`${doctor.firstname} ${doctor.lastname}`}
        </Text>
        <View style={{ height: 20, width: 20 }} />
      </View>
      <View style={styles.container}>
        <StatusBar backgroundColor={colors.lightaccent} />
        <ScrollView
          endFillColor={colors.darkback}
          stickyHeaderHiddenOnScroll={true}
          style={{ flex: 1, marginBottom: 70 }}
        >
          <View style={styles.profileSection}>
            <View style={styles.avatarwrap}>
              <Avatar.Image source={{ uri: doctor.pfpUrl }} size={100} />
              {doctor.profileData.virtualConsultation && (
                <View style={styles.cameraIcon}>
                  <Image
                    source={require("../../assets/icons/video-cam.png")}
                    style={styles.cameraImage}
                  />
                </View>
              )}
            </View>
            <View style={styles.textwrap}>
              <Text
                style={styles.name}
              >{`${doctor.firstname} ${doctor.lastname}`}</Text>
              <Text style={{ fontSize: 15, color: colors.whitetext }}>
                {doctor.profileData.designation}
              </Text>
              <Text style={{ color: colors.whitetext, fontSize: 14 }}>
                {doctor.profileData.education}
              </Text>
              <Text style={{ color: colors.whitetext, fontSize: 14 }}>
                {doctor.profileData.yearsofexperience} year(s) of experience
              </Text>
            </View>
          </View>
          <Divider style={{ marginBottom: 10 }} />
          <SegmentedButtons
            value={value}
            onValueChange={setValue}
            style={{ marginBottom: 20 }}
            buttons={buttons}
            density="regular"
          />

          <View style={styles.slotcontainer}>
            {value === "clinic" ? (
              <>
                <View
                  style={{
                    backgroundColor: colors.lightcomp,
                    borderTopLeftRadius: 5,
                    borderTopRightRadius: 5,
                    padding: 16,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      color: colors.blacktext,
                      fontSize: 18,
                      fontWeight: "bold",
                    }}
                  >
                    Clinic Appointment
                  </Text>
                  <Text
                    style={{
                      color: colors.blacktext,
                      fontSize: 18,
                      fontWeight: "bold",
                    }}
                  >
                    ₹{doctor.profileData.consultFees}
                  </Text>
                </View>

                <View style={{ padding: 10, paddingTop: 5 }}>
                  <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                    {doctor.profileData.clinicName}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "400",
                      color: colors.blacktext,
                    }}
                  >
                    {doctor.profileData.clinicCity}
                  </Text>
                  <Divider style={{ marginVertical: 10, marginBottom: 0 }} />
                </View>
                <View style={{ alignSelf: "center" }}>
                  <Text
                    style={{
                      color: colors.blacktext,
                      fontWeight: "bold",
                      fontSize: 18,
                    }}
                  >
                    Today
                  </Text>
                </View>
                {/* <View style={styles.slots}>
                  {[
                    "6:15 PM",
                    "6:15 PM",
                    "6:15 PM",
                    "6:15 PM",
                    "6:15 PM",
                    "6:15 PM",
                  ].map((slot, index) => (
                    <Pressable
                      key={index}
                      style={styles.slot}
                      onPress={() =>
                        navigation.navigate("Booking", {
                          doctor,
                          slotno: slot,
                          selectedDate: generateDate(),
                          appointmentType: "Clinic",
                        })
                      }
                    >
                      <Text style={styles.slotText}>{slot}</Text>
                    </Pressable>
                  ))}
                </View> */}

                <SlotComponent slots={clinicSlots} />

                <Pressable
                  onPress={() =>
                    navigation.navigate("Slots", {
                      doctor,
                      appointmentType: "Clinic",
                    })
                  }
                >
                  <Text style={styles.viewAllText}>View all slots</Text>
                </Pressable>
              </>
            ) : (
              <>
                <View
                  style={{
                    backgroundColor: colors.lightcomp,
                    borderTopLeftRadius: 5,
                    borderTopRightRadius: 5,
                    padding: 16,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      color: colors.blacktext,
                      fontSize: 18,
                      fontWeight: "bold",
                    }}
                  >
                    Virtual consult
                  </Text>
                  <Text
                    style={{
                      color: colors.blacktext,
                      fontSize: 18,
                      fontWeight: "bold",
                    }}
                  >
                    ₹{doctor.profileData.consultFees}
                  </Text>
                </View>
                <View style={{ padding: 10, paddingTop: 5 }}>
                  {doctor.profileData.clinicConsultation && (
                    <>
                      <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                        {doctor.profileData.clinicName}
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "400",
                          color: colors.blacktext,
                        }}
                      >
                        {doctor.profileData.clinicCity}
                      </Text>
                    </>
                  )}
                  <Divider style={{ marginVertical: 10, marginBottom: 0 }} />
                </View>
                <View style={{ alignSelf: "center" }}>
                  <Text
                    style={{
                      color: colors.blacktext,
                      fontWeight: "bold",
                      fontSize: 18,
                    }}
                  >
                    Today
                  </Text>
                </View>
                <SlotComponent slots={virtualSlots} />
                <Pressable
                  onPress={() =>
                    navigation.navigate("Slots", {
                      doctor,
                      appointmentType: "Virtual",
                    })
                  }
                >
                  <Text style={styles.viewAllText}>View all slots</Text>
                </Pressable>
              </>
            )}
          </View>
          {doctor.profileData.clinicConsultation && (
            <>
              <View style={{ marginTop: 16 }}>
                <Text
                  style={{
                    color: colors.whitetext,
                    fontWeight: "bold",
                    fontSize: 22,
                  }}
                >
                  Clinic details
                </Text>
                <View
                  style={{
                    padding: 10,
                    backgroundColor: colors.whitetext,
                    borderRadius: 5,
                  }}
                >
                  <Text style={styles.clinicName}>
                    {doctor.profileData.clinicName}
                  </Text>
                  <Text style={styles.clinicCity}>
                    {doctor.profileData.clinicCity}
                  </Text>
                  <Text style={styles.clinicAddress}>
                    {doctor.profileData.clinicAddress}
                  </Text>
                </View>
              </View>
              <View style={{ marginTop: 16 }}>
                <Text
                  style={{
                    fontSize: 22,
                    color: colors.whitetext,
                    fontWeight: "bold",
                    marginBottom: 5,
                  }}
                >
                  Location
                </Text>

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
                      coordinate={clinicLocation}
                      title="Clinic Location"
                      description={doctor.clinic + ", " + doctor.location}
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

          <Divider style={{ marginVertical: 16 }} />
          <View style={{}}>
            <Text
              style={{
                color: colors.whitetext,
                fontSize: 22,
                fontWeight: "bold",
              }}
            >
              More about {doctor.name}
            </Text>
            <View style={{ marginTop: 5 }}>
              <Text
                style={{
                  fontSize: 16,
                  color: colors.whitetext,
                  fontWeight: "400",
                }}
                numberOfLines={expanded ? undefined : 3}
              >
                {expanded ? about : `${about.substring(0, 100)}... `}
              </Text>

              {!expanded && (
                <Pressable onPress={toggleRead}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: colors.lightcomp,
                      marginTop: 5,
                    }}
                  >
                    Read more
                  </Text>
                </Pressable>
              )}

              {expanded && (
                <Pressable onPress={toggleRead}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: colors.lightcomp,
                      marginTop: 5,
                    }}
                  >
                    Read less
                  </Text>
                </Pressable>
              )}
            </View>
          </View>
          <DropdownMenu
            title="Specializations"
            content={
              doctor.profileData.specializations || "Not set by the doctor"
            }
          />
          <Divider />
          <DropdownMenu
            title="Education"
            content={doctor.profileData.education || "Not set by the doctor"}
          />
          <Divider />

          <DropdownMenu
            title="Experience"
            content={
              doctor.profileData.workexperience || "Not set by the doctor"
            }
          />
          <Divider />
          <Pressable
            style={{
              alignSelf: "center",
              flexDirection: "row",
              marginTop: 16,
              backgroundColor: "red",
              alignItems: "center",
              padding: 10,
              borderRadius: 8,
              justifyContent: "space-between",
              width: "100%",
              marginBottom: 10,
            }}
          >
            <Text
              style={{
                color: colors.whitetext,
                fontSize: 18,
                fontWeight: "bold",
                paddingLeft: 10,
                textAlign: "center",
              }}
            >
              Report
            </Text>
            <Image
              source={require("../../assets/flag.png")}
              style={{ width: 30, height: 30 }}
            />
          </Pressable>
        </ScrollView>
      </View>
      <View style={styles.bottomPanel}>
        <Pressable
          style={styles.button}
          onPress={() => {
            const appointmentType =
              doctor.profileData.virtualConsultation &&
              !doctor.profileData.clinicConsultation
                ? "Virtual"
                : "Clinic";

            navigation.navigate("Slots", { doctor, appointmentType });
          }}
        >
          <Text style={styles.buttonText}>
            {doctor.profileData.clinicConsultation
              ? "Book visit"
              : doctor.profileData.virtualConsultation
              ? "Book video consult"
              : ""}
          </Text>
        </Pressable>
        <Pressable style={styles.button} onPress={dialNumber}>
          <Text style={styles.buttonText}>Contact clinic</Text>
        </Pressable>
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
    marginLeft: 16,
    marginTop: 5,
  },

  name: {
    fontSize: 20,
    color: colors.whitetext,
    fontWeight: "bold",
  },

  slotcontainer: {
    backgroundColor: colors.whitetext,
    width: "100%",
    height: "auto",
    borderRadius: 5,
    paddingBottom: 10,
  },

  slots: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 10,
  },
  slot: {
    backgroundColor: colors.complementary,
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    width: "30%",
    alignItems: "center",
  },

  slotText: {
    color: colors.whitetext,
    fontWeight: "600",
    textAlign: "center",
    fontSize: 15,
  },

  viewAllText: {
    color: colors.complementary,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 16,
    padding: 10,
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
    paddingVertical: 12,
    borderRadius: 5,
    flex: 1,
  },

  buttonText: {
    color: colors.whitetext,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },

  clinicName: {
    color: colors.blacktext,
    fontWeight: "bold",
    fontSize: 18,
  },

  clinicCity: {
    fontSize: 16,
    fontWeight: "500",
  },

  clinicAddress: {
    color: colors.blacktext,
    fontSize: 15,
  },

  noSlots: {
    color: colors.blacktext,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    width: "100%",
  },

  noSlotsDesc: {
    alignSelf: "center",
    width: "100%",
    textAlign: "center",
    fontWeight: "600",
    color: colors.darkgraytext,
  },
});
