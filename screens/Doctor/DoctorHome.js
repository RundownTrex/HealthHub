import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  StatusBar,
  Image,
  Pressable,
  RefreshControl,
} from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import Svg, { Path } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { Divider } from "react-native-paper";

import colors from "../../utils/colors";
import LoadingOverlay from "../../components/LoadingOverlay";

const appointments = [
  {
    id: 1,
    time: "10:00 AM",
    with: "Consultation with John Doe",
    icon: require("../../assets/icons/video-cam.png"),
    type: "video",
  },
  {
    id: 2,
    time: "11:00 AM",
    with: "Consultation with Jane Smith",
    icon: require("../../assets/icons/video-cam.png"),
    type: "video",
  },
  {
    id: 3,
    time: "12:00 PM",
    with: "Consultation with Alice Brown",
    icon: require("../../assets/icons/clinic.png"),
    type: "clinic",
  },
  {
    id: 4,
    time: "1:00 PM",
    with: "Consultation with Bob White",
    icon: require("../../assets/icons/clinic.png"),
    type: "clinic",
  },
  {
    id: 5,
    time: "2:00 PM",
    with: "Consultation with Bob White",
    icon: require("../../assets/icons/clinic.png"),
    type: "clinic",
  },
  // {
  //   id: 6,
  //   time: "2:00 PM",
  //   with: "Consultation with Bob White",
  //   icon: require("../../assets/icons/clinic.png"),
  //   type: "clinic",
  // },
  // {
  //   id: 7,
  //   time: "2:00 PM",
  //   with: "Consultation with Bob White",
  //   icon: require("../../assets/icons/clinic.png"),
  //   type: "clinic",
  // },
  // {
  //   id: 8,
  //   time: "2:00 PM",
  //   with: "Consultation with Bob White",
  //   icon: require("../../assets/icons/clinic.png"),
  //   type: "clinic",
  // },
  // {
  //   id: 9,
  //   time: "2:00 PM",
  //   with: "Consultation with Bob White",
  //   icon: require("../../assets/icons/clinic.png"),
  //   type: "clinic",
  // },
];

const tips = [
  "Remember to take breaks between consultations.",
  "Keep your workspace organized for better efficiency.",
  "Stay updated with the latest medical guidelines.",
  "Ensure a calm, distraction-free environment during virtual consultations.",
  "Good lighting enhances virtual consultations with patients.",
  "Review patient records before each consultation for a personalized experience.",
  "Encourage your patients to ask questions during consultations.",
  "Stay hydrated and maintain good posture during long consultation sessions.",
  "Make sure your internet connection is stable before starting virtual consultations.",
  "Take a moment to relax and de-stress between back-to-back appointments.",
  "Document your notes right after consultations for better accuracy.",
  "Schedule time to follow up with patients on their progress.",
  "Keep your software and systems up-to-date to avoid technical issues.",
  "Engage with patients by making eye contact and active listening, even virtually.",
  "Prepare for the next day by reviewing your appointment schedule ahead of time.",
  "Balance virtual and in-person consultations to manage your workload effectively.",
  "Double-check appointment details to avoid any scheduling conflicts.",
  "Maintain a positive tone in virtual consultations to create a comfortable environment.",
  "Stay informed about telemedicine laws and regulations in your area.",
  "Take care of your mental health to provide the best care for your patients.",
  "Have backup plans for connectivity issues during virtual consultations.",
  "Remind patients to share their concerns openly during appointments.",
  "Create follow-up reminders for patients to ensure continuity of care.",
  "Maintain a healthy work-life balance to avoid burnout.",
];

const H_MAX_HEIGHT = 70;
const H_MIN_HEIGHT = 0;
const H_SCROLL_DISTANCE = H_MAX_HEIGHT - H_MIN_HEIGHT;
const tabheight = 65;

