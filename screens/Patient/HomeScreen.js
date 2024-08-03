import React, { useEffect, useRef } from "react";
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
import colors from "../../utils/colors";
import RightArrow from "../../assets/icons/RightArrow";
import Svg, { Path } from "react-native-svg";

const H_MAX_HEIGHT = 80;
const H_MIN_HEIGHT = 0;
const H_SCROLL_DISTANCE = H_MAX_HEIGHT - H_MIN_HEIGHT;

export default function HomeScreen() {
  const scrollOffsetY = useRef(new Animated.Value(0)).current;
  const headerScrollHeight = scrollOffsetY.interpolate({
    inputRange: [0, H_SCROLL_DISTANCE],
    outputRange: [H_MAX_HEIGHT, H_MIN_HEIGHT],
    extrapolate: "clamp",
  });

  const options = [
    {
      title: "General practitioner",
      pricerange: "100₹ - 500₹",
      image: require("../../assets/general-practicionor.png"),
    },
    {
      title: "Specialist",
      pricerange: "1000₹ - 5000₹",
      image: require("../../assets/specialist.png"),
    },
    {
      title: "Mental Health",
      pricerange: "2000₹ - 5000₹",
      image: require("../../assets/mental-health.png"),
    },
    {
      title: "Nutrition",
      pricerange: "1000₹ - 3000₹",
      image: require("../../assets/nutrition.png"),
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
          <Text style={styles.nameText}>John Doe</Text>
        </View>
        <View style={styles.locationBlock}>
          <LocationIcon />
          <Text style={styles.locationText}>Mumbai</Text>
        </View>
      </View>
    );
  };

  return (
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
            <RightArrow />
          </View>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={styles.virtualconsult}
          >
            {options.map((option, index) => (
              <View key={index} style={styles.card}>
                <Image source={option.image} style={styles.cardimage} />
                <Text style={styles.cardtitle}>{option.title}</Text>
                <Text style={styles.pricerange}>{option.pricerange}</Text>
              </View>
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
            style={{ flexDirection: "row", justifyContent: "space-between" }}
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
            <RightArrow />
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

        <View style={{ marginTop: 10 }}>
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
              Health tips
            </Text>
            <RightArrow />
          </View>
        </View>

        <Text style={styles.text}>Home screen</Text>
        <Text style={styles.text}>Home screen</Text>
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
          zIndex: 999,
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "auto",
    backgroundColor: colors.darkback,
    // alignItems: "center",
    justifyContent: "center",
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
  virtualconsult: {
    flexDirection: "row",
    marginBottom: 20,
    marginTop: 5,
  },

  card: {
    width: Dimensions.get("window").width * 0.45,
    backgroundColor: colors.whitetext,
    borderRadius: 15,
    padding: 10,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },
  cardimage: {
    width: 70,
    height: 70,
    marginBottom: 10,
  },
  cardtitle: {
    fontSize: 17,
    color: colors.blacktext,
    fontWeight: "bold",
    marginBottom: 1,
    textAlign: "center",
    // alignSelf: "center",
  },
  pricerange: {
    fontSize: 15,
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
    // borderWidth: 1,
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
});
