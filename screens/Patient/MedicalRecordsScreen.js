import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  BackHandler,
  Pressable,
  Image,
  RefreshControl,
  Alert,
  FlatList,
} from "react-native";
import BackIcon from "../../assets/icons/BackIcon";
import { Dropdown } from "react-native-element-dropdown";
import AsyncStorage from "@react-native-async-storage/async-storage";

import colors from "../../utils/colors";
import { useBottomSheet } from "../../context/BottomSheetContext";
import Button1 from "../../components/Button1";

const bgroup = [
  { label: "Reports", value: "Reports" },
  { label: "Prescriptions", value: "Prescriptions" },
  { label: "Invoices", value: "Invoices" },
  { label: "Vaccination records", value: "Vaccination records" },
];

export default function MedicalRecordsScreen({ navigation }) {
  const { toggleBottomSheet } = useBottomSheet();
  const [recordType, setRecordType] = useState("Reports");
  const [records, setRecords] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

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

  const fetchRecords = useCallback(async () => {
    try {
      const storedRecords = await AsyncStorage.getItem("medicalRecords");
      if (storedRecords) {
        const allRecords = JSON.parse(storedRecords);
        console.log(allRecords);
        const filteredRecords = allRecords.filter(
          (record) => record.type === recordType
        );
        console.log(filteredRecords);
        setRecords(filteredRecords);
      }
    } catch (error) {
      console.error("Error fetching records:", error);
    }
  }, [recordType]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords, recordType]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchRecords().finally(() => setRefreshing(false));
  }, [fetchRecords]);

  const deleteRecord = useCallback(
    async (indexToDelete) => {
      try {
        const updatedRecords = records.filter(
          (_, index) => index !== indexToDelete
        );
        await AsyncStorage.setItem(
          "medicalRecords",
          JSON.stringify(updatedRecords)
        );
        setRecords(updatedRecords);
      } catch (error) {
        console.error("Error deleting record:", error);
      }
    },
    [records]
  );

  const confirmDelete = (index) => {
    Alert.alert(
      "Delete Record",
      "Are you sure you want to delete this record?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: () => deleteRecord(index) },
      ],
      { cancelable: true }
    );
  };

  const renderRecord = ({ item, index }) => (
    <View style={styles.recordContainer}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View style={{ padding: 16 }}>
          <Text style={styles.recordName}>Name: {item.name}</Text>
          <Text style={styles.recordType}>Type: {item.type}</Text>
          <Text style={styles.filename}>File: {item.fileName}</Text>
        </View>
        <Pressable
          style={styles.deleteButton}
          onPress={() => confirmDelete(index)}
        >
          <Image
            source={require("../../assets/red-cross.png")}
            style={{ height: 35, width: 35 }}
          />
        </Pressable>
      </View>
      <Pressable
        style={({ pressed }) => [
          styles.downloadButton,
          pressed && { opacity: 0.8 },
        ]}
      >
        <Text style={styles.downloadButtonText}>Download</Text>
      </Pressable>
    </View>
  );

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
            fetchRecords;
          }}
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          labelField="label"
          valueField="value"
          itemContainerStyle={styles.itemContainerStyle}
          selectedTextStyle={styles.selectedTextStyle}
          mode="modal"
          itemTextStyle={styles.itemTextStyle}
          containerStyle={styles.dropdownContainerStyle}
          activeColor={colors.somewhatlightback}
          backgroundColor="#000000b3"
        />

        <FlatList
          data={records}
          renderItem={renderRecord}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.recordsContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.noRecords}>
              <View style={{ alignItems: "center" }}>
                <Image
                  source={require("../../assets/medical-record.png")}
                  style={styles.noRecordsImage}
                />
                <Text style={styles.noRecordsText}>
                  No medical records found
                </Text>
                <Text style={styles.noRecordsSubtext}>
                  You can keep track of reports, prescriptions, and invoices
                  here.
                </Text>
              </View>

              <Button1
                text="Add record"
                onPress={() => navigation.navigate("UploadMedicalRecord")}
              />
            </View>
          }
        />
      </View>

      {records.length > 0 && (
        <View style={styles.addButtonContainer}>
          <Button1
            text="Add record"
            onPress={() => navigation.navigate("UploadMedicalRecord")}
          />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkback,
    padding: 16,
  },
  dropdown: {
    height: 55,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 50,
    backgroundColor: colors.somewhatlightback,
    fontSize: 10,
    marginVertical: 5,
  },
  placeholderStyle: {
    color: colors.lightgraytext,
  },
  itemContainerStyle: {
    backgroundColor: colors.darkback,
    borderRadius: 8,
  },
  selectedTextStyle: {
    color: colors.whitetext,
  },
  itemTextStyle: {
    color: colors.whitetext,
  },
  dropdownContainerStyle: {
    backgroundColor: colors.darkback,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.darkback,
  },
  recordsContainer: {
    paddingVertical: 16,
  },
  recordContainer: {
    backgroundColor: colors.tenpercent,
    // padding: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  recordName: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.blacktext,
  },
  recordType: {
    fontSize: 16,
    marginTop: 8,
    color: colors.blacktext,
  },
  filename: {
    fontSize: 14,
    marginTop: 4,
    color: "#555",
  },
  deleteButton: {
    backgroundColor: colors.error,
    padding: 10,
    alignSelf: "flex-start",
  },
  deleteButtonText: {
    color: colors.whitetext,
    fontWeight: "bold",
  },
  noRecords: {
    alignItems: "center",
    gap: 50,
    marginTop: 50,
  },
  noRecordsImage: {
    height: 150,
    width: 150,
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
  addButtonContainer: {
    position: "absolute",
    bottom: 20,
    left: 16,
  },

  downloadButton: {
    margin: 10,
    marginTop: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.complementary,
    borderRadius: 5,
    padding: 8,
  },
  downloadButtonText: {
    color: colors.whitetext,
    fontSize: 15,
  },
});
