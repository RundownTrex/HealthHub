import React, { useContext } from "react";
import { View, Text, StyleSheet, StatusBar } from "react-native";
import colors from "../../utils/colors";
import Button1 from "../../components/Button1";
import RoleContext from "../../context/RoleContext";
import auth from "@react-native-firebase/auth";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Profile() {
  const { userRole, setUserRole } = useContext(RoleContext);

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
        {/* <Image source={}/> */}
        <Text style={{ marginTop: 50 }}>Image here</Text>
        <Text style={styles.name}>John Doe</Text>
      </View>
    );
  };

  return (
    <>
      <StatusBar backgroundColor={colors.lightaccent} />
      <View style={styles.container}>
        <View style={styles.custom}>
          <CustomHeader />
        </View>

        <Button1
          onPress={signOut}
          text={"Sign out "}
          style={{ alignSelf: "center" }}
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
    height: 275,
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
    fontSize: 25,
    alignSelf: "center",
    marginTop: 275 - 180,
  },
});
