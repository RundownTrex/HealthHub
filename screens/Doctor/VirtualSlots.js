import { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  BackHandler,
  Image,
  ScrollView,
} from "react-native";
import { useBottomSheet } from "../../context/BottomSheetContext";
import auth from "@react-native-firebase/auth";
import DatePicker from "react-native-date-picker";
import { format, parseISO, parse, compareAsc, isValid } from "date-fns";
import { Calendar } from "react-native-calendars";
import firestore from "@react-native-firebase/firestore";
import Toast from "react-native-toast-message";

import colors from "../../utils/colors";
import BackIcon from "../../assets/icons/BackIcon";
import LoadingOverlay from "../../components/LoadingOverlay";
import Button1 from "../../components/Button1";

export default function VirtualSlots({ navigation }) {
  const { toggleBottomSheet } = useBottomSheet();
  const [value, setValue] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [doctorData, setDoctorData] = useState({});
  const user = auth().currentUser;

  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  ); // For the calendar
  const [time, setTime] = useState(new Date()); // For the date picker
  const [open, setOpen] = useState(false); // Controls opening of date picker
  const [slotsByDate, setSlotsByDate] = useState({});

  const addVirtualSlot = (selectedTime) => {
    const newSlot = {
      time: selectedTime,
      status: "not booked",
    };

    setSlotsByDate((prev) => ({
      ...prev,
      [selectedDate]: [...(prev[selectedDate] || []), newSlot],
    }));
  };

  const removeSlot = (index) => {
    setSlotsByDate((prev) => ({
      ...prev,
      [selectedDate]: prev[selectedDate].filter((_, i) => i !== index),
    }));
  };

  useEffect(() => {
    console.log(slotsByDate);
  }, [slotsByDate]);

  const parseTime = (timeString) => {
    return parse(timeString, "hh:mm a", new Date());
  };

  const slotsForSelectedDate = (slotsByDate[selectedDate] || []).sort(
    (a, b) => {
      const timeA = parseTime(a.time);
      const timeB = parseTime(b.time);
      return compareAsc(timeA, timeB);
    }
  );

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

  const fetchSlots = async (selectedDate) => {
    try {
      const virtualSlotsRef = firestore()
        .collection("profile")
        .doc(user.uid)
        .collection("virtualSlots");
      const slotsSnapshot = await virtualSlotsRef.get();

      if (slotsSnapshot.empty) {
        setSlotsByDate((prev) => ({
          ...prev,
          [selectedDate]: [],
        }));
      } else {
        const slotsRef = virtualSlotsRef.doc(selectedDate);
        const doc = await slotsRef.get();

        if (doc.exists) {
          const data = doc.data();
          const slots = (data.slots || []).map((slot) => ({
            time: slot.time,
            status: slot.status || "not booked",
          }));
          setSlotsByDate((prev) => ({
            ...prev,
            [selectedDate]: slots,
          }));
        } else {
          console.log("No slots found for this date.");
          setSlotsByDate((prev) => ({
            ...prev,
            [selectedDate]: [],
          }));
        }
      }
    } catch (error) {
      console.error("Error fetching slots: ", error);
      Toast.show({
        type: "error",
        text1: "Failed to fetch slots",
      });
    }
  };

  useEffect(() => {
    if (selectedDate) {
      fetchSlots(selectedDate);
    }
  }, [selectedDate]);



  const saveSlots = async () => {
    setIsLoading(true);

    const batch = firestore().batch();

    const virtualSlots = Object.keys(slotsByDate).reduce((acc, date) => {
      acc[date] = slotsByDate[date].map((slot) => ({
        time: slot.time,
        status: slot.status,
      }));
      return acc;
    }, {});

    console.log(virtualSlots);

    Object.keys(virtualSlots).forEach((date) => {
      const slotsRef = firestore()
        .collection("profile")
        .doc(user.uid)
        .collection("virtualSlots")
        .doc(date);

      batch.set(slotsRef, { slots: virtualSlots[date] }, { merge: true });
    });

    await batch.commit();

    Toast.show({
      type: "success",
      text1: "Slots saved successfully",
    });
    setIsLoading(false);
  };

  return (
    <>
      <LoadingOverlay isVisible={isLoading} />
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
          Virtual Appointment Slots
        </Text>
        <View style={{ height: 20, width: 20 }} />
      </View>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
      >
        <Calendar
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markedDates={{
            [selectedDate]: {
              selected: true,
              selectedColor: colors.complementary,
            },
          }}
          minDate={format(new Date(), "yyyy-MM-dd")}
          enableSwipeMonths={true}
        />
        <Button1
          text="Add Slot"
          onPress={() => setOpen(true)}
          style={{ marginVertical: 10 }}
        />
        <DatePicker
          modal
          open={open}
          date={time}
          mode="time"
          onConfirm={(time) => {
            setOpen(false);
            addVirtualSlot(format(time, "hh:mm a"));
          }}
          onCancel={() => setOpen(false)}
        />

        <View style={{ flex: 1 }}>
          <Text style={styles.label}>
            Slots for:{" "}
            <Text style={{ fontWeight: "bold" }}>
              {format(parseISO(selectedDate), "EEEE, MMMM d, yyyy")}
            </Text>
          </Text>
          <ScrollView>
            {slotsForSelectedDate.map((slot, index) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  padding: 15,
                  backgroundColor: colors.somewhatlightback,
                  borderRadius: 8,
                  marginVertical: 5,
                }}
              >
                <Text style={styles.slotTime}>{slot.time}</Text>
                {slot.status !== "booked" ? (
                  <Pressable onPress={() => removeSlot(index)}>
                    <Image
                      source={require("../../assets/red-cross.png")}
                      style={styles.removeIcon}
                    />
                  </Pressable>
                ) : (
                  <Text style={{ color: colors.whitetext }}>Booked</Text>
                )}
              </View>
            ))}
          </ScrollView>

          <Button1
            text="Save Slots"
            onPress={saveSlots}
            style={{ marginVertical: 10 }}
          />
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkback,
    padding: 16,
  },

  switchItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginVertical: 10,
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
  },
  switchItemText: {
    color: colors.whitetext,
    fontSize: 16,
    fontWeight: "500",
  },
  switchItemDescription: {
    color: colors.whitetext,
    fontSize: 14,
    flexShrink: 1,
  },

  slotTime: {
    color: colors.whitetext,
    fontSize: 16,
    fontWeight: "bold",
  },

  removeIcon: {
    height: 25,
    width: 25,
  },

  label: {
    fontSize: 16,
    color: colors.lightgraytext,
  },
});
