import React from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import colors from "../utils/colors";
import { useBottomSheet } from "../context/BottomSheetContext";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import {
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const { isBottomSheetOpen } = useBottomSheet();
  const tabBarOffset = useSharedValue(0);

  tabBarOffset.value = withTiming(isBottomSheetOpen ? 100 : 0, {
    duration: 500,
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: tabBarOffset.value }],
      position: "absolute",
      bottom: 0,
      width: "100%",
    };
  });

  return (
    <Animated.View style={[styles.tabBarContainer, animatedStyle]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        let icon;
        let label;
        switch (route.name) {
          case "Home":
            icon = isFocused
              ? require("../assets/icons/home-selected.png")
              : require("../assets/icons/home.png");
            label = "Home";
            break;
          case "Appointment":
            icon = isFocused
              ? require("../assets/icons/appointments-selected.png")
              : require("../assets/icons/appointments.png");
            label = "Appointments";
            break;
          case "Messages":
            icon = isFocused
              ? require("../assets/icons/message-selected.png")
              : require("../assets/icons/message.png");
            label = "Messages";
            break;
          case "Profile":
            icon = isFocused
              ? require("../assets/icons/profile-selected.png")
              : require("../assets/icons/profile.png");
            label = "Profile";
            break;
        }

        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabBarButton}
          >
            <Image
              source={icon}
              style={{
                width: 30,
                height: 30,
                tintColor: isFocused ? colors.lightaccent : colors.tenpercent,
              }}
            />
            {isFocused && (
              <Text style={[styles.label, { color: colors.lightaccent }]}>
                {label}
              </Text>
            )}
          </Pressable>
        );
      })}
    </Animated.View>
  );
};

export default CustomTabBar;

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: "row",
    backgroundColor: colors.darkback, // Customize as needed
    paddingBottom: 10,
    paddingTop: 10,
    borderTopColor: colors.somewhatlightback,
    borderTopWidth: 1,
    height: 65,
  },
  tabBarButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 12,
    marginTop: 5,
  },
  iconContainer: {
    alignItems: "center",
  },
  labelContainer: {
    height: 20,
    justifyContent: "center",
  },
});
