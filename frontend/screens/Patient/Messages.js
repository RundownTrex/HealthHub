import { useRef, useState, useEffect } from "react";
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
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { format } from "date-fns";

import colors from "../../utils/colors";

export default function Messages({ navigation }) {
  const { width } = Dimensions.get("screen");
  const searchBarRef = useRef();
  const [recentChats, setRecentChats] = useState([]);
  const [patientData, setPatientData] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const user = auth().currentUser;

  useEffect(() => {
    const unsubscribe = firestore()
      .collection("recentChats")
      .where("participants", "array-contains", user.uid)
      .onSnapshot((snapshot) => {
        const chats = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        chats.sort((a, b) => b.timestamp - a.timestamp);
        setRecentChats(chats);
      });

    return () => unsubscribe();
  }, [user.uid]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const patientDoc = await firestore()
          .collection("users")
          .doc(user.uid)
          .get();

        const patientData = patientDoc.data();
        setPatientData(patientData);
      } catch {
        console.error("error");
      }
    };
    fetchData();
  }, [user]);

  const filteredChats = recentChats.filter((chat) =>
    chat.doctorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          onChangeText={setSearchQuery}
          value={searchQuery}
          rippleColor={colors.lightaccent}
          traileringIconColor={colors.lightaccent}
          selectionHandleColor={colors.lightaccent}
          selectionColor={colors.lightaccent}
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

        <FlatList
          data={filteredChats}
          style={{ padding: 16, paddingTop: 0 }}
          ListEmptyComponent={() => (
            <View
              style={{
                marginTop: 20,
                flex: 1,
              }}
            >
              <Text style={styles.emptyText}>No Chats here!</Text>
              <Text style={styles.emptyTextDesc}>
                Select a doctor profile from the booked appointments and press
                "Chat now" to start a chat.
              </Text>
            </View>
          )}
          renderItem={({ item }) => (
            <Pressable
              style={styles.chatItem}
              onPress={() => {
                firestore().collection("recentChats").doc(item.id).update({
                  patientUnread: 0,
                });

                navigation.navigate("DoctorChat", {
                  doctorName: item.doctorName,
                  patientId: user.uid,
                  doctorId: item.doctorId,
                  patientPfp: patientData.pfpUrl,
                  userpfp: item.doctorPfp,
                  patientName: `${patientData.firstname} ${patientData.lastname}`,
                });
              }}
            >
              <Avatar.Image
                source={{ uri: item.doctorPfp }}
                style={styles.chatAvatar}
                size={width / 6}
              />
              <View style={styles.chatTextContainer}>
                <Text style={styles.chatName}>{item.doctorName}</Text>
                <Text style={styles.chatMessage} numberOfLines={1}>
                  {item.latestMessage}
                </Text>
              </View>
              <View style={styles.chatTimeContainer}>
                <Text style={styles.chatTime}>
                  {format(item.timestamp?.toDate(), "hh:mm a")}
                </Text>
                {item.patientUnread > 0 ? (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadText}>{item.patientUnread}</Text>
                  </View>
                ) : (
                  <View style={[styles.unreadBadge, { opacity: 0 }]}>
                    <Text style={[styles.unreadText, { opacity: 0 }]}></Text>
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
    backgroundColor: colors.complementary,
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

  emptyText: {
    color: colors.whitetext,
    fontWeight: "bold",
    fontSize: 18,
    alignSelf: "center",
    textAlign: "center",
  },

  emptyTextDesc: {
    color: colors.lightgraytext,
    fontWeight: "500",
    alignSelf: "center",
    textAlign: "center",
    marginTop: 5,
  },
});
