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
} from "react-native";
import colors from "../../utils/colors";
import Button1 from "../../components/Button1";
import RoleContext from "../../context/RoleContext";
import auth from "@react-native-firebase/auth";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
    title: "Support",
    icon: require("../../assets/settingicons/support.png"),
    screen: "SupportScreen",
  },
  {
    id: "5",
    title: "Settings",
    icon: require("../../assets/settingicons/settings.png"),
    screen: "SettingsScreen",
  },
  {
    id: "6",
    title: "Logout",
    icon: require("../../assets/settingicons/logout.png"),
    action: "logout",
  },
];

export default function Profile() {
  const { userRole, setUserRole } = useContext(RoleContext);
  const [userPfp, setUserPfp] = useState(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUserProfile = () => {
      const user = auth().currentUser;

      if (user) {
        setUserPfp(user.photoURL);
        setUserName(user.displayName);
      } else {
        console.log("No user is logged in");
      }
    };

    fetchUserProfile();
  }, []);

  const signOut = () => {
    auth()
      .signOut()
      .then(() => {
        setUserRole(null);
        AsyncStorage.removeItem("userRole");
        Toast.show({
          type: "info",
          text1: "Signing you out",
          text2: "Redirecting...",
        });
      });
  };

  const CustomHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Profile</Text>
        <View style={styles.avatar}>
          <Image
            source={{ uri: userPfp }}
            style={{
              width: 90,
              height: 90,
              overflow: "hidden",
              borderRadius: 100,
              alignSelf: "center",
            }}
          />
        </View>
        <Text style={styles.name}>{userName}</Text>
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
      signOut();
      console.log("Logged out!");
    } else {
      console.log(item.screen);
      // navigation.navigate(item.screen);
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
          style={{ marginTop: windowHeight / 3.2, marginBottom: 65 }}
          data={menuitems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />

        {/* <Button1
          onPress={signOut}
          text={"Sign out "}
          style={{ alignSelf: "center" }}
        /> */}
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
    // flex: 1,
    // flexDirection: "column",
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
    height: windowHeight / 3.3,
    width: "auto",
    overflow: "hidden",
    zIndex: 999,
    backgroundColor: colors.lightaccent,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  name: {
    fontWeight: "bold",
    color: colors.whitetext,
    fontSize: 24,
    alignSelf: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 100,
    overflow: "hidden",
    marginTop: 16,
    marginBottom: 20,
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
