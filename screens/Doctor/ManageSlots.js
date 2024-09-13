import { useEffect } from "react";
import { View, Text, Pressable, StyleSheet, BackHandler } from "react-native";
import { useBottomSheet } from "../../context/BottomSheetContext";

import colors from "../../utils/colors";
import BackIcon from "../../assets/icons/BackIcon";

export default function ManageSlots({ navigation }) {
  const { toggleBottomSheet } = useBottomSheet();

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
          Manage Slots
        </Text>
        <View style={{ height: 20, width: 20 }} />
      </View>
      <View>
        <Text>Manage Slots here</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.darkback,
    padding: 16,
  },
});
