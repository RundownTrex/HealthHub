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
import {
  Searchbar,
  MD3LightTheme,
  Chip,
  Avatar,
  ActivityIndicator,
} from "react-native-paper";
import { FlashList } from "@shopify/flash-list";
import { useBottomSheet } from "../../context/BottomSheetContext";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

import BackIcon from "../../assets/icons/BackIcon";
import colors from "../../utils/colors";
import DoctorProfileCard from "../../components/DoctorProfileCard";
import Toast from "react-native-toast-message";

export default function Providers({ navigation, route }) {
  const searchBarRef = useRef(null);

  const { send } = route.params;
  const [searchQuery, setSearchQuery] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [virtualConsultation, setVirtualConsultation] = useState(false);
  const [clinic, setClinic] = useState(false);
  const { toggleBottomSheet } = useBottomSheet();
  const [options, setOptions] = useState(false);
  const [loading, setLoading] = useState(true);

  const user = auth().currentUser;

  const toggleVirtualConsultation = () => {
    setVirtualConsultation((prevState) => !prevState);
  };

  const toggleClinic = () => {
    setClinic((prevState) => !prevState);
  };

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const doctorsSnapshot = await firestore()
          .collection("users")
          .where("accountType", "==", "doctor")
          .get();

        const doctorsList = await Promise.all(
          doctorsSnapshot.docs.map(async (doc) => {
            const data = doc.data();

            let profileData = {};
            if (data.profileRef && typeof data.profileRef.get === "function") {
              try {
                const profileDoc = await data.profileRef.get();
                if (profileDoc.exists) {
                  profileData = profileDoc.data();
                }
              } catch (profileError) {
                console.error("Error fetching profile data: ", profileError);
              }
            }

            return {
              id: doc.id,
              ...data,
              profileData,
            };
          })
        );

        setDoctors(doctorsList);
        setFilteredDoctors(doctorsList);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching doctors: ", error);
        Toast.show({
          type: "error",
          text1: error,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

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
    if (route.params?.focus) {
      searchBarRef.current?.focus();
    }
  }, [route.params?.focus]);

  useEffect(() => {
    if (route.params?.clinic) {
      setOptions(true);
      setClinic(true);
    }
  }, [route.params?.clinic]);

  useEffect(() => {
    if (send) {
      setSearchQuery(send);
    }
  }, [send]);

  useEffect(() => {
    console.log(doctors);
  }, [doctors]);

  useEffect(() => {
    setFilteredDoctors(
      doctors.filter((doctor) => {
        const doctorName = `${doctor.firstname || ""} ${
          doctor.lastname || ""
        }`.toLowerCase();
        const doctorDesignation =
          doctor.profileData?.designation?.toLowerCase() || "";

        const matchesQuery =
          doctorName.includes(searchQuery.toLowerCase()) ||
          doctorDesignation.includes(searchQuery.toLowerCase());

        const matchesVirtualConsultation =
          !virtualConsultation || doctor.profileData.virtualConsultation;

        const matchesClinic = !clinic || doctor.profileData.clinicConsultation;

        return matchesQuery && matchesVirtualConsultation && matchesClinic;
      })
    );
  }, [searchQuery, virtualConsultation, clinic, doctors]);

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
              selectionColor={colors.lightaccent}    
              theme={MD3LightTheme}
              // loading={true}
              ref={searchBarRef}
              style={{
                backgroundColor: colors.whitetext,
                width: "85%",
                height: 45,
                alignItems: "center",
                // marginBottom: 16,
                borderRadius: 8,
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
          {loading ? (
            <View
              style={{
                alignSelf: "center",
                flex: 1,
                justifyContent: "center",
              }}
            >
              <ActivityIndicator size={"large"} color={colors.lightaccent} />
            </View>
          ) : filteredDoctors.length === 0 ? (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>No results found!</Text>
            </View>
          ) : (
            <FlashList
              data={filteredDoctors}
              renderItem={({ item }) => <DoctorProfileCard doctor={item} />}
              keyExtractor={(item, index) => index.toString()}
              // contentContainerStyle={{ paddingBottom: 80 }}
              estimatedItemSize={50}
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
