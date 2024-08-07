import { useState, useRef, useMemo, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Image,
  LayoutAnimation,
  UIManager,
  Platform,
} from "react-native";
// import { useNavigation, useIsFocused } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";

import colors from "../../utils/colors";
import { Searchbar } from "react-native-paper";
import IconButton from "../../components/IconButton";
import SpecButton from "../../components/SpecButton";

import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

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

  // const navigation = useNavigation();
  const [bottomSheetOpened, setBottomSheetOpened] = useState(false);

  const bottomsheetref = useRef();
  const snapPoints = useMemo(() => ["89%"], []);

  useEffect(() => {
    console.log(bottomSheetOpened);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    navigation.getParent().setOptions({
      tabBarStyle: {
        height: 60,
        backgroundColor: colors.darkback,
        paddingTop: 0,
        marginTop: 0,
        borderTopWidth: 1,
        borderTopColor: colors.somewhatlightback,
        display: bottomSheetOpened ? "none" : "flex",
      },
    });
  }, [bottomSheetOpened]);

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
      setBottomSheetOpened(true);
    }
  };

  const handleBottomSheetClose = () => {
    bottomsheetref.current?.close();
  };

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
            alignSelf: "center",
            backgroundColor: colors.superlightaccent,
            marginBottom: 16,
            // height: 45,
            // padding: 0,
          }}
          onChangeText={setSearchQuery}
          value={searchQuery}
          elevation={5}
          placeholder="Search for specialities"
        />
        <Text
          style={{ color: colors.whitetext, fontWeight: "bold", fontSize: 22 }}
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
          // backgroundColor: colors.whitetext,
        }}
        backgroundStyle={{
          backgroundColor: colors.darkback,
          // borderWidth: 1,
        }}
        onChange={(index) => {
          if (index !== 0) {
            setBottomSheetOpened(false);
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
