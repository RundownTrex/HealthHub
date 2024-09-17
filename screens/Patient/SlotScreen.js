import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Pressable,
  ScrollView,
  Dimensions,
  Image,
  FlatList,
} from "react-native";
import { Divider } from "react-native-paper";
import {
  format,
  formatDistanceToNow,
  parse,
  set,
  isBefore,
  isAfter,
  parseISO,
} from "date-fns";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import firestore from "@react-native-firebase/firestore";
import call from "react-native-phone-call";

import colors from "../../utils/colors";
import SlotButton from "../../components/SlotButton";
import BackIcon from "../../assets/icons/BackIcon";

export default function SlotScreen({ navigation, route }) {
  const { doctor, appointmentType } = route.params;

  const flatListRef = useRef(null);

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
        date: format(date, "yyyy-MM-dd"),
        displayDate: format(date, "EEE, dd MMM"),
        inx: inX,
      });
    }
    return slots;
  };

  const slots = generateSlots(30);

  const [selectedSlot, setSelectedSlot] = useState(0);
  const [selectedDate, setSelectedDate] = useState(slots[0].date);

  const [clinicSlots, setClinicSlots] = useState([]);
  const [virtualSlots, setVirtualSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [categorizedSlots, setCategorizedSlots] = useState({
    Morning: [],
    Afternoon: [],
    Evening: [],
  });

  const categorizeSlotsByTimeOfDay = (slots, selectedDate) => {
    const morningSlots = [];
    const afternoonSlots = [];
    const eveningSlots = [];

    const currentTime = new Date(); 

    const selectedDateObj = parseISO(selectedDate);

    slots
      .filter((slot) => {
        if (
          !slot.time ||
          typeof slot.time !== "string" ||
          slot.status !== "not booked"
        ) {
          return false;
        }

        let slotTime;
        try {
          slotTime = parse(slot.time.trim(), "hh:mm a", new Date()); 
        } catch (error) {
          console.error("Error parsing slot time:", slot.time, error);
          return false;
        }

        const slotDateTime = set(selectedDateObj, {
          hours: slotTime.getHours(),
          minutes: slotTime.getMinutes(),
        });


        return (
          isAfter(slotDateTime, currentTime) ||
          isAfter(selectedDateObj, currentTime)
        );
      })
      .forEach((slot) => {
        let slotTime;
        try {
          slotTime = parse(slot.time.trim(), "hh:mm a", new Date());
        } catch (error) {
          console.error("Error parsing slot time:", slot.time, error);
          return; 
        }

        const slotDateTime = set(selectedDateObj, {
          hours: slotTime.getHours(),
          minutes: slotTime.getMinutes(),
        });

        const morningEnd = set(selectedDateObj, { hours: 11, minutes: 59 });
        const afternoonEnd = set(selectedDateObj, { hours: 16, minutes: 59 });
        const eveningEnd = set(selectedDateObj, { hours: 23, minutes: 59 });

        if (isBefore(slotDateTime, morningEnd)) {
          morningSlots.push(slot);
        } else if (isBefore(slotDateTime, afternoonEnd)) {
          afternoonSlots.push(slot);
        } else if (isBefore(slotDateTime, eveningEnd)) {
          eveningSlots.push(slot);
        }
      });

    return {
      Morning: morningSlots,
      Afternoon: afternoonSlots,
      Evening: eveningSlots,
    };
  };

  useEffect(() => {
    if (appointmentType === "Clinic") {
      setCategorizedSlots(
        categorizeSlotsByTimeOfDay(clinicSlots, selectedDate)
      );
    }

    if (appointmentType === "Virtual") {
      setCategorizedSlots(
        categorizeSlotsByTimeOfDay(virtualSlots, selectedDate)
      );
    }
  }, [clinicSlots, virtualSlots]);

  const handleSlotPress = (index) => {
    setSelectedSlot(index);
    setSelectedDate(slots[index].date);

    flatListRef.current?.scrollToIndex({
      index,
      viewPosition: 0.5,
      animated: true,
    });
  };

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
      const virtualSlotsDoc = await firestore()
        .collection("profile")
        .doc(userId)
        .collection("virtualSlots")
        .doc(date)
        .get();

      if (virtualSlotsDoc.exists) {
        const virtualData = virtualSlotsDoc.data();
        return virtualData.slots;
      } else {
        console.log("No virtual slots found for this date");
        return [];
      }
    } catch (error) {
      console.error("Error fetching virtual slots: ", error);
      return [];
    }
  };

  useEffect(() => {
    if (appointmentType === "Clinic") {
      const loadSlots = async () => {
        setLoadingSlots(true);
        const fetchedSlots = await fetchClinicSlots(doctor.id, selectedDate);
        setClinicSlots(fetchedSlots);
        setLoadingSlots(false);
      };

      loadSlots();
    } else {
      const loadSlots = async () => {
        setLoadingSlots(true);
        const fetchedSlots = await fetchVirtualSlots(doctor.id, selectedDate);
        setVirtualSlots(fetchedSlots);
        setLoadingSlots(false);
      };

      loadSlots();
    }
  }, [selectedDate, doctor.id]);

  useEffect(() => {
    console.log(categorizedSlots);
  }, [categorizedSlots]);

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

  const renderItem = ({ item, index }) => (
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
        {item.displayDate}
      </Text>
      {/* <Text
        style={[
          styles.slotsAvailable,
          selectedSlot === index && styles.selectedSlotText,
        ]}
      >
        {item.available} slots available
      </Text> */}
    </Pressable>
  );

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
            {`${doctor.firstname} ${doctor.lastname}`}
          </Text>
          <Text
            style={{
              color: colors.whitetext,
              fontSize: 14,
              textAlign: "center",
            }}
          >
            {doctor.profileData.designation}
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
          <FlatList
            ref={flatListRef}
            horizontal
            data={slots}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        <View style={styles.selectedDateContainer}>
          <Text style={styles.selectedDateText}>
            {slots[selectedSlot].displayDate}
          </Text>
        </View>
        <Divider style={{ marginTop: 10 }} />

        <ScrollView>
          {loadingSlots ? (
            <Text style={styles.loadingSlots}>Loading slots...</Text>
          ) : Object.values(categorizedSlots).flat().length > 0 ? (
            Object.entries(categorizedSlots).map(
              ([timeOfDay, slotTimes], index) => (
                <View key={index} style={{ marginVertical: 10 }}>
                  <Text style={styles.timeofday}>
                    {timeOfDay} ({slotTimes.length} slots)
                  </Text>
                  <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                    {slotTimes.map((slot, idx) => (
                      <SlotButton
                        key={idx}
                        time={slot.time}
                        onPress={() =>
                          navigation.navigate("Booking", {
                            doctor,
                            slotno: slot.time,
                            selectedDate,
                            appointmentType,
                          })
                        }
                      />
                    ))}
                  </View>
                </View>
              )
            )
          ) : (
            <View
              style={{
                width: "100%",
                height: "100%",
                justifyContent: "center",
                marginVertical: 20,
              }}
            >
              <View
                style={{
                  alignSelf: "center",
                  width: "100%",
                  marginTop: 5,
                  marginBottom: 16,
                }}
              >
                <Text style={styles.noSlots}>
                  No available slots on {slots[selectedSlot].displayDate}
                </Text>
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
        </ScrollView>
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

  dateButton: {
    // flex: 1,
    marginHorizontal: 5,
    padding: 10,
    backgroundColor: colors.whitetext,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    width: wp("40%"),
    height: hp("8%"),
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

  loadingSlots: {
    color: colors.whitetext,
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: "center",
    textAlign: "center",
  },

  timeofday: {
    color: colors.lightgraytext,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },

  noSlots: {
    color: colors.whitetext,
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
    color: colors.lightgraytext,
  },

  button: {
    backgroundColor: colors.lightaccent,
    paddingVertical: 12,
    borderRadius: 5,
  },

  buttonText: {
    color: colors.whitetext,
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
});
