import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  BackHandler,
  Pressable,
  Image,
  FlatList,
  RefreshControl,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Searchbar } from "react-native-paper";

import colors from "../../utils/colors";
import { useBottomSheet } from "../../context/BottomSheetContext";
import LoadingOverlay from "../../components/LoadingOverlay";
import BackIcon from "../../assets/icons/BackIcon";
import Button1 from "../../components/Button1";

const appointments = [
  {
    id: 1,
    patientName: "John Smith",
    appointmentSlot: "Tue, 12 Sep 2024, 10:00 AM",
    appointmentType: "Clinic",
    appointmentStatus: "Completed",
  },
  {
    id: 2,
    patientName: "Jane Doe",
    appointmentSlot: "Wed, 15 Sep 2024, 2:00 PM",
    appointmentType: "Virtual",
    appointmentStatus: "Cancelled",
  },
  {
    id: 3,
    patientName: "Alice Lee",
    appointmentSlot: "Fri, 18 Sep 2024, 4:30 PM",
    appointmentType: "Clinic",
    appointmentStatus: "Cancelled",
  },
  {
    id: 4,
    patientName: "Emily Clark",
    appointmentSlot: "Sat, 20 Sep 2024, 11:30 AM",
    appointmentType: "Virtual",
    appointmentStatus: "Completed",
  },
  {
    id: 5,
    patientName: "Robert Brown",
    appointmentSlot: "Mon, 22 Sep 2024, 9:00 AM",
    appointmentType: "Clinic",
    appointmentStatus: "Completed",
  },
  {
    id: 6,
    patientName: "Olivia Green",
    appointmentSlot: "Wed, 24 Sep 2024, 3:00 PM",
    appointmentType: "Virtual",
    appointmentStatus: "Cancelled",
  },
  {
    id: 7,
    patientName: "William Johnson",
    appointmentSlot: "Thu, 25 Sep 2024, 12:30 PM",
    appointmentType: "Clinic",
    appointmentStatus: "Cancelled",
  },
  {
    id: 8,
    patientName: "Amelia Davis",
    appointmentSlot: "Sat, 27 Sep 2024, 11:00 AM",
    appointmentType: "Virtual",
    appointmentStatus: "Completed",
  },
  {
    id: 9,
    patientName: "Michael Harris",
    appointmentSlot: "Tue, 29 Sep 2024, 10:00 AM",
    appointmentType: "Clinic",
    appointmentStatus: "Completed",
  },
  {
    id: 10,
    patientName: "Sophia Martinez",
    appointmentSlot: "Thu, 1 Oct 2024, 4:00 PM",
    appointmentType: "Virtual",
    appointmentStatus: "Cancelled",
  },
];

