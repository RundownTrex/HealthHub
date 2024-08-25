import { useEffect } from "react";
import { View, Text, StyleSheet, BackHandler } from "react-native";

import colors from "../../utils/colors";
import { useBottomSheet } from "../../context/BottomSheetContext";

export default function SupportScreen({ navigation }) {
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
    <View style={styles.container}>
      <Text style={{ color: colors.whitetext }}>Support Screen</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkback,
    justifyContent: "center",
    alignItems: "center",
  },
});
