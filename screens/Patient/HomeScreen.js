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
} from "react-native";
import auth from "@react-native-firebase/auth";

import colors from "../../utils/colors";
import RightArrow from "../../assets/icons/RightArrow";
import Svg, { Path } from "react-native-svg";
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import Button1 from "../../components/Button1";
import { SelectList } from "react-native-dropdown-select-list";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import Providers from "./Providers";

const H_MAX_HEIGHT = 80;
const H_MIN_HEIGHT = 0;
const H_SCROLL_DISTANCE = H_MAX_HEIGHT - H_MIN_HEIGHT;
const tabheight = 65;

export default function HomeScreen({ navigation }) {
  const snapPoints = useMemo(() => ["25%", "50%", "75%", "86%"], []);
  const sheetref = useRef();
  const [location, setLocation] = useState("");
  const [userName, setUserName] = useState("");

  const scrollOffsetY = useRef(new Animated.Value(0)).current;
  const headerScrollHeight = scrollOffsetY.interpolate({
    inputRange: [0, H_SCROLL_DISTANCE],
    outputRange: [H_MAX_HEIGHT, H_MIN_HEIGHT],
    extrapolate: "clamp",
  });

  useEffect(() => {
    const fetchUserProfile = () => {
      const user = auth().currentUser;

      if (user) {
        setUserName(user.displayName);
      } else {
        console.log("No user is logged in");
      }
    };

    fetchUserProfile();
  }, []);

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

  const appointments = [
    {
      doctorName: "Dr. Upul",
      specialization: "General Practitioner",
      image: require("../../assets/general-practicionor.png"), // Update with your image path
      date: "Sunday, July 15",
      time: "11:00 am",
      type: "Virtual appointment",
    },
    {
      doctorName: "Dr. Upul",
      specialization: "Dentist",
      image: require("../../assets/general-practicionor.png"), // Update with your image path
      date: "Monday, July 16",
      time: "1:30 pm",
      type: "In clinic appointment",
    },
    // {
    //   doctorName: "Dr. John Doe",
    //   specialization: "Nutritionist",
    //   image: require("../../assets/general-practicionor.png"), // Update with your image path
    //   date: "Monday, July 16",
    //   time: "1:30 pm",
    //   type: "In clinic appointment",
    // },
    // {
    //   doctorName: "Dr. John Doe",
    //   specialization: "Nutritionist",
    //   image: require("../../assets/general-practicionor.png"), // Update with your image path
    //   date: "Monday, July 16",
    //   time: "1:30 pm",
    //   type: "In clinic appointment",
    // },
  ];

  const healthTips = [
    {
      image: require("../../assets/tip1.png"),
      title: "Yoga for beginnners",
    },
    {
      image: require("../../assets/tip1.png"),
      title: "Healthy recipies for busy people",
    },
    {
      image: require("../../assets/tip1.png"),
      title:
        "TESTESTETSTttttttttttttttttttttttttttttttttttsssssssssssssssssssssssssssssssssssssssssssss",
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

  const CustomHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.greetingText}>Good morning,</Text>
          <Text style={styles.nameText}>{userName}</Text>
        </View>

        <Pressable
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
        </Pressable>
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
      <View style={styles.container}>
        <StatusBar backgroundColor={colors.lightaccent} />

        <ScrollView
          contentContainerStyle={[styles.scrollable, { paddingTop: 80 }]}
          horizontal={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={true}
          // pagingEnabled={true}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        >
          <View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
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
              <RightArrow style={{ marginTop: 3 }} />
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
              {appointments.map((appointment, index) => (
                <Pressable
                  onPress={() => console.log("Hello World!")}
                  key={index}
                  style={styles.upcomingcard}
                >
                  <Image source={appointment.image} style={styles.image} />
                  <View style={styles.infoContainer}>
                    <View style={styles.infoLeft}>
                      <Text style={styles.doctorName}>
                        {appointment.doctorName}
                      </Text>
                      <Text style={styles.specialization}>
                        {appointment.specialization}
                      </Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.infoRight}>
                      <Text style={styles.date}>{appointment.date}</Text>
                      <Text style={styles.time}>{appointment.time}</Text>
                      <Text style={styles.type}>{appointment.type}</Text>
                    </View>
                  </View>
                </Pressable>
              ))}
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
                  onPress={() => console.log("Health Tip Clicked!")}
                  key={index}
                  style={({ pressed }) => [
                    styles.tipCard,
                    pressed && { opacity: 0.8 },
                  ]}
                >
                  <Image source={tip.image} style={styles.tipimage} />
                  <Text
                    style={styles.tiptitle}
                    numberOfLines={1}
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

  //Upcoming assignments

  upcomingcard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    alignItems: "center",
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoLeft: {
    flex: 1,
    marginRight: 0,
    marginTop: 10,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "left",
    width: 80,
  },
  specialization: {
    fontSize: 14,
    color: colors.darkgraytext,
    textAlign: "left",
    width: 80,
  },
  divider: {
    width: 1,
    height: 70,
    backgroundColor: colors.darkgraytext,
    marginHorizontal: 0,
    borderWidth: 1,
    alignSelf: "center",
    borderColor: colors.darkgraytext,
  },
  infoRight: {
    flex: 1,
    alignItems: "center",
  },
  date: {
    fontSize: 14,
    color: colors.darkgraytext,
    textAlign: "center",
  },
  time: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  type: {
    fontSize: 14,
    color: colors.darkgraytext,
    textAlign: "center",
  },
  tipCard: {
    backgroundColor: colors.whitetext,
    borderRadius: 10,
    marginRight: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    alignItems: "center",
    width: 230,
    height: "auto",
  },
  tipimage: {
    width: 230,
    height: 130,
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
