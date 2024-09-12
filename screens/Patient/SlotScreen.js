import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Pressable,
  ScrollView,
  Dimensions,
} from "react-native";
import { Divider } from "react-native-paper";
import { format, formatDistanceToNow } from "date-fns";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import colors from "../../utils/colors";
import SlotButton from "../../components/SlotButton";
import BackIcon from "../../assets/icons/BackIcon";

// const slots = [
//   {
//     date: "Tue, 13 Aug",
//     available: "11",
//   },
//   {
//     date: "Wed, 14 Aug",
//     available: "11",
//   },
//   {
//     date: "Thu, 15 Aug",
//     available: "11",
//   },
//   {
//     date: "Fri, 16 Aug",
//     available: "11",
//   },
//   {
//     date: "Sat, 17 Aug",
//     available: "11",
//   },
// ];

const generateSlots = (days) => {
  const slots = [];
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);

    let inX;

    if (i === 0) {
      inX = "Today";
    } else {
      inX = formatDistanceToNow(date, { addSuffix: true });
    }

    slots.push({
      date: format(date, "EEE, dd MMM"), // Format the date as "Tue, 13 Aug"
      available: "11", // Example available slots count
      inx: inX,
    });
  }
  return slots;
};
const slotsData = {
  Morning: ["09:00 AM", "09:30 AM", "10:30 AM", "11:00 AM", "11:30 AM"],
  Afternoon: ["12:00 PM", "12:30 PM", "01:00 PM"],
  Evening: ["06:30 PM", "07:00 PM", "07:30 PM"],
  Night: [
    "08:00 PM",
    "08:30 PM",
    "08:00 PM",
    "08:30 PM",
    "08:00 PM",
    "08:30 PM",
  ],
};

const itemWidth = wp("45%");

export default function SlotScreen({ navigation, route }) {
  const { doctor, appointmentType } = route.params;
  const scrollViewRef = useRef(null);
  const [selectedSlot, setSelectedSlot] = useState(0);

  const slots = generateSlots(10);
  const [selectedDate, setSelectedDate] = useState(slots[selectedSlot].date);

  const screenWidth = Dimensions.get("window").width;

  const handleSlotPress = (index) => {
    setSelectedSlot(index);
    console.log(selectedSlot);
    setSelectedDate(slots[index].date);
    console.log(selectedDate);

    // Width of each Pressable
    const offset = index * itemWidth - (screenWidth - itemWidth) / 3.5;
    scrollViewRef.current?.scrollTo({ x: offset, animated: true });
  };

  return (
    <>
      <StatusBar backgroundColor={colors.lightaccent} />
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
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text
            style={{
              color: colors.whitetext,
              fontWeight: "bold",
              fontSize: 18,
            }}
          >
            {doctor.name}
          </Text>
          <Text
            style={{
              color: colors.whitetext,
              fontSize: 14,
              textAlign: "center",
            }}
          >
            {doctor.specialization}
          </Text>
        </View>
        <View style={{ height: 20, width: 20 }} />
      </View>
      <View style={styles.container}>
        <View style={{ padding: 10 }}>
          <Text
            style={{
              color: colors.whitetext,
              fontWeight: "bold",
              fontSize: 22,
            }}
          >
            {appointmentType === "Clinic"
              ? "Clinic visit slots"
              : "Virtual consult slots"}
          </Text>
        </View>
        <View style={{ flexDirection: "column" }}>
          <ScrollView
            ref={scrollViewRef}
            horizontal={true}
            contentContainerStyle={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
            indicatorStyle="white"
          >
            {slots.map((slot, index) => (
              <Pressable
                key={index}
                onPress={() => handleSlotPress(index)}
                style={[
                  styles.dateButton,
                  selectedSlot === index && styles.selectedButton,
                ]}
              >
                <Text
                  style={[
                    styles.slotdatetext,
                    selectedSlot === index && styles.selectedSlotText,
                  ]}
                >
                  {slot.date}
                </Text>
                <Text
                  style={[
                    styles.slotsAvailable,
                    selectedSlot === index && styles.selectedSlotText,
                  ]}
                >
                  {slot.available} slots available
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={styles.selectedDateContainer}>
          <Text style={styles.selectedDateText}>{selectedDate}</Text>
        </View>
        <Divider style={{ marginTop: 10 }} />

        <ScrollView>
          {Object.entries(slotsData).map(([timeOfDay, slotTimes], index) => (
            <View key={index} style={styles.timeSlotContainer}>
              <Text style={styles.slotHeading}>
                {timeOfDay} {slotTimes.length} slots
              </Text>
              <View style={styles.slotRow}>
                {slotTimes.map((time, idx) => (
                  <SlotButton
                    key={idx}
                    time={time}
                    onPress={() =>
                      navigation.navigate("Booking", {
                        doctor,
                        slotno: time,
                        selectedDate,
                        appointmentType,
                        inx: slots[selectedSlot].inx,
                      })
                    }
                    style={styles.slotButton}
                  />
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    backgroundColor: colors.darkback,
    padding: 16,
  },

  dateButton: {
    // flex: 1,
    marginHorizontal: 5,
    padding: 10,
    backgroundColor: colors.whitetext,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    width: itemWidth,
    height: hp("10%"),
    marginBottom: 0,
  },

  slotdatetext: {
    fontWeight: "700",
  },

  slotsAvailable: {
    fontSize: 12,
    color: "#4CAF50",
    marginTop: 5,
  },
  timeSlotContainer: {
    marginTop: 20,
  },
  slotHeading: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.whitetext,
    marginBottom: 5,
  },
  slotRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    flexWrap: "wrap",
  },
  slotButton: {
    marginHorizontal: 5,
    padding: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    alignItems: "center",
  },

  selectedButton: {
    borderColor: colors.lightcomp,
    backgroundColor: colors.lightcomp,
  },
  selectedDateContainer: {
    alignItems: "center",
    marginBottom: 0,
  },
  selectedDateText: {
    color: colors.whitetext,
    fontWeight: "bold",
    fontSize: 18,
  },
});
