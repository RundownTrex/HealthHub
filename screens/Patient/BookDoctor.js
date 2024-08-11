import { useEffect, useState, useRef } from "react";
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
} from "react-native";
import { Avatar, Divider, SegmentedButtons } from "react-native-paper";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import colours from "../../utils/colors";
import BackIcon from "../../assets/icons/BackIcon";
import Button1 from "../../components/Button1";
import DropdownMenu from "../../components/DropdownMenu";

export default function BookDoctor({ navigation, route }) {
  const { doctor } = route.params;
  const [value, setValue] = useState(
    doctor.clinicAvailable ? "clinic" : "virtual"
  );

  const [expanded, setExpanded] = useState(false);

  const mapRef = useRef(null);

  const clinicLocation = {
    latitude: 18.94024498803612,
    longitude: 72.83573143063485,
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

  const buttons = [];
  if (doctor.clinicAvailable) {
    buttons.push({
      value: "clinic",
      label: "Clinic",
      checkedColor: colours.whitetext,
      uncheckedColor: colours.whitetext,
      labelStyle: {
        color: colours.whitetext,
        fontSize: 16,
      },
      style: [
        { borderRadius: 5 },
        {
          backgroundColor:
            value === "clinic" ? colours.complementary : colours.darkback,
        },
      ],
    });
  }

  if (doctor.virtualConsultation) {
    buttons.push({
      value: "virtual",
      label: "Virtual",
      checkedColor: colours.whitetext,
      uncheckedColor: colours.whitetext,
      labelStyle: {
        color: colours.whitetext,
        fontSize: 16,
      },
      style: [
        { borderRadius: 5 },
        {
          backgroundColor:
            value === "virtual" ? colours.complementary : colours.darkback,
        },
      ],
    });
  }

  const text = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.Donec vel quam sit amet leo scelerisque volutpat. Duis dictum orci vitae mi efficitur, et lacinia libero pharetra. Curabitur et odio arcu. Ut ac fringilla lectus, id tempor libero. Quisque ac mi ut tortor pretium elementum.`;

  return (
    <>
      <View
        style={{
          height: 60,
          backgroundColor: colours.lightaccent,
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
            color: colours.whitetext,
            fontWeight: "bold",
            fontSize: 18,
          }}
        >
          {doctor.name}
        </Text>
        <View style={{ height: 20, width: 20 }} />
      </View>
      <View style={styles.container}>
        <StatusBar backgroundColor={colours.lightaccent} />
        <ScrollView
          endFillColor={colours.darkback}
          stickyHeaderHiddenOnScroll={true}
          style={{ flex: 1, marginBottom: 70 }}
        >
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
              <Text style={{ fontSize: 15, color: colours.whitetext }}>
                {doctor.specialization}
              </Text>
              <Text style={{ color: colours.whitetext, fontSize: 14 }}>
                {doctor.degree}
              </Text>
              <Text style={{ color: colours.whitetext, fontSize: 14 }}>
                {doctor.experience} year(s) of experience
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
                    backgroundColor: colours.lightcomp,
                    borderTopLeftRadius: 5,
                    borderTopRightRadius: 5,
                    padding: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      color: colours.blacktext,
                      fontSize: 18,
                      fontWeight: "bold",
                    }}
                  >
                    In-clinic Appointment
                  </Text>
                  <Text
                    style={{
                      color: colours.blacktext,
                      fontSize: 18,
                      fontWeight: "bold",
                    }}
                  >
                    ₹{doctor.fee}
                  </Text>
                </View>

                <View style={{ padding: 10, paddingTop: 5 }}>
                  <Text style={{ fontWeight: "bold", fontSize: 20 }}>
                    {doctor.clinic}
                  </Text>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "400",
                      color: colours.blacktext,
                    }}
                  >
                    {doctor.location}
                  </Text>
                  <Divider style={{ marginVertical: 10, marginBottom: 0 }} />
                </View>
                <View style={{ alignSelf: "center" }}>
                  <Text
                    style={{
                      color: colours.blacktext,
                      fontWeight: "bold",
                      fontSize: 18,
                    }}
                  >
                    Today
                  </Text>
                </View>
                <View style={styles.slots}>
                  {[
                    "6:15 PM",
                    "6:15 PM",
                    "6:15 PM",
                    "6:15 PM",
                    "6:15 PM",
                    "6:15 PM",
                  ].map((slot, index) => (
                    <Pressable key={index} style={styles.slot}>
                      <Text style={styles.slotText}>{slot}</Text>
                    </Pressable>
                  ))}
                </View>
                <Pressable onPress={() => console.log("View all slots")}>
                  <Text style={styles.viewAllText}>View all slots</Text>
                </Pressable>
              </>
            ) : (
              <>
                <View
                  style={{
                    backgroundColor: colours.lightcomp,
                    borderTopLeftRadius: 5,
                    borderTopRightRadius: 5,
                    padding: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      color: colours.blacktext,
                      fontSize: 18,
                      fontWeight: "bold",
                    }}
                  >
                    Virtual consult
                  </Text>
                  <Text
                    style={{
                      color: colours.blacktext,
                      fontSize: 18,
                      fontWeight: "bold",
                    }}
                  >
                    ₹{doctor.fee}
                  </Text>
                </View>
                <View style={{ padding: 10, paddingTop: 5 }}>
                  <Text style={{ fontWeight: "bold", fontSize: 20 }}>
                    {doctor.clinic}
                  </Text>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "400",
                      color: colours.blacktext,
                    }}
                  >
                    {doctor.location}
                  </Text>
                  <Divider style={{ marginVertical: 10, marginBottom: 0 }} />
                </View>
                <View style={{ alignSelf: "center" }}>
                  <Text
                    style={{
                      color: colours.blacktext,
                      fontWeight: "bold",
                      fontSize: 18,
                    }}
                  >
                    Today
                  </Text>
                </View>
                <View style={styles.slots}>
                  {[
                    "6:15 PM",
                    "6:15 PM",
                    "6:15 PM",
                    "6:15 PM",
                    "6:15 PM",
                    "6:15 PM",
                  ].map((slot, index) => (
                    <Pressable key={index} style={styles.slot}>
                      <Text style={styles.slotText}>{slot}</Text>
                    </Pressable>
                  ))}
                </View>
                <Pressable onPress={() => console.log("View all slots")}>
                  <Text style={styles.viewAllText}>View all slots</Text>
                </Pressable>
              </>
            )}
          </View>
          <View style={{ marginTop: 16 }}>
            <Text
              style={{
                color: colours.whitetext,
                fontWeight: "bold",
                fontSize: 22,
              }}
            >
              Clinic details
            </Text>
            <View
              style={{
                padding: 10,
                backgroundColor: colours.whitetext,
                borderRadius: 5,
              }}
            >
              <Text>Fit Clinic</Text>
              <Text>Dadar</Text>
            </View>
          </View>
          <View style={{ marginTop: 16 }}>
            <Text
              style={{
                fontSize: 22,
                color: colours.whitetext,
                fontWeight: "bold",
                marginBottom: 5,
              }}
            >
              Location
            </Text>
            <MapView
              ref={mapRef}
              style={{ width: "100%", height: 250, marginBottom: 16 }}
              provider={PROVIDER_GOOGLE}
              // scrollEnabled={false}
              // zoomEnabled={false}
              // rotateEnabled={false}
              // pitchEnabled={false}
              initialRegion={{
                latitude: clinicLocation.latitude,
                longitude: clinicLocation.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker
                coordinate={clinicLocation}
                title="Clinic Location"
                description={doctor.clinic + ", " + doctor.location}
              />
            </MapView>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 5,
              }}
            >
              <Button1
                text="Get directions"
                onPress={handleOpenInMaps}
                style={{ flex: 3, height: 50 }}
              />
              <Pressable style={{ padding: 10 }} onPress={handleRecenter}>
                <Image
                  source={require("../../assets/icons/recenter.png")}
                  style={{ width: 30, height: 30 }}
                />
              </Pressable>
            </View>
          </View>
          <Divider style={{ marginVertical: 16 }} />
          <View style={{}}>
            <Text
              style={{
                color: colours.whitetext,
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
                  color: colours.whitetext,
                  fontWeight: "400",
                }}
                numberOfLines={expanded ? undefined : 3}
              >
                {expanded ? text : `${text.substring(0, 80)}... `}
                {!expanded && (
                  <Pressable onPress={() => setExpanded(true)}>
                    <Text style={{ fontSize: 16, color: colours.lightcomp }}>
                      Read more
                    </Text>
                  </Pressable>
                )}
              </Text>
              {expanded && (
                <Pressable onPress={() => setExpanded(false)}>
                  <Text style={{ fontSize: 16, color: colours.lightcomp }}>
                    Read less
                  </Text>
                </Pressable>
              )}
            </View>
          </View>
          <DropdownMenu
            title="Specializations"
            content="Hello world
          XD 
        Bruh 
        XD"
          />
          <Divider />
          <DropdownMenu
            title="Education"
            content="Hello world
          XD 
        Bruh 
        XD"
          />
          <Divider />

          <DropdownMenu
            title="Experience"
            content="Hello world
          XD 
        Bruh 
        XD"
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
                color: colours.whitetext,
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
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Book visit</Text>
        </Pressable>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Contact clinic</Text>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colours.darkback,
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
    backgroundColor: colours.complementary,
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
    color: colours.whitetext,
    fontWeight: "bold",
  },

  slotcontainer: {
    backgroundColor: colours.whitetext,
    width: "100%",
    height: "auto",
    borderRadius: 5,
    paddingBottom: 10,
  },

  slots: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginTop: 16,
  },
  slot: {
    backgroundColor: colours.complementary,
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    width: "30%",
    alignItems: "center",
  },

  slotText: {
    color: colours.whitetext,
    fontWeight: "600",
    textAlign: "center",
    fontSize: 15,
  },

  viewAllText: {
    color: colours.complementary,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 16,
    padding: 10,
  },

  bottomPanel: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: colours.darkback,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    gap: 8,
    alignItems: "center",
    justifyContent: "space-between",
    borderTopColor: colours.tenpercent,
    borderTopWidth: 1,
  },

  button: {
    backgroundColor: colours.lightaccent,
    paddingVertical: 12,
    borderRadius: 5,
    flex: 1,
  },

  buttonText: {
    color: colours.whitetext,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
