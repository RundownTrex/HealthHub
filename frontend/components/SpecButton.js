import React from "react";
import { Image, Text, StyleSheet, Pressable, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";

import colors from "../utils/colors";
import { Divider } from "react-native-paper";

export default function SpecButton({ imageUrl, title }) {
  const navigation = useNavigation();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withTiming(0.95, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 100 });
  };

  const handleClick = (title) => {
    switch (title) {
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
      case "Pediatrics":
        var send = "Pediatrician";
        break;
      case "Heart specialist":
        var send = "Cardiologist";
        break;
      case "Orthopedics":
        var send = "Orthopedist";
        break;
      case "Neurology":
        var send = "Neurologist";
        break;
      case "ENT":
        var send = "Otolaryngologist";
        break;
      case "Urology":
        var send = "Urologist";
        break;
      case "Oncology":
        var send = "Oncologist";
        break;
      case "Endocrinology":
        var send = "Endocrinologist";
        break;
      case "Ophthalmology":
        var send = "Ophthalmologist";
        break;
      case "Gastroenterology":
        var send = "Gastroenterologist";
        break;
      case "Rheumatology":
        var send = "Rheumatologist";
        break;
      case "Nephrology":
        var send = "Nephrologist";
        break;
      case "Allergy & Immunology":
        var send = "Immunologist";
        break;
      case "Pulmonology":
        var send = "Pulmonologist";
        break;
      case "Hematology":
        var send = "Hematologist";
        break;
    }    

    navigation.navigate("Providers", { send });
  };

  return (
    <>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => handleClick(title)}
        style={[styles.container]}
      >
        <Animated.View style={[animatedStyle, styles.container]}>
          <View style={styles.imagecontainer}>
            <Image source={imageUrl} style={styles.imagestyle} />
          </View>
          <Text style={styles.title}>{title}</Text>
        </Animated.View>
      </Pressable>
      <Divider style={{ marginHorizontal: 5 }} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    marginVertical: 5,
  },
  title: {
    color: colors.whitetext,
    fontWeight: "400",
    fontSize: 16,
    alignSelf: "center",
    marginLeft: 20,
  },
  imagestyle: {
    height: 38,
    width: 38,
  },
  imagecontainer: {
    backgroundColor: colors.complementary,
    padding: 8,
    borderRadius: 100,
  },
});
