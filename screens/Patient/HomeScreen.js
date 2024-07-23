import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  StatusBar,
} from "react-native";
import colors from "../../utils/colors";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import Svg, { Path } from "react-native-svg";

function LocationIcon(props) {
  return (
    <Svg
      width={15}
      height={15}
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M13.023.103L.842 5.725c-1.405.656-.937 2.718.562 2.718h5.154v5.153c0 1.5 2.061 1.968 2.717.562l5.622-12.18c.469-1.125-.75-2.344-1.874-1.875z"
        fill="#fff"
      />
    </Svg>
  );
}

const CustomHeader = () => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.greetingText}>Good morning,</Text>
        <Text style={styles.nameText}>John Doe</Text>
      </View>
      <View style={styles.locationBlock}>
        <LocationIcon />
        <Text style={styles.locationText}>Mumbai</Text>
      </View>
    </View>
  );
};

const H_MAX_HEIGHT = 80;
const H_MIN_HEIGHT = 0;
const H_SCROLL_DISTANCE = H_MAX_HEIGHT - H_MIN_HEIGHT;

export default function HomeScreen() {
  const scrollOffsetY = useRef(new Animated.Value(0)).current;
  const headerScrollHeight = scrollOffsetY.interpolate({
    inputRange: [0, H_SCROLL_DISTANCE],
    outputRange: [H_MAX_HEIGHT, H_MIN_HEIGHT],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.lightaccent} />
      <ScrollView
        contentContainerStyle={[styles.scrollable, { paddingTop: 80 }]}
        horizontal={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={true}
        // pagingEnabled={true}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <Text style={styles.text}>Home screen</Text>
        <Text style={styles.text}>Home screen</Text>
        <Text style={styles.text}>Home screen</Text>
        <Text style={styles.text}>Home screen</Text>
        <Text style={styles.text}>Home screen</Text>
        <Text style={styles.text}>Home screen</Text>
        <Text style={styles.text}>Home screen</Text>
        <Text style={styles.text}>Home screen</Text>
        <Text style={styles.text}>Home screen</Text>
        <Text style={styles.text}>Home screen</Text>
        <Text style={styles.text}>Home screen</Text>
        <Text style={styles.text}>Home screen</Text>
        <Text style={styles.text}>Home screen</Text>
        <Text style={styles.text}>Home screen</Text>
        <Text style={styles.text}>Home screen</Text>
        <Text style={styles.text}>Home screen</Text>
        <Text style={styles.text}>Home screen</Text>
        <Text style={styles.text}>Home screen</Text>
        <Text style={styles.text}>Home screen</Text>
        <Text style={styles.text}>Home screen</Text>
        <Text style={styles.text}>Home screen</Text>
        <Text style={styles.text}>Home screen</Text>
        <Text style={styles.text}>Home screen</Text>
        <Text style={styles.text}>Home screen</Text>
        <Text style={styles.text}>Home screen</Text>
        <Text style={styles.text}>Home screen</Text>
        <Text style={styles.text}>Home screen</Text>
        <Text style={styles.text}>Home screen</Text>
        <Text style={styles.text}>Home screen</Text>
        <Text style={styles.text}>Home screen</Text>
        <Text style={styles.text}>Home screen</Text>
        <Text style={styles.text}>Home screen</Text>
        <Text style={styles.text}>Home screen</Text>
        <Text style={styles.text}>Home screen</Text>
        <Text style={styles.text}>Home screen</Text>
        <Text style={styles.text}>Home screen</Text>
        <Text style={styles.text}>Home screen</Text>
        <Text style={styles.text}>Sigma</Text>
      </ScrollView>
      <Animated.View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: headerScrollHeight,
          width: "auto",
          overflow: "hidden",
          zIndex: 999,
          // STYLE
          // borderBottomColor: "#EFEFF4",
          // borderBottomWidth: 1,
          // padding: 10,
          backgroundColor: colors.lightaccent,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
        }}
      >
        <CustomHeader />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    height: "auto",
    backgroundColor: colors.darkback,
    // alignItems: "center",
    justifyContent: "center",
  },

  scrollable: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 10,
    marginTop: 10,
  },

  text: {
    color: colors.whitetext,
    fontSize: 20,
  },
  label: {
    fontSize: 14,
  },

  headstyle: {
    backgroundColor: colors.lightaccent,
    // height: ,
    // overflow: "hidden",
    // backgroundColor: "transparent",
  },

  locationBlock: {
    display: "flex",
    flexDirection: "row",
    gap: 6,
    marginRight: 16,
    // borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    // borderWidth: 1,
  },
  locationText: {
    color: colors.whitetext,
    fontSize: 14,
    fontWeight: "600",
  },
  headerContainer: {
    justifyContent: "center",
    // borderWidth: 1,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  titleContainer: {
    // borderWidth: 1,
    // width: "35%",
    display: "flex",
    alignContent: "center",
    justifyContent: "center",
    marginLeft: 16,
  },
  greetingText: {
    color: colors.whitetext,
    fontSize: 12,
  },

  nameText: {
    color: colors.whitetext,
    fontSize: 18,
    fontWeight: "bold",
  },
});
