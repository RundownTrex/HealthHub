import { useState, useRef, useMemo, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Image,
  BackHandler,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";

import colors from "../../utils/colors";
import { Searchbar } from "react-native-paper";
import IconButton from "../../components/IconButton";
import SpecButton from "../../components/SpecButton";
import { useBottomSheet } from "../../context/BottomSheetContext";

import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";

const data = [
  {
    id: 1,
    icon: require("../../assets/baseddoctor.png"),
    label: "General physician",
  },
  { id: 2, icon: require("../../assets/skin-hair.png"), label: "Skin & Hair" },
  {
    id: 3,
    icon: require("../../assets/women-health.png"),
    label: "Women health",
  },
  { id: 4, icon: require("../../assets/dental.png"), label: "Dental care" },
  {
    id: 5,
    icon: require("../../assets/mental-wellness.png"),
    label: "Mental wellness",
  },
  {
    id: 6,
    icon: require("../../assets/icons/down-arrow.png"),
    label: "View all",
  },
];

const specs = [
  {
    id: 1,
    icon: require("../../assets/baseddoctor.png"),
    label: "General physician",
  },
  { id: 2, icon: require("../../assets/skin-hair.png"), label: "Skin & Hair" },
  {
    id: 3,
    icon: require("../../assets/women-health.png"),
    label: "Women health",
  },
  { id: 4, icon: require("../../assets/dental.png"), label: "Dental care" },
  {
    id: 5,
    icon: require("../../assets/mental-wellness.png"),
    label: "Mental wellness",
  },
  {
    id: 6,
    icon: require("../../assets/listicons/placeholder.png"),
    label: "Pediatrics",
  },
  {
    id: 7,
    icon: require("../../assets/listicons/placeholder.png"),
    label: "Heart specialist",
  },
  {
    id: 8,
    icon: require("../../assets/listicons/placeholder.png"),
    label: "Orthopedics",
  },
  {
    id: 9,
    icon: require("../../assets/listicons/placeholder.png"),
    label: "Neurology",
  },
  {
    id: 10,
    icon: require("../../assets/listicons/placeholder.png"),
    label: "ENT",
  },
  {
    id: 11,
    icon: require("../../assets/listicons/placeholder.png"),
    label: "Urology",
  },
  {
    id: 12,
    icon: require("../../assets/listicons/placeholder.png"),
    label: "Oncology",
  },
  {
    id: 13,
    icon: require("../../assets/listicons/placeholder.png"),
    label: "Endocrinology",
  },
  {
    id: 14,
    icon: require("../../assets/listicons/placeholder.png"),
    label: "Ophthalmology",
  },
  {
    id: 15,
    icon: require("../../assets/listicons/placeholder.png"),
    label: "Gastroenterology",
  },
  {
    id: 16,
    icon: require("../../assets/listicons/placeholder.png"),
    label: "Rheumatology",
  },
  {
    id: 17,
    icon: require("../../assets/listicons/placeholder.png"),
    label: "Nephrology",
  },
  {
    id: 18,
    icon: require("../../assets/listicons/placeholder.png"),
    label: "Allergy & Immunology",
  },
  {
    id: 19,
    icon: require("../../assets/listicons/placeholder.png"),
    label: "Pulmonology",
  },
  {
    id: 20,
    icon: require("../../assets/listicons/placeholder.png"),
    label: "Hematology",
  },
];

export default function Appointment({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const isFocused = useIsFocused();

  const { toggleBottomSheet } = useBottomSheet();

  const bottomsheetref = useRef();
  const snapPoints = useMemo(() => ["89%"], []);

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    []
  );

  useEffect(() => {
    if (isFocused) {
      console.log("Screen is focused or returned to after navigating back");
      bottomsheetref.current?.close();
    }
  }, [isFocused]);

  const handleClick = (label) => {
    if (label !== "View all") {
      switch (label) {
        case "General physician":
          var send = "General physician";
          break;
        case "Skin & Hair":
          var send = "Dermatologist";
          break;
        case "Women health":
          var send = "Gynecologist";
          break;
        case "Dental care":
          var send = "Dentist";
          break;
        case "Mental wellness":
          var send = "Psychiatrist";
          break;
      }
      console.log(send);
      navigation.navigate("Providers", { send });
    } else {
      bottomsheetref.current?.expand();
      toggleBottomSheet(true);
    }
  };

  const handleBottomSheetClose = () => {
    bottomsheetref.current?.close();
  };

  useEffect(() => {
    const backaction = () => {
      if (bottomsheetref.current?.close) {
        bottomsheetref.current.close();
        return true;
      }
      return false;
    };

    const backhandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backaction
    );

    return () => backhandler.remove();
  }, []);

  return (
    <>
      <View
        style={{
          height: 60,
          backgroundColor: colors.lightaccent,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: colors.whitetext,
            fontWeight: "bold",
            fontSize: 18,
          }}
        >
          Appointments
        </Text>
      </View>
      <View style={styles.container}>
        <Searchbar
          onPress={() => navigation.navigate("Providers", { focus: true })}
          style={{
            backgroundColor: colors.whitetext,
            width: "100%",
            // height: 45,
            alignItems: "center",
            // marginBottom: 16,
          }}
          inputStyle={{
            color: colors.blacktext,
            // fontSize: 18,
            alignSelf: "center",
          }}
          onChangeText={setSearchQuery}
          value={searchQuery}
          elevation={5}
          placeholder="Search for specialities"
        />
        <Text
          style={{
            color: colors.whitetext,
            fontWeight: "bold",
            fontSize: 22,
            marginTop: 10,
          }}
        >
          Most searched specialities
        </Text>
        <View style={styles.avatarcontainer}>
          <FlatList
            data={data}
            renderItem={({ item }) => (
              <IconButton
                icon={item.icon}
                label={item.label}
                fun={() => handleClick(item.label)}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            numColumns={3}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.listContainer}
          />
        </View>
      </View>
      <BottomSheet
        ref={bottomsheetref}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        index={-1}
        handleIndicatorStyle={{
          display: "none",
        }}
        backgroundStyle={{
          backgroundColor: colors.darkback,
        }}
        onChange={(index) => {
          if (index !== 0) {
            toggleBottomSheet(false);
          }
        }}
        enableHandlePanningGesture={false}
        enableContentPanningGesture={false}
      >
        <BottomSheetView style={styles.bottomsheetcontainer}>
          <Pressable
            style={{
              padding: 10,
              borderColor: colors.whitetext,
              // borderWidth: 1,
              justifyContent: "center",
              alignItems: "center",
              width: 50,
              height: 50,
              borderRadius: 100,
              backgroundColor: colors.complementary,
              alignSelf: "center",
            }}
            onPress={handleBottomSheetClose}
          >
            <Image
              source={require("../../assets/icons/cross-mark.png")}
              style={{ height: 20, width: 20 }}
            />
          </Pressable>
          <Text style={styles.sheetheading}>
            Choose from the top specialities
          </Text>
          <FlashList
            data={specs}
            renderItem={({ item }) => (
              <SpecButton title={item.label} imageUrl={item.icon} />
            )}
            estimatedItemSize={100}
            contentContainerStyle={{
              paddingBottom: 16,
            }}
            scrollEnabled
          />
        </BottomSheetView>
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    bottomtab: {
      height: 60,
      backgroundColor: colors.darkback,
      paddingTop: 0,
      marginTop: 0,
      borderTopWidth: 1,
      borderTopColor: colors.somewhatlightback,
    },
    flex: 1,
    // alignItems: "center",
    padding: 16,
    backgroundColor: colors.darkback,
  },
  avatarcontainer: {
    marginTop: 10,
    flexDirection: "row",
  },
  row: {
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 16,
  },
  listContainer: {
    alignItems: "center",
  },
  bottomsheetcontainer: {
    flex: 1,
    backgroundColor: colors.darkback,
    padding: 16,
    paddingTop: 0,
  },
  sheetheading: {
    color: colors.whitetext,
    fontWeight: "bold",
    fontSize: 24,
    textAlign: "center",
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 10,
  },
});
