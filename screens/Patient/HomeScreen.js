import { useCallback, useMemo, useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  StatusBar,
  Dimensions,
  Image,
  Pressable,
  RefreshControl,
  LayoutAnimation,
  UIManager,
  Linking,
} from "react-native";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { useIsFocused } from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { SelectList } from "react-native-dropdown-select-list";
import { useBottomSheet } from "../../context/BottomSheetContext";
import Svg, { Path } from "react-native-svg";
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { format, parseISO, parse, compareAsc } from "date-fns";
import Toast from "react-native-toast-message";

import colors from "../../utils/colors";
import RightArrow from "../../assets/icons/RightArrow";
import LoadingOverlay from "../../components/LoadingOverlay";

const H_MAX_HEIGHT = 80;
const H_MIN_HEIGHT = 0;
const H_SCROLL_DISTANCE = H_MAX_HEIGHT - H_MIN_HEIGHT;
const tabheight = 65;

const { width, height } = Dimensions.get("window");

export default function HomeScreen({ navigation }) {
  const snapPoints = useMemo(() => ["25%", "50%", "75%", "86%"], []);
  const sheetref = useRef();
  const [location, setLocation] = useState("");
  const [userName, setUserName] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [healthTips, setHealthTips] = useState([]);

  const { toggleBottomSheet } = useBottomSheet();
  const isFocused = useIsFocused();
  const user = auth().currentUser;

  const scrollOffsetY = useRef(new Animated.Value(0)).current;
  const headerScrollHeight = scrollOffsetY.interpolate({
    inputRange: [0, H_SCROLL_DISTANCE],
    outputRange: [H_MAX_HEIGHT, H_MIN_HEIGHT],
    extrapolate: "clamp",
  });

  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  const fetchAppointments = async () => {
    try {
      const patientDoc = await firestore()
        .collection("users")
        .doc(user.uid)
        .get();

      const patientData = patientDoc.data();
      const patientName = `${patientData.firstname} ${patientData.lastname}`;
      setUserName(patientName);

      const appointmentsSnapshot = await firestore()
        .collection("appointments")
        .where("patientId", "==", user.uid)
        .where("status", "==", "booked")
        .get();

      let fetchedAppointments = appointmentsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

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

      const appointmentsWithDoctorData = await Promise.all(
        fetchedAppointments.map(async (appointment) => {
          const doctorDoc = await firestore()
            .collection("users")
            .doc(appointment.doctorId)
            .get();
          const doctorData = doctorDoc.data();
          const doctorName = `${doctorData.firstname} ${doctorData.lastname}`;
          const doctorPfp = doctorData.pfpUrl;

          const profileDoc = await firestore()
            .collection("profile")
            .doc(appointment.doctorId)
            .get();
          const profileData = profileDoc.data();

          return {
            ...appointment,
            doctorName,
            doctorPfp,
            profileData,
            patientName,
          };
        })
      );

      setAppointments(appointmentsWithDoctorData);
    } catch (error) {
      console.error("Error fetching appointments: ", error);
    }
  };

  const fetchBlogPosts = async () => {
    try {
      const blogPostsSnapshot = await firestore().collection("blogposts").get();
      const blogPosts = blogPostsSnapshot.docs.map((doc) => ({
        id: doc.id,
        title: doc.data().title,
        image: doc.data().image,
        link: doc.data().link,
      }));
      setHealthTips(blogPosts);
    } catch (error) {
      console.error("Error fetching blog posts: ", error);
    }
  };
  useEffect(() => {
    setIsLoading(true);
    fetchAppointments();
    fetchBlogPosts();
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isFocused) {
      console.log(
        "Home Screen is focused or returned to after navigating back"
      );
      toggleBottomSheet(false);
    }
  }, [isFocused]);

  useEffect(() => {
    console.log(appointments);
  }, [appointments]);

  const onRefresh = async () => {
    console.log("Refreshing");
    setRefreshing(true);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    fetchBlogPosts();
    await fetchAppointments();
    setRefreshing(false);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }],
    { useNativeDriver: false }
  );

  const options = [
    {
      title: "General practitioner",
      pricerange: "100₹ - 500₹",
      image: require("../../assets/general-practicionor.png"),
      to: "General Physician",
    },
    // {
    //   title: "Specialist",
    //   pricerange: "1000₹ - 5000₹",
    //   image: require("../../assets/specialist.png"),
    // },
    {
      title: "Mental Health",
      pricerange: "2000₹ - 5000₹",
      image: require("../../assets/mental-health.png"),
      to: "Psychiatrist",
    },
    {
      title: "Nutrition",
      pricerange: "1000₹ - 3000₹",
      image: require("../../assets/nutrition.png"),
      to: "Nutritionist ",
    },
  ];

  const data = [
    { key: "1", value: "Mumbai" },
    { key: "2", value: "Pune" },
    { key: "3", value: "Delhi" },
    { key: "4", value: "Bangalore" },
  ];

  function LocationIcon(props) {
    return (
      <Svg
        width={15}
        height={15}
        viewBox="0 0 15 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <Path
          d="M13.023.103L.842 5.725c-1.405.656-.937 2.718.562 2.718h5.154v5.153c0 1.5 2.061 1.968 2.717.562l5.622-12.18c.469-1.125-.75-2.344-1.874-1.875z"
          fill="#fff"
        />
      </Svg>
    );
  }

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

        {/* <Pressable
          onPress={openLocationSheet}
          style={({ pressed }) => [
            styles.locationBlock,
            pressed && { opacity: 0.8 },
          ]}
        >
          <LocationIcon />
          <Text style={styles.locationText}>
            {location === "" ? "Select city" : location}
          </Text>
        </Pressable> */}
      </View>
    );
  };

  const openLocationSheet = () => {
    sheetref.current?.snapToIndex(1);
  };

  const submitLocation = () => {
    sheetref.current?.close();
  };

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    []
  );

  return (
    <>
      <LoadingOverlay isVisible={isLoading} />
      <View style={styles.container}>
        <StatusBar backgroundColor={colors.lightaccent} />
        <ScrollView
          contentContainerStyle={[
            styles.scrollable,
            { paddingTop: 80, zIndex: 0 },
          ]}
          horizontal={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={true}
          onScroll={onScroll}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              progressBackgroundColor={colors.whitetext}
              progressViewOffset={100}
            />
          }
        >
          {refreshing && (
            <View style={{ alignItems: "center", padding: 10 }}>
              <Text style={{ color: colors.whitetext, fontWeight: "bold" }}>
                Refreshing...
              </Text>
            </View>
          )}
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  color: colors.whitetext,
                  fontSize: 20,
                  fontWeight: "bold",
                }}
              >
                Virtual consultation
              </Text>
              <RightArrow style={{ marginTop: 3 }} />
            </View>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              style={styles.virtualconsult}
            >
              {options.map((option, index) => (
                <Pressable
                  onPress={() => {
                    let send = option.to;
                    navigation.navigate("Appointment");

                    setTimeout(() => {
                      navigation.navigate("Appointment", {
                        screen: "Providers",
                        params: { send },
                      });
                    }, 10);
                  }}
                  key={index}
                  style={styles.card}
                >
                  <Image source={option.image} style={styles.cardimage} />
                  <Text style={styles.cardtitle}>{option.title}</Text>
                  <Text style={styles.pricerange}>{option.pricerange}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.cliniccard,
              pressed && { opacity: 0.8 },
            ]}
            onPress={() => {
              navigation.navigate("Appointment");

              setTimeout(() => {
                navigation.navigate("Appointment", {
                  screen: "Providers",
                  params: { send: "", clinic: true },
                });
              }, 10);
            }}
          >
            <View>
              <Text
                style={{
                  color: colors.blacktext,
                  fontSize: 20,
                  fontWeight: "bold",
                }}
              >
                Clinic visit
              </Text>
              <Text
                style={{
                  color: colors.blacktext,
                  fontSize: 14,
                  marginTop: 5,
                  // paddingRight: 110,
                  width: 220,
                }}
              >
                Make an appointment at the nearest clinic and visit accordingly.
                Get your diagnosis and other results later on your phone.
              </Text>
            </View>
            <View>
              <Image
                source={require("../../assets/clinic.png")}
                style={{ height: 75, width: 75, alignSelf: "center" }}
              />
            </View>
          </Pressable>

          <View style={{ marginTop: 10 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  color: colors.whitetext,
                  fontSize: 20,
                  fontWeight: "bold",
                }}
              >
                Upcoming appointments
              </Text>
            </View>
            <ScrollView
              horizontal={false}
              style={{
                flexDirection: "column",
                marginTop: 5,
                flexGrow: 1,
              }}
              contentContainerStyle={{ flexGrow: 1 }}
            >
              {appointments.length === 0 ? (
                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    paddingVertical: 10,
                    backgroundColor: colors.somewhatlightback,
                    borderRadius: 8,
                    paddingHorizontal: 10,
                  }}
                >
                  <Text
                    style={{
                      color: colors.whitetext,
                      fontWeight: "bold",
                      fontSize: 16,
                    }}
                  >
                    No upcoming appointments
                  </Text>
                  <Text
                    style={{
                      color: colors.lightgraytext,
                      fontWeight: "500",
                      fontSize: 14,
                      textAlign: "center",
                    }}
                  >
                    Schedule an appointment in the appointments tab
                  </Text>
                </View>
              ) : (
                appointments.map((appointment, index) => (
                  <Pressable
                    onPress={() =>
                      navigation.navigate("BookedDoctor", { appointment })
                    }
                    key={index}
                    style={styles.upcomingcard}
                  >
                    <Image
                      source={{ uri: appointment.doctorPfp }}
                      style={styles.image}
                    />
                    <View style={styles.infoContainer}>
                      <View style={styles.infoLeft}>
                        <Text style={styles.doctorName}>
                          {appointment.doctorName}
                        </Text>
                        <Text style={styles.specialization}>
                          {appointment.profileData.designation}
                        </Text>
                      </View>
                      <View style={styles.divider} />
                      <View style={styles.infoRight}>
                        <Text style={styles.date}>
                          {format(
                            parseISO(appointment.appointmentDate),
                            "EEEE, dd MMMM yyyy"
                          )}
                        </Text>
                        <Text style={styles.time}>{appointment.slotTime}</Text>
                        <Text style={styles.type}>
                          {appointment.appointmentType}
                        </Text>
                      </View>
                    </View>
                  </Pressable>
                ))
              )}
            </ScrollView>
          </View>

          <View style={{ marginTop: 10, marginBottom: 10 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 5,
              }}
            >
              <Text
                style={{
                  color: colors.whitetext,
                  fontSize: 20,
                  fontWeight: "bold",
                }}
              >
                Health tips
              </Text>
              <RightArrow style={{ marginTop: 3 }} />
            </View>
            <ScrollView
              horizontal={true}
              style={styles.scrollView}
              contentContainerStyle={styles.scrollViewContent}
            >
              {healthTips.map((tip, index) => (
                <Pressable
                  onPress={() => Linking.openURL(tip.link)}
                  key={index}
                  style={({ pressed }) => [
                    styles.tipCard,
                    pressed && { opacity: 0.8 },
                  ]}
                >
                  <Image source={{ uri: tip.image }} style={styles.tipimage} />
                  <Text
                    style={styles.tiptitle}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {tip.title}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </ScrollView>
        <Animated.View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            height: headerScrollHeight,
            width: "auto",
            overflow: "hidden",
            zIndex: 1,
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
        <BottomSheet
          ref={sheetref}
          style={[{ zIndex: 1000 }]}
          backgroundStyle={{ backgroundColor: colors.darkback }}
          index={-1}
          snapPoints={snapPoints}
          enablePanDownToClose
          handleIndicatorStyle={styles.indicatorstyle}
          backdropComponent={renderBackdrop}
        >
          <BottomSheetView style={styles.bottomsheetcontainer}>
            <Text
              style={{
                color: colors.whitetext,
                fontWeight: "bold",
                fontSize: 22,
                alignSelf: "center",
                marginTop: 16,
                marginBottom: 20,
              }}
            >
              Select your city
            </Text>

            <SelectList
              style={{}}
              setSelected={(loc) => setLocation(loc)}
              data={data}
              save="value"
              onSelect={submitLocation}
              searchPlaceholder="Select city"
              boxStyles={{
                borderColor: colors.blacktext,
                backgroundColor: colors.whitetext,
              }}
              dropdownStyles={{ backgroundColor: colors.whitetext }}
              dropdownTextStyles={{ fontSize: 16 }}
              imputStyles={{ fontWeight: "500" }}
            />
          </BottomSheetView>
        </BottomSheet>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    backgroundColor: colors.darkback,
    // alignItems: "center",
    justifyContent: "center",
    marginBottom: tabheight,
  },

  scrollable: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 10,
    marginTop: 10,
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
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  locationText: {
    color: colors.whitetext,
    fontSize: 14,
    fontWeight: "600",
  },
  headerContainer: {
    justifyContent: "center",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  titleContainer: {
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
  virtualconsult: {
    flexDirection: "row",
    marginBottom: 20,
    marginTop: 5,
  },

  card: {
    width: 160,
    height: 160,
    backgroundColor: colors.whitetext,
    borderRadius: 15,
    padding: 10,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },
  cardimage: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  cardtitle: {
    fontSize: 16,
    color: colors.blacktext,
    fontWeight: "bold",
    marginBottom: 1,
    textAlign: "center",
    // alignSelf: "center",
  },
  pricerange: {
    fontSize: 14,
    color: colors.darkgraytext,
  },

  cliniccard: {
    backgroundColor: colors.whitetext,
    height: "auto",
    borderRadius: 15,
    padding: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    elevation: 20,
  },

  //Upcoming appointments

  upcomingcard: {
    flexDirection: "row",
    backgroundColor: colors.whitetext,
    borderRadius: 10,
    padding: width * 0.025,
    marginBottom: height * 0.02,
    alignItems: "center",
    elevation: 5,
  },
  image: {
    width: width * 0.15,
    height: width * 0.15,
    marginRight: width * 0.03,
    borderRadius: 10,
  },
  infoContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoLeft: {
    flex: 1,
    // marginRight: 0,
    // marginTop: height * 0.01,
    alignSelf: "center",
  },
  doctorName: {
    fontSize: width * 0.045,
    fontWeight: "bold",
    textAlign: "left",
    width: width * 0.3,
  },
  specialization: {
    fontSize: width * 0.035,
    color: colors.darkgraytext,
    textAlign: "left",
    width: width * 0.3,
  },
  divider: {
    width: 1,
    height: height * 0.09,
    backgroundColor: colors.darkgraytext,
    marginHorizontal: 0,
    borderWidth: 1,
    alignSelf: "center",
    borderColor: colors.darkgraytext,
  },
  infoRight: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  date: {
    fontSize: width * 0.035,
    color: colors.darkgraytext,
    textAlign: "center",
  },
  time: {
    fontSize: width * 0.04,
    fontWeight: "bold",
    textAlign: "center",
  },
  type: {
    fontSize: width * 0.035,
    color: colors.darkgraytext,
    textAlign: "center",
  },

  tipCard: {
    backgroundColor: colors.whitetext,
    borderRadius: 10,
    marginRight: 10,
    elevation: 2,
    alignItems: "center",
    width: 250,
    height: "auto",
  },
  tipimage: {
    width: 250,
    height: 150,
    borderRadius: 10,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  tiptitle: {
    color: colors.blacktext,
    fontWeight: "bold",
    textAlign: "left",
    alignSelf: "flex-start",
    padding: 10,
    fontSize: 18,
  },

  bottomsheetcontainer: {
    flex: 1,
    // borderWidth: 1,
    paddingBottom: 60,
    backgroundColor: colors.darkback,
    paddingHorizontal: 16,
  },

  indicatorstyle: {
    backgroundColor: colors.whitetext,
  },
});
