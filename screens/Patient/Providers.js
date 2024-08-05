import React, { useState } from "react";
import { View, Text, StyleSheet, StatusBar, Pressable } from "react-native";
import colors from "../../utils/colors";
import { Searchbar, MD3LightTheme } from "react-native-paper";
import { FlashList } from "@shopify/flash-list";
import DoctorProfileCard from "../../components/DoctorProfileCard";
import BackIcon from "../../assets/icons/BackIcon";

const doctors = [
  {
    name: "Dr. Bludma",
    specialization: "General physician",
    experience: 10,
    location: "Dadar",
    clinic: "Fit clinic",
    fee: 2500,
    image: require("../../assets/general-practicionor.png"),
    virtualConsultation: true,
  },
  {
    name: "Dr. Okay",
    specialization: "General physician",
    experience: 10,
    location: "Dadar",
    clinic: "Fit clinic",
    fee: 2500,
    image: require("../../assets/general-practicionor.png"),
    virtualConsultation: false,
  },
  {
    name: "Dr. Sure",
    specialization: "General physician",
    experience: 10,
    location: "Dadar",
    clinic: "Fit clinic",
    fee: 2500,
    image: require("../../assets/general-practicionor.png"),
    virtualConsultation: true,
  },
  {
    name: "Dr. Sure",
    specialization: "General physician",
    experience: 10,
    location: "Dadar",
    clinic: "Fit clinic",
    fee: 2500,
    image: require("../../assets/general-practicionor.png"),
    virtualConsultation: true,
  },
  {
    name: "Dr. Sure",
    specialization: "General physician",
    experience: 10,
    location: "Dadar",
    clinic: "Fit clinic",
    fee: 2500,
    image: require("../../assets/general-practicionor.png"),
    virtualConsultation: true,
  },
  {
    name: "Dr. Sure",
    specialization: "General physician",
    experience: 10,
    location: "Dadar",
    clinic: "Fit clinic",
    fee: 2500,
    image: require("../../assets/general-practicionor.png"),
    virtualConsultation: true,
  },
  {
    name: "Dr. Sure",
    specialization: "General physician",
    experience: 10,
    location: "Dadar",
    clinic: "Fit clinic",
    fee: 2500,
    image: require("../../assets/general-practicionor.png"),
    virtualConsultation: true,
  },
  {
    name: "Dr. Sure",
    specialization: "General physician",
    experience: 10,
    location: "Dadar",
    clinic: "Fit clinic",
    fee: 2500,
    image: require("../../assets/general-practicionor.png"),
    virtualConsultation: true,
  },
];

export default function Providers({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState(doctors);

  const onChangeSearch = (query) => {
    setSearchQuery(query);
    setFilteredDoctors(
      doctors.filter((doctor) =>
        doctor.name.toLowerCase().includes(query.toLowerCase())
      )
    );
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

          <Searchbar
            placeholder="Search"
            onChangeText={onChangeSearch}
            value={searchQuery}
            rippleColor={colors.lightaccent}
            theme={MD3LightTheme}
            // loading={true}
            style={{
              backgroundColor: colors.whitetext,
              width: "100%",
              marginBottom: 16,
            }}
            inputStyle={{
              color: colors.blacktext,
            }}
          />
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
});
