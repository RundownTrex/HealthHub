import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  BackHandler,
  Pressable,
  Image,
  Linking,
} from "react-native";
import { Divider } from "react-native-paper";
import call from "react-native-phone-call";

import colors from "../../utils/colors";
import { useBottomSheet } from "../../context/BottomSheetContext";
import LoadingOverlay from "../../components/LoadingOverlay";
import BackIcon from "../../assets/icons/BackIcon";

export default function SupportScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);

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

  const dialNumber = (phoneNumber) => {
    const args = {
      number: phoneNumber,
      prompt: true,
      skipCanOpen: true,
    };

    call(args).catch((error) => {
      Toast.show({
        type: "error",
        text1: "Can't place a call right now",
        text2: error,
      });
    });
  };

  const handleEmailPress = () => {
    const email = "aditya.goriwale@gmail.com"; // Replace with your support email address
    const subject = "Support Request"; // Replace with your email subject
    const body = "<YOUR COMPLAINT/REQUST HERE>"; // Replace with your email body content

    const url = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    Linking.openURL(url).catch((err) =>
      console.error("Error opening email client:", err)
    );
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
          Support
        </Text>
        <View style={{ height: 20, width: 20 }} />
      </View>
      <View style={styles.container}>
        <Text style={styles.label}>Contact us</Text>
        <View style={{ marginBottom: 16 }}>
          <Pressable
            style={styles.item}
            onPress={() => dialNumber("1234567890")}
          >
            <Image
              source={require("../../assets/contactus-call.png")}
              style={styles.icon}
            />
            <Text style={styles.itemText}>Call</Text>
          </Pressable>

          <Divider />

          <Pressable style={styles.item} onPress={() => handleEmailPress()}>
            <Image
              source={require("../../assets/contactus-email.png")}
              style={styles.icon}
            />
            <Text style={styles.itemText}>Email</Text>
          </Pressable>
          {/* <Divider />
          <Pressable style={styles.item} onPress={() => console.log("Called")}>
            <Image
              source={require("../../assets/contactus-call.png")}
              style={styles.icon}
            />
            <Text style={styles.itemText}>Call</Text>
          </Pressable> */}
        </View>
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
  label: {
    color: colors.lightgraytext,
    fontSize: 14,
  },
  icon: {
    height: 35,
    width: 35,
  },
  itemText: {
    color: colors.whitetext,
    fontWeight: "500",
    fontSize: 18,
    marginLeft: 25,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    // borderWidth: 1,
    paddingVertical: 12,
  },
});
