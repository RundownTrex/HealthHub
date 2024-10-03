import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  Pressable,
  Dimensions,
  FlatList,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import Toast from "react-native-toast-message";
import { useIsFocused } from "@react-navigation/native";

import colors from "../../utils/colors";
import Button1 from "../../components/Button1";
import RoleContext from "../../context/RoleContext";
import { Ionicons } from "@expo/vector-icons";

const windowHeight = Dimensions.get("screen").height;
const menuitems = [
  {
    id: "1",
    title: "General profile",
    icon: require("../../assets/settingicons/profile.png"),
    screen: "GeneralProfileScreen",
  },
  {
    id: "2",
    title: "Medical profile",
    icon: require("../../assets/settingicons/medicalprofile.png"),
    screen: "MedicalProfileScreen",
  },
  {
    id: "3",
    title: "Medical records",
    icon: require("../../assets/settingicons/records.png"),
    screen: "MedicalRecordsScreen",
  },
  {
    id: "4",
    title: "Appointment History",
    icon: require("../../assets/settingicons/appointment-history.png"),
    screen: "AppointmentHistory",
  },
  {
    id: "5",
    title: "Support",
    icon: require("../../assets/settingicons/support.png"),
    screen: "SupportScreen",
  },
  {
    id: "6",
    title: "Settings",
    icon: require("../../assets/settingicons/settings.png"),
    screen: "SettingsScreen",
  },
  {
    id: "7",
    title: "Logout",
    icon: require("../../assets/settingicons/logout.png"),
    action: "logout",
  },
];

export default function Profile({ navigation }) {
  const { userRole, setUserRole } = useContext(RoleContext);
  const [pfp, setPfp] = useState(null);
  const [fetchedName, setFetchedName] = useState("");
  const [userPfp, setUserPfp] = useState(null);
  const isFocused = useIsFocused();
  const user = auth().currentUser;

  const fetchUserProfile = async () => {
    if (user) {
      try {
        const userDoc = await firestore()
          .collection("users")
          .doc(user.uid)
          .get();

        if (userDoc.exists) {
          const data = userDoc.data();
          console.log("Full name: ", data.firstname, " ", data.lastname);
          setUserPfp(data.pfpUrl);
          setFetchedName(data.firstname + " " + data.lastname);

          console.log(data);
        } else {
          console.log("No such document!");
          setUserPfp(user.photoURL);
        }
      } catch (error) {
        console.error("Error fetching document: ", error);
        setUserPfp(user.photoURL);
      }
    } else {
      console.log("No user is logged in");
    }
  };


  useEffect(() => {
    if (isFocused) {
      console.log(
        "Profile Screen is focused or returned to after navigating back"
      );
      fetchUserProfile();
    }
  }, [isFocused]);

  const confirmSignout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          onPress: signOut,
        },
      ],
      { cancelable: true }
    );
  };

  const signOut = async () => {
    try {
  
      if (user) {
        await firestore.collection("users").doc(user.uid).update({
          fcmToken: firestore.FieldValue.delete(),
        });
  
        await auth().signOut();
  
        setUserRole(null);
        await AsyncStorage.removeItem("userRole");
  
        Toast.show({
          type: "info",
          text1: "Signing you out",
          text2: "Redirecting...",
        });
  
        console.log("Logged out successfully!");
      }
    } catch (error) {
      console.error("Error during sign out: ", error);
      Toast.show({
        type: "error",
        text1: "Sign Out Error",
        text2: "Failed to sign out. Please try again.",
      });
    }
  };

  const CustomHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.avatar}>
          {userPfp !== null ? (
            <Image
              source={{ uri: userPfp }}
              defaultSource={require("../../assets/avatar.png")}
              style={{
                width: 90,
                height: 90,
                overflow: "hidden",
                borderRadius: 100,
                alignSelf: "center",
              }}
            />
          ) : (
            <Image
              source={require("../../assets/avatar.png")}
              style={{
                width: 90,
                height: 90,
                overflow: "hidden",
                borderRadius: 100,
                alignSelf: "center",
              }}
            />
          )}
        </View>
        <Text style={styles.name}>{fetchedName}</Text>
      </View>
    );
  };

  const ListItem = ({ title, icon, onPress }) => (
    <Pressable style={styles.item} onPress={onPress}>
      <Image source={icon} style={{ width: 24, height: 24 }} />
      <Text style={styles.listtitle}>{title}</Text>
      <Ionicons
        name="chevron-forward-outline"
        size={24}
        color={colors.whitetext}
      />
    </Pressable>
  );

  const handlePress = (item) => {
    if (item.action === "logout") {
      confirmSignout();
    } else {
      console.log(item.screen);
      navigation.navigate(item.screen);
    }
  };

  const renderItem = ({ item }) => (
    <ListItem
      title={item.title}
      icon={item.icon}
      onPress={() => handlePress(item)}
    />
  );

  return (
    <>
      <StatusBar backgroundColor={colors.lightaccent} />
      <View style={styles.container}>
        <View style={styles.custom}>
          <CustomHeader />
        </View>
        <FlatList
          style={{ marginTop: windowHeight / 4.4, marginBottom: 65 }}
          data={menuitems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.darkback,
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
  },

  headerContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    // flex: 1,
    // flexDirection: "column",
    // borderWidth: 1,
    // borderColor: colors.complementary,
    gap: windowHeight / 100,
  },

  title: {
    color: colors.whitetext,
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: "center",
    justifyContent: "center",
    marginTop: 16,
  },

  custom: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: windowHeight / 4.5,
    width: "auto",
    overflow: "hidden",
    zIndex: 999,
    backgroundColor: colors.lightaccent,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  name: {
    fontWeight: "bold",
    color: colors.whitetext,
    fontSize: 24,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 100,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  listtitle: {
    flex: 1,
    fontSize: 18,
    color: colors.whitetext,
    marginLeft: 20,
    fontWeight: "bold",
  },
});
