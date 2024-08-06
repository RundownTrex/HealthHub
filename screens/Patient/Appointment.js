import { useState, useRef, useMemo, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Image,
} from "react-native";
// import { useNavigation, useIsFocused } from "@react-navigation/native";

import colors from "../../utils/colors";
import { Searchbar } from "react-native-paper";
import IconButton from "../../components/IconButton";

import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

const data = [
  { id: 1, icon: require("../../assets/gp.png"), label: "General physician" },
  { id: 2, icon: require("../../assets/gp.png"), label: "Skin & Hair" },
  { id: 3, icon: require("../../assets/gp.png"), label: "Women health" },
  { id: 4, icon: require("../../assets/gp.png"), label: "Dental care" },
  { id: 5, icon: require("../../assets/gp.png"), label: "Mental wellness" },
  {
    id: 6,
    icon: require("../../assets/icons/down-arrow.png"),
    label: "View all",
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

  const handleClick = (label) => {
    if (label !== "View all") {
      navigation.navigate("Providers");
      // console.log(label);
    } else {
      bottomsheetref.current?.snapToIndex(0);
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
        index={-1}
        handleIndicatorStyle={{
          display: "none",
          backgroundColor: colors.whitetext,
        }}
        backgroundStyle={{
          backgroundColor: colors.darkback,
          borderColor: colors.tenpercent,
          borderWidth: 1,
        }}
        onChange={(index) => {
          if (index !== 0) {
            setBottomSheetOpened(false);
          }
        }}
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
    fontSize: 22,
    alignSelf: "center",
    marginTop: 16,
  },
});
