import { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  Pressable,
} from "react-native";
import { Searchbar, Avatar, MD3LightTheme } from "react-native-paper";

import colors from "../../utils/colors";

const messages = [
  {
    id: "1",
    name: "Dr. Upul",
    pfp: require("../../assets/doctor-pfp.jpg"),
    message:
      "Worem consectetur adipiscing elit. Bruh what are you even talking about blud pluh test test",
    time: "12:50",
    unread: 2,
  },
  {
    id: "2",
    name: "Dr. Upul",
    pfp: require("../../assets/doctor-pfp.jpg"),
    message: "Worem consectetur adipiscing elit.",
    time: "12:50",
    unread: 2,
  },
  {
    id: "3",
    name: "Dr. Upul",
    pfp: require("../../assets/doctor-pfp.jpg"),
    message: "Worem consectetur adipiscing elit.",
    time: "12:50",
    unread: 0,
  },
  {
    id: "4",
    name: "Dr. Test",
    pfp: require("../../assets/doctor-pfp.jpg"),
    message: "Worem consectetur adipiscing elit.",
    time: "12:50",
    unread: 0,
  },
  {
    id: "5",
    name: "Dr. Test",
    pfp: require("../../assets/doctor-pfp.jpg"),
    message: "Worem consectetur adipiscing elit.",
    time: "12:50",
    unread: 0,
  },
  {
    id: "6",
    name: "Dr. Test",
    pfp: require("../../assets/doctor-pfp.jpg"),
    message: "Worem consectetur adipiscing elit.",
    time: "12:50",
    unread: 0,
  },
  {
    id: "7",
    name: "Dr. Test",
    pfp: require("../../assets/doctor-pfp.jpg"),
    message: "Worem consectetur adipiscing elit.",
    time: "12:50",
    unread: 0,
  },
  {
    id: "8",
    name: "Dr. Test",
    pfp: require("../../assets/doctor-pfp.jpg"),
    message: "Worem consectetur adipiscing elit.",
    time: "12:50",
    unread: 0,
  },
  {
    id: "9",
    name: "Dr. Test",
    pfp: require("../../assets/doctor-pfp.jpg"),
    message: "Worem consectetur adipiscing elit.",
    time: "12:50",
    unread: 0,
  },
  {
    id: "10",
    name: "Dr. Test",
    pfp: require("../../assets/doctor-pfp.jpg"),
    message: "Worem consectetur adipiscing elit.",
    time: "12:50",
    unread: 0,
  },
  {
    id: "11",
    name: "Dr. Test",
    pfp: require("../../assets/doctor-pfp.jpg"),
    message: "Worem consectetur adipiscing elit.",
    time: "12:50",
    unread: 0,
  },
  {
    id: "12",
    name: "Dr. Test",
    pfp: require("../../assets/doctor-pfp.jpg"),
    message: "Worem consectetur adipiscing elit.",
    time: "12:50",
    unread: 0,
  },
  {
    id: "13",
    name: "Dr. Test",
    pfp: require("../../assets/doctor-pfp.jpg"),
    message: "Worem consectetur adipiscing elit.",
    time: "12:50",
    unread: 0,
  },
];

export default function Messages({ navigation }) {
  const { width } = Dimensions.get("screen");

  const searchBarRef = useRef();

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
          Messages
        </Text>
      </View>
      <View style={styles.container}>
        <Searchbar
          placeholder="Search"
          // onChangeText={setSearchQuery}
          // value={searchQuery}
          rippleColor={colors.lightaccent}
          traileringIconColor={colors.lightaccent}
          selectionHandleColor={colors.lightaccent}
          theme={MD3LightTheme}
          // loading={true}
          ref={searchBarRef}
          style={{
            backgroundColor: colors.whitetext,
            height: 45,
            alignItems: "center",
            alignSelf: "center",
            margin: 16,
            borderRadius: 8,
          }}
          inputStyle={{
            color: colors.blacktext,
            fontSize: 16,
            alignSelf: "center",
          }}
        />

        {/* <View style={{ padding: 16 }}>
          <Text style={styles.sectionTitle}>Active Now</Text>
          <FlashList
            estimatedItemSize={100}
            horizontal
            data={activeNow}
            renderItem={({ item }) => (
              <View style={styles.activeUser}>
                <Avatar.Image
                  size={width / 6}
                  source={item.avatar}
                  style={styles.avatar}
                />
                <View style={styles.onlineIndicator} />
              </View>
            )}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
          />
        </View> */}

        <FlatList
          data={messages}
          style={{ padding: 16 }}
          renderItem={({ item }) => (
            <Pressable
              style={styles.chatItem}
              onPress={() => {
                navigation.navigate("DoctorChat", {
                  doctorname: item.name,
                  pfp: item.pfp,
                });
              }}
            >
              <Avatar.Image
                source={item.pfp}
                style={styles.chatAvatar}
                size={width / 6}
              />
              <View style={styles.chatTextContainer}>
                <Text style={styles.chatName}>{item.name}</Text>
                <Text style={styles.chatMessage} numberOfLines={1}>
                  {item.message}
                </Text>
              </View>
              <View style={styles.chatTimeContainer}>
                <Text style={styles.chatTime}>{item.time}</Text>
                {item.unread > 0 ? (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadText}>{item.unread}</Text>
                  </View>
                ) : (
                  <View style={[styles.unreadBadge, { opacity: 0 }]}>
                    <Text style={[styles.unreadText, { opacity: 0 }]}>
                      {item.unread}
                    </Text>
                  </View>
                )}
              </View>
            </Pressable>
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkback,
    paddingBottom: 70,
    // alignItems: "center",
    // justifyContent: "center",
  },
  onlineIndicator: {
    width: 20,
    height: 20,
    backgroundColor: "#0f0", // Green color
    borderRadius: 100,
    position: "absolute",
    bottom: 0,
    right: 0,
    borderColor: colors.darkback,
    borderWidth: 3,
  },

  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },
  chatAvatar: {
    marginRight: 12,
  },
  chatTextContainer: {
    flex: 1,
  },
  chatName: {
    color: colors.whitetext,
    fontWeight: "bold",
    fontSize: 18,
  },
  chatMessage: {
    color: colors.lightgraytext,
    marginTop: 4,
  },
  chatTimeContainer: {
    alignItems: "flex-end",
  },
  chatTime: {
    color: colors.lightgraytext,
  },
  unreadBadge: {
    backgroundColor: colors.complementary, // Red color
    borderRadius: 100,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  unreadText: {
    color: colors.whitetext,
    fontWeight: "bold",
    fontSize: 12,
    alignSelf: "center",
  },
});