export default function DoctorHome({ navigation }) {
  const scrollOffsetY = useRef(new Animated.Value(0)).current;
  const headerScrollHeight = scrollOffsetY.interpolate({
    inputRange: [0, H_SCROLL_DISTANCE],
    outputRange: [H_MAX_HEIGHT, H_MIN_HEIGHT],
    extrapolate: "clamp",
  });

  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [randomTip, setRandomTip] = useState("");

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const getCurrentGreeting = () => {
    const currentHour = new Date().getHours();

    if (currentHour < 12) {
      return "Good morning";
    } else if (currentHour >= 12 && currentHour < 18) {
      return "Good afternoon";
    } else {
      return "Good evening";
    }
  };

  const CustomHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.greetingText}>{getCurrentGreeting()},</Text>
          <Text style={styles.nameText}>{userName}</Text>
        </View>
        {/* <View style={styles.locationBlock}>
          <LocationIcon />
          <Text style={styles.locationText}>Mumbai</Text>
        </View> */}
      </View>
    );
  };

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * tips.length);
    setRandomTip(tips[randomIndex]);

    const fetchUserProfile = async () => {
      const user = auth().currentUser;

      if (user) {
        const userDoc = await firestore()
          .collection("users")
          .doc(user.uid)
          .get();

        const data = userDoc.data();

        setUserName(data.firstname + " " + data.lastname);
      } else {
        console.log("No user is logged in");
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <>
      <LoadingOverlay isVisible={isLoading} />
      <View style={styles.container}>
        <StatusBar backgroundColor={colors.lightaccent} />

        <ScrollView
          contentContainerStyle={[styles.scrollable]}
          horizontal={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={true}
          // pagingEnabled={true}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={5}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              style={{ zIndex: 10 }}
            />
          }
        >
          <Animated.View
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              height: headerScrollHeight,
              width: "auto",
              overflow: "hidden",
              zIndex: 8,
              // STYLE
              // borderBottomColor: "#EFEFF4",
              // borderBottomWidth: 1,
              // padding: 10,
              backgroundColor: colors.lightaccent,
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
            }}
          >
            <CustomHeader />
          </Animated.View>
          <View
            style={{
              marginTop: H_MAX_HEIGHT + 10,
              flexDirection: "row",
              paddingVertical: 5,
              paddingHorizontal: 10,
              backgroundColor: colors.somewhatlightback,
              borderRadius: 10,
            }}
          >
            <Image
              source={require("../../assets/light-bulb.png")}
              style={{ height: 20, width: 20, marginRight: 3 }}
            />
            <Text
              style={{ fontSize: 16, color: colors.whitetext, width: "94%" }}
            >
              {randomTip}
            </Text>
          </View>
          <View style={[styles.topContainer, {}]}>
            <View style={styles.topcard}>
              <Text style={styles.topcardHeading}>9</Text>
              <Text style={styles.topcardSubtitle}>Appointments today</Text>
            </View>
            <View style={styles.topcard}>
              <Text style={styles.topcardHeading}>9</Text>
              <Text style={styles.topcardSubtitle}>New messages</Text>
            </View>
          </View>
          <View style={styles.topContainer}>
            <View style={styles.topcard}>
              <Text style={styles.topcardHeading}>2</Text>
              <Text style={styles.topcardSubtitle}>Virtual</Text>
            </View>
            <View style={styles.topcard}>
              <Text style={styles.topcardHeading}>3</Text>
              <Text style={styles.topcardSubtitle}>In-clinic</Text>
            </View>
          </View>

          <View style={styles.appointmentContainer}>
            <Text style={styles.heading}>Today's Schedule</Text>
            {appointments.map((appointment) => (
              <View key={appointment.id} style={styles.appointment}>
                <View style={{ flexDirection: "row" }}>
                  <View style={styles.iconBackground}>
                    <Image source={appointment.icon} style={styles.icon} />
                  </View>
                  <View style={styles.consulttext}>
                    <Text style={styles.time}>{appointment.time}</Text>
                    <Text style={styles.with}>{appointment.with}</Text>
                  </View>
                </View>
                <Ionicons
                  name={"arrow-forward-outline"}
                  size={24}
                  color={colors.whitetext}
                />
              </View>
            ))}
            <Pressable style={styles.viewallButton}>
              <Text style={styles.viewalltext}>View all</Text>
            </Pressable>
          </View>
          <Divider style={{ marginBottom: 10 }} />
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    height: "auto",
    backgroundColor: colors.darkback,
    // alignItems: "center",
    justifyContent: "center",
    marginBottom: tabheight,
  },

  scrollable: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 10,
    // marginTop: 10,
  },

  text: {
    color: colors.whitetext,
    fontSize: 20,
  },
  label: {
    fontSize: 14,
  },

  headstyle: {
    backgroundColor: colors.lightaccent,
    // height: ,
    // overflow: "hidden",
    // backgroundColor: "transparent",
  },

  locationBlock: {
    display: "flex",
    flexDirection: "row",
    gap: 6,
    marginRight: 16,
    // borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    // borderWidth: 1,
  },
  locationText: {
    color: colors.whitetext,
    fontSize: 14,
    fontWeight: "600",
  },
  headerContainer: {
    justifyContent: "center",
    // borderWidth: 1,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  titleContainer: {
    // borderWidth: 1,
    // width: "35%",
    display: "flex",
    alignContent: "center",
    justifyContent: "center",
    marginLeft: 16,
  },
  greetingText: {
    color: colors.whitetext,
    fontSize: 12,
  },

  nameText: {
    color: colors.whitetext,
    fontSize: 18,
    fontWeight: "bold",
  },

  topContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 10,
    marginTop: 10,
  },
  topcard: {
    backgroundColor: colors.complementary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: "center",
    flex: 1,
  },
  topcardHeading: {
    color: colors.whitetext,
    fontSize: 18,
    fontWeight: "bold",
  },
  topcardSubtitle: {
    color: colors.whitetext,
    fontSize: 14,
  },

  heading: {
    color: colors.whitetext,
    fontSize: 20,
    fontWeight: "bold",
  },

  appointmentContainer: {
    marginVertical: 16,
  },

  appointment: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },

  icon: {
    height: 24,
    width: 24,
  },
  iconBackground: {
    backgroundColor: colors.somewhatlightback,
    padding: 8,
    borderRadius: 10,
  },

  consulttext: {
    marginLeft: 10,
    justifyContent: "center",
  },

  time: {
    color: colors.whitetext,
    fontWeight: "bold",
    fontSize: 16,
  },
  with: {
    color: colors.whitetext,
    fontWeight: "400",
  },

  viewalltext: {
    color: colors.whitetext,
    fontSize: 18,
    alignSelf: "center",
  },

  viewallButton: {
    paddingVertical: 8,
    // alignSelf: "center",
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: colors.somewhatlightback,
    marginTop: 5,
  },
});
