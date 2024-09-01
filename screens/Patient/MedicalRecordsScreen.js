import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  BackHandler,
  Pressable,
  Image,
  ScrollView,
} from "react-native";
import BackIcon from "../../assets/icons/BackIcon";
import { Dropdown } from "react-native-element-dropdown";

import colors from "../../utils/colors";
import { useBottomSheet } from "../../context/BottomSheetContext";
import Button1 from "../../components/Button1";

const bgroup = [
  { label: "Reports", value: "reports" },
  { label: "Prescriptions", value: "prescriptions" },
  { label: "Invoices", value: "invoices" },
  { label: "Vaccination records", value: "vaccinationrecords" },
];

export default function MedicalRecordsScreen({ navigation }) {
  const { toggleBottomSheet } = useBottomSheet();

  const [recordType, setRecordType] = useState("reports");

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

  return (
    <>
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
          Medical Records
        </Text>
        <View style={{ height: 20, width: 20 }} />
      </View>
      <View style={styles.container}>
        <Dropdown
          placeholder="Medical Records"
          data={bgroup}
          maxHeight={500}
          value={recordType}
          onChange={(item) => {
            setRecordType(item.value);
          }}
          style={{
            height: 45,
            borderColor: "gray",
            borderWidth: 1,
            paddingHorizontal: 15,
            paddingVertical: 12,
            borderRadius: 2,
            backgroundColor: colors.somewhatlightback,
            fontSize: 16,
            marginVertical: 5,
            borderRadius: 50,
          }}
          placeholderStyle={{
            color: colors.lightgraytext,
          }}
          labelField="label"
          valueField="value"
          itemContainerStyle={{
            backgroundColor: colors.darkback,
            borderRadius: 8,
          }}
          selectedTextStyle={{
            color: colors.whitetext,
          }}
          mode="modal"
          itemTextStyle={{
            color: colors.whitetext,
          }}
          containerStyle={{
            backgroundColor: colors.darkback,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: colors.darkback,
          }}
          activeColor={colors.somewhatlightback}
          backgroundColor="#000000b3"
        />
        <ScrollView contentContainerStyle={styles.rercordscontainer}>
          <View style={styles.noRecords}>
            <View
              style={{
                alignItems: "center",
                alignSelf: "center",
              }}
            >
              <Image
                source={require("../../assets/medical-record.png")}
                style={{ height: 150, width: 150 }}
              />
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 22,
                  color: colors.whitetext,
                }}
              >
                No medical records found
              </Text>
              <Text
                style={{
                  color: colors.whitetext,
                  textAlign: "center",
                  fontSize: 14,
                }}
              >
                You can keep a track of reports, prescriptions and invoices
                here.
              </Text>
            </View>

            <Button1
              text="Add a record"
              onPress={() => navigation.navigate("UploadMedicalRecord")}
            />
          </View>
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
    // justifyContent: "center",
    // alignItems: "center",
  },

  rercordscontainer: {
    flex: 1,
    justifyContent: "center",
  },

  noRecords: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    gap: 50,
  },
});
