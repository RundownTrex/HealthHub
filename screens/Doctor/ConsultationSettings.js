import { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  BackHandler,
  ScrollView,
} from "react-native";
import { useBottomSheet } from "../../context/BottomSheetContext";
import { Button, Switch } from "react-native-paper";
import MapView, { Marker } from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import Toast from "react-native-toast-message";

import colors from "../../utils/colors";
import BackIcon from "../../assets/icons/BackIcon";
import TextInput1 from "../../components/TextInput1";
import LoadingOverlay from "../../components/LoadingOverlay";
import Button1 from "../../components/Button1";

let profileData;

export default function ConsultationSettings({ navigation }) {
  const { toggleBottomSheet } = useBottomSheet();
  const [isLoading, setIsLoading] = useState(false);

  const [clinicConsultation, setClinicConsultation] = useState(false);
  const [virtualConsultation, setVirtualConsultation] = useState(false);
  const [consultFees, setConsultFees] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [clinicCity, setClinicCity] = useState("");
  const [clinicAddress, setClinicAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [markerPosition, setMarkerPosition] = useState({
    latitude: 18.94024498803612,
    longitude: 72.83573143063485,
  });
  const user = auth().currentUser;

  const [region, setRegion] = useState({
    latitude: 18.94024498803612,
    longitude: 72.83573143063485,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

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

  const updateRegion = (newLatitude, newLongitude) => {
    setRegion({
      latitude: newLatitude,
      longitude: newLongitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };

  useEffect(() => {
    setIsLoading(true);
    const fetchUserProfile = async () => {
      if (user) {
        try {
          const profileDoc = await firestore()
            .collection("profile")
            .doc(user.uid)
            .get();

          if (profileDoc.exists) {
            profileData = profileDoc.data();

            setClinicConsultation(profileData.clinicConsultation);
            setVirtualConsultation(profileData.virtualConsultation);
            setConsultFees(profileData.consultFees);
            setPhone(profileData.phone);

            console.log("Profile data: ", profileData);
          } else {
            console.log("No such document!");
          }

          if (profileData.clinicConsultation) {
            setClinicName(profileData.clinicName);
            setClinicCity(profileData.clinicCity);
            setClinicAddress(profileData.clinicAddress);

            const geoPoint = profileData.cliniclocation;
            console.log(geoPoint.latitude);
            updateRegion(geoPoint.latitude, geoPoint.longitude);
            setMarkerPosition({
              latitude: geoPoint.latitude,
              longitude: geoPoint.longitude,
            });
          }
          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching document: ", error);
          setIsLoading(false);
        } finally {
          setIsLoading(false);
        }
      } else {
        console.log("No user is logged in");
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleClinicConsultationToggle = () => {
    if (clinicConsultation && !virtualConsultation) {
      return;
    }
    setClinicConsultation(!clinicConsultation);
  };

  const handleVirtualConsultationToggle = () => {
    if (virtualConsultation && !clinicConsultation) {
      return;
    }
    setVirtualConsultation(!virtualConsultation);
  };

  const saveChanges = async () => {
    setIsLoading(true);
    try {
      const profileset = {
        clinicConsultation: clinicConsultation,
        virtualConsultation: virtualConsultation,
        consultFees: consultFees,
        phone: phone,
      };

      if (clinicConsultation === true) {
        profileset.clinicName = clinicName;
        profileset.clinicCity = clinicCity;
        profileset.clinicAddress = clinicAddress;
        profileset.cliniclocation = new firestore.GeoPoint(
          markerPosition.latitude,
          markerPosition.longitude
        );
      }

      await firestore().collection("profile").doc(user.uid).update(profileset);

      console.log(profileset);

      setIsLoading(false);
      Toast.show({
        type: "success",
        text1: "Profile edited successfully",
      });
    } catch (error) {
      console.error("Error updating profile : ", error);
      setIsLoading(false);
      Toast.show({
        type: "error",
        text1: "Failed to update profile",
        text2: "Make sure none of the fields are left empty",
      });
    }
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
          Consultation Settings
        </Text>
        <View style={{ height: 20, width: 20 }} />
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={{ marginBottom: 5 }}>
          <Text style={styles.label}>Consultation type</Text>
          <View style={styles.switchItemContainer}>
            <Text style={styles.switchItemText}>Clinic Consultation</Text>
            <Switch
              value={clinicConsultation}
              onValueChange={handleClinicConsultationToggle}
              color={colors.complementary}
            />
          </View>
          <View style={styles.switchItemContainer}>
            <Text style={styles.switchItemText}>Virtual Consultation</Text>
            <Switch
              value={virtualConsultation}
              onValueChange={handleVirtualConsultationToggle}
              color={colors.complementary}
            />
          </View>

          {clinicConsultation && (
            <>
              <View style={{ marginBottom: 5 }}>
                <Text style={styles.label}>Clinic Name</Text>
                <TextInput1
                  placeholder="Clinic name"
                  value={clinicName}
                  onChangeText={(text) => setClinicName(text)}
                />
              </View>
              <View style={{ marginBottom: 5 }}>
                <Text style={styles.label}>Clinic City</Text>
                <TextInput1
                  placeholder="Clinic city"
                  value={clinicCity}
                  onChangeText={(text) => setClinicCity(text)}
                />
              </View>
              <View style={{ marginBottom: 0 }}>
                <Text style={styles.label}>Clinic Address</Text>
                <TextInput1
                  placeholder="Clinic address"
                  value={clinicAddress}
                  onChangeText={(text) => setClinicAddress(text)}
                  style={{ marginBottom: 5 }}
                  multi={true}
                  no={10}
                />
              </View>
              <View>
                <Text style={[styles.label]}>Clinic Location</Text>
                <Text
                  style={{
                    color: colors.whitetext,
                    fontSize: 16,
                    marginBottom: 5,
                  }}
                >
                  Place the marker on the clinic location
                </Text>
                <View style={{ borderRadius: 10, overflow: "hidden" }}>
                  <MapView
                    style={styles.map}
                    region={region}
                    onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
                    onPress={(e) => {
                      setMarkerPosition(e.nativeEvent.coordinate);
                    }}
                  >
                    <Marker
                      coordinate={markerPosition}
                      draggable
                      onDragEnd={(e) => {
                        setMarkerPosition(e.nativeEvent.coordinate);
                      }}
                    />
                  </MapView>
                </View>
              </View>

              {/* <View style={styles.coordinatesContainer}>
                <Text>Latitude: {markerPosition.latitude}</Text>
                <Text>Longitude: {markerPosition.longitude}</Text>
              </View> */}
            </>
          )}
        </View>
        <View>
          <Text style={styles.label}>Consultation Fees (in ₹)</Text>
          <TextInput1
            placeholder="Consultation Fees"
            value={consultFees}
            onChangeText={(p) => setConsultFees(p)}
            kbtype={"numeric"}
          />
        </View>
        <View>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput1
            placeholder="Phone Number"
            value={phone}
            onChangeText={(p) => setPhone(p)}
            kbtype={"numeric"}
            maxlen={10}
          />
        </View>

        <View
          style={{
            alignSelf: "center",
            marginVertical: 20,
          }}
        >
          <Button1 onPress={() => saveChanges()} text="Save Changes" />
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.darkback,
    padding: 16,
  },
  label: {
    color: colors.lightgraytext,
    fontSize: 14,
  },

  switchItemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  switchItemText: {
    color: colors.whitetext,
    fontSize: 16,
    fontWeight: "500",
  },
  map: {
    width: "100%",
    height: 300,
  },
});