export default function PatientAppointmentHistory({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [records, setRecords] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRecords, setFilteredRecords] = useState(records);

  const [suggestions, setSuggestions] = useState([]);
  const statusOptions = ["Completed", "Cancelled", "Clinic", "Virtual"];

  const { toggleBottomSheet } = useBottomSheet();

  useEffect(() => {
    setIsLoading(true);
    fetchRecords();
    setIsLoading(false);
  }, [fetchRecords]);

  useEffect(() => {
    setFilteredRecords(records);
  }, [records]);

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

  const onRefresh = useCallback(() => {
    setIsLoading(true);
    setRefreshing(true);
    fetchRecords();
    setRefreshing(false);
    setIsLoading(false);
  }, [fetchRecords]);

  const fetchRecords = useCallback(() => {
    try {
      const allRecords = appointments;
      console.log(allRecords);
      setRecords(allRecords); // Assuming 'setRecords' is your state updater
    } catch (error) {
      console.error("Error fetching records:", error);
    }
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);

    if (query.length > 0) {
      const filteredSuggestions = statusOptions.filter((status) =>
        status.toLowerCase().startsWith(query.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }

    if (query) {
      const filtered = records.filter((appointment) => {
        const { patientName, appointmentType, appointmentStatus } = appointment;
        return (
          patientName.toLowerCase().includes(query.toLowerCase()) ||
          appointmentStatus.toLowerCase().includes(query.toLowerCase()) ||
          appointmentType.toLowerCase().includes(query.toLowerCase())
        );
      });
      setFilteredRecords(filtered);
    } else {
      setFilteredRecords(records);
    }
  };

  const handleSuggestionPress = (suggestion) => {
    setSearchQuery(suggestion);
    setSuggestions([]);
  };

  const renderRecord = ({ item, index }) => {
    let backgroundColor;

    // Assign background color based on the appointment status
    switch (item.appointmentStatus) {
      case "Completed":
        backgroundColor = colors.completed; // You can define the color in your colors file
        break;
      case "Cancelled":
        backgroundColor = colors.cancelled;
        break;
      case "Rescheduled":
        backgroundColor = colors.rescheduled;
        break;
      default:
        backgroundColor = colors.somewhatlightback; // Default color
    }

    return (
      <View
        style={[
          styles.appointmentCard,
          {
            borderColor: backgroundColor,
            borderLeftWidth: 3,
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
          },
        ]}
      >
        <View style={styles.appointmentInfo}>
          <Text style={styles.patientName}>
            Patient Name: {item.patientName}
          </Text>
          <Text style={styles.appointmentSlot}>
            Slot: {item.appointmentSlot}
          </Text>
          <Text style={styles.appointmentType}>
            Type: {item.appointmentType} Appointment
          </Text>
          <Text style={[styles.appointmentStatus]}>
            Status: {item.appointmentStatus}
          </Text>
        </View>
      </View>
    );
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
          Appointment History
        </Text>
        <View style={{ height: 20, width: 20 }} />
      </View>
      <View style={styles.container}>
        <View style={{ alignSelf: "center", marginBottom: 10 }}>
          <Searchbar
            placeholder="Search"
            onChangeText={handleSearch}
            value={searchQuery}
            rippleColor={colors.lightaccent}
            traileringIconColor={colors.lightaccent}
            selectionHandleColor={colors.lightaccent}
            style={{
              backgroundColor: colors.whitetext,
              width: "85%",
              height: 45,
              alignItems: "center",
              marginBottom: 1,
              borderRadius: 8,
            }}
            inputStyle={{
              color: colors.blacktext,
              fontSize: 16,
              alignSelf: "center",
            }}
          />

          {suggestions.length > 0 && (
            <View style={styles.suggestionsContainer}>
              {suggestions.map((suggestion, index) => (
                <Pressable
                  key={index}
                  onPress={() => handleSuggestionPress(suggestion)}
                  style={styles.suggestionItem}
                >
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>
        <FlatList
          data={filteredRecords}
          renderItem={renderRecord}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.recordsContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.noRecords}>
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <Image
                  source={require("../../assets/no-appointments.png")}
                  style={styles.noRecordsImage}
                />
                <Text style={styles.noRecordsText}>No appointments yet!</Text>
                <Text style={styles.noRecordsSubtext}>
                  You can keep a track of all your
                  completed/cancelled/rescheduled appointments here
                </Text>
              </View>
            </View>
          }
        />
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

  label: {
    color: colors.lightgraytext,
    fontSize: 16,
  },

  appointmentContainer: {},

  noRecords: {
    alignItems: "center",
    gap: 50,
    marginTop: 50,
  },
  noRecordsImage: {
    height: 120,
    width: 120,
  },
  noRecordsText: {
    fontWeight: "bold",
    fontSize: 22,
    color: colors.whitetext,
    marginTop: 16,
  },
  noRecordsSubtext: {
    color: colors.whitetext,
    textAlign: "center",
    fontSize: 14,
    marginTop: 8,
  },

  //Render appointment

  appointmentCard: {
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: colors.somewhatlightback,
    paddingVertical: 10,
    paddingHorizontal: 15,
    paddingBottom: 5,
  },
  appointmentInfo: {
    marginBottom: 10,
  },
  patientName: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.whitetext,
  },
  appointmentSlot: {
    fontSize: 16,
    color: colors.whitetext,
  },
  appointmentType: {
    fontSize: 16,
    color: colors.whitetext,
    marginTop: 2,
  },
  appointmentStatus: {
    fontSize: 14,
    color: colors.whitetext,
    marginTop: 10,
  },

  designation: {
    color: colors.lightgraytext,
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 2,
  },

  suggestionsContainer: {
    backgroundColor: colors.somewhatlightback,
    borderRadius: 8,
    padding: 10,
  },

  suggestionItem: {
    padding: 5,
  },
  suggestionText: {
    color: colors.whitetext,
    fontSize: 15,
    fontWeight: "500",
  },
});
