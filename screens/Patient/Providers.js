import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Pressable,
  Image,
  BackHandler,
} from "react-native";
import colors from "../../utils/colors";
import { Searchbar, MD3LightTheme, Chip } from "react-native-paper";
import { FlashList } from "@shopify/flash-list";
import DoctorProfileCard from "../../components/DoctorProfileCard";
import BackIcon from "../../assets/icons/BackIcon";
import { useRoute } from "@react-navigation/native";
import { useBottomSheet } from "../../context/BottomSheetContext";

const doctors = [
  {
    name: "Dr. Bludma",
    degree: "MBBS",
    specialization: "General physician",
    experience: 10,
    location: "Dadar",
    clinic: "Fit clinic",
    address:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text",
    fee: 2500,
    image: require("../../assets/general-practicionor.png"),
    virtualConsultation: true,
    clinicAvailable: true,
  },
  {
    name: "Dr. Okay",
    degree: "MBBS",
    specialization: "General physician",
    experience: 10,
    location: "Dadar",
    clinic: "Fit clinic",
    address:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text",
    fee: 2500,
    image: require("../../assets/general-practicionor.png"),
    virtualConsultation: false,
    clinicAvailable: true,
  },
  {
    name: "Dr. Sure",
    degree: "MBBS",
    specialization: "General physician",
    experience: 10,
    location: "Dadar",
    clinic: "Fit clinic",
    address:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text",
    fee: 2500,
    image: require("../../assets/general-practicionor.png"),
    virtualConsultation: true,
    clinicAvailable: false,
  },
  {
    name: "Dr. Sure",
    degree: "MBBS",
    specialization: "General physician",
    experience: 10,
    location: "Dadar",
    clinic: "Fit clinic",
    address:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text",
    fee: 2500,
    image: require("../../assets/general-practicionor.png"),
    virtualConsultation: false,
    clinicAvailable: true,
  },
  {
    name: "Dr. Sure",
    degree: "MBBS",
    specialization: "General physician",
    experience: 10,
    location: "Dadar",
    clinic: "Fit clinic",
    address:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text",
    fee: 2500,
    image: require("../../assets/general-practicionor.png"),
    virtualConsultation: true,
    clinicAvailable: true,
  },
];

export default function Providers({ navigation }) {
  const searchBarRef = useRef(null);

  const route = useRoute();
  const { send } = route.params;
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState(doctors);
  const [virtualConsultation, setVirtualConsultation] = useState(false);
  const [clinic, setClinic] = useState(false);
  const { toggleBottomSheet } = useBottomSheet();
  const [options, setOptions] = useState(false);

  const toggleVirtualConsultation = () => {
    setVirtualConsultation((prevState) => !prevState);
  };

  const toggleClinic = () => {
    setClinic((prevState) => !prevState);
  };

  
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
  }, [navigation]);

  useEffect(() => {
    if (send) {
      setSearchQuery(send);
    }
  }, [send]);

  useEffect(() => {
    if (route.params?.focus) {
      searchBarRef.current?.focus();
    }
  }, [route.params?.focus]);

  useEffect(() => {
    setFilteredDoctors(
      doctors.filter((doctor) => {
        const matchesQuery =
          doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doctor.specialization
            .toLowerCase()
            .includes(searchQuery.toLowerCase());

        const matchesVirtualConsultation =
          !virtualConsultation || doctor.virtualConsultation;

        const matchesClinic = !clinic || doctor.clinicAvailable;

        return matchesQuery && matchesVirtualConsultation && matchesClinic;
      })
    );
  }, [searchQuery, virtualConsultation, clinic]);

  const filters = ["Video consult", "Male", "Female"];

  const handleOptions = () => {
    setOptions((prev) => !prev);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
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
            Find doctors
          </Text>
          <View style={{ height: 20, width: 20 }} />
        </View>
        <View style={styles.container}>
          <StatusBar backgroundColor={colors.lightaccent} />
          <View
            style={{
              flexDirection: "row",
              // borderWidth: 1,
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <Searchbar
              placeholder="Search"
              onChangeText={setSearchQuery}
              value={searchQuery}
              rippleColor={colors.lightaccent}
              traileringIconColor={colors.lightaccent}
              selectionHandleColor={colors.lightaccent}
              theme={MD3LightTheme}
              // loading={true}
              ref={searchBarRef}
              style={{
                backgroundColor: colors.whitetext,
                width: "85%",
                height: 45,
                alignItems: "center",
                // marginBottom: 16,
              }}
              inputStyle={{
                color: colors.blacktext,
                fontSize: 16,
                alignSelf: "center",
              }}
            />
            <Pressable
              style={({ pressed }) => [
                { padding: 10 },
                pressed && { opacity: 0.8 },
              ]}
              onPress={handleOptions}
            >
              <Image
                source={require("../../assets/icons/search-options.png")}
                style={{ height: 30, width: 30 }}
              />
            </Pressable>
          </View>
          {options ? (
            <View style={styles.chipContainer}>
              {/* {filters.map((filter, index) => (
          ))} */}
              <Chip
                style={styles.chip}
                mode="outlined"
                selected={clinic}
                onPress={toggleClinic}
              >
                Clinic
              </Chip>
              <Chip
                style={styles.chip}
                mode="outlined"
                selected={virtualConsultation}
                onPress={toggleVirtualConsultation}
              >
                Virtual Consult
              </Chip>
            </View>
          ) : null}
          {filteredDoctors.length === 0 ? (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>No results found!</Text>
            </View>
          ) : (
            <FlashList
              data={filteredDoctors}
              renderItem={({ item }) => <DoctorProfileCard doctor={item} />}
              keyExtractor={(item, index) => index.toString()}
              // contentContainerStyle={{ paddingBottom: 80 }}
              estimatedItemSize={10}
            />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkback,
    // alignItems: "center",
    // justifyContent: "center",
    padding: 16,
    paddingBottom: 0,
    width: "100%",
  },

  text: {
    color: colors.whitetext,
    fontSize: 20,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noResultsText: {
    color: colors.whitetext,
    fontSize: 18,
    fontWeight: "bold",
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  chip: {
    marginRight: 10,
    marginBottom: 10,
  },
});
